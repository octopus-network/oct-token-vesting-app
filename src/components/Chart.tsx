import React, { useState, useEffect, useRef, useCallback } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip, 
  YAxis,
  ResponsiveContainer,
  Line
} from 'recharts';

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  HStack,
  Skeleton,
  Text,
} from '@chakra-ui/react';

import useSWR, { SWRConfig } from 'swr';

import {
  TriangleUpIcon,
  TriangleDownIcon
} from '@chakra-ui/icons';

const CustomTooltip = ({ 
  label,
  active,
  payload
}: {
  label?: any;
  active?: boolean;
  payload?: any;
}) => {

  if (active && payload && payload.length) {
    return (
      <Box>
        <Text>{label}</Text>
      </Box>
    );
  }
  return null;
}

const Chart = () => {

  const [days, setDays] = useState(1);

  let lowestPrice = 999999, highestPrice = 0;
  const [currentTimePrice, setCurrentTimePrice] = useState([0, 0]);
  const [lastTimePrice, setLastTimePrice] = useState([0, 0]);

  const [changedPercent, setChangedPercent] = useState(0);

  const [prices, setPrices] = useState([]);
  const [klineData, setKlineData] = useState([]);

  const { data: marketChart } = useSWR(() => `octopus-network/market_chart?vs_currency=usd&days=${days}`);

  useEffect(() => {
    if (!marketChart) {
      setKlineData([]);
      return;
    }
    const { prices } = marketChart;
    setPrices(prices);
  }, [marketChart]);

  useEffect(() => {
  
    const tmpArr = prices.map(([time, price]) => {
      if (price < lowestPrice) {
        lowestPrice = price;
      }
      if (price > highestPrice) {
        highestPrice = price;
      }
      return {
        humanTime: dayjs(time).format('HH:MM A'),
        time,
        price
      }
    });
    setKlineData(tmpArr);
    
    if (prices.length) {
      setCurrentTimePrice(prices[prices.length - 1]);
      setLastTimePrice(prices[0]);
    } else {
      setCurrentTimePrice([0, 0]);
      setLastTimePrice([0, 0]);
    }
    
  }, [prices]);

  useEffect(() => {
    if (lastTimePrice[1] == 0) {
      setChangedPercent(0);
    } else {
      setChangedPercent(
        (currentTimePrice[1]-lastTimePrice[1])*100/lastTimePrice[1]
      );
    }
    
  }, [lastTimePrice, currentTimePrice]);

  const changeDays = (v) => {
    setPrices([]);
    setTimeout(() => {
      setDays(v);
    }, 100);
  }

  const onAreaMouseMove = useCallback(({ isTooltipActive, activePayload }) => {
    if (isTooltipActive) {
      if (activePayload && activePayload.length) {
        const { price, time } = activePayload[0].payload;
        setCurrentTimePrice([time, price]);
      }
    } else if (prices.length) {
      setCurrentTimePrice(prices[prices.length - 1]);
    } else {
      setCurrentTimePrice([0, 0]);
    }
  }, [prices]);

  return (
    
    <Box>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading fontSize="2xl">Price Chart</Heading>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mt="4">
        <HStack spacing="3">
          <Skeleton isLoaded={prices.length > 0}>
          <Heading fontSize="xl">{currentTimePrice[1].toFixed(2)} USD</Heading>
          </Skeleton>
          {
            changedPercent != 0 &&
            <Flex color={changedPercent < 0 ? 'red' : 'green' } alignItems="center" fontSize="sm">
              {changedPercent < 0 ? <TriangleDownIcon /> : <TriangleUpIcon /> }
              <Text ml="1">{changedPercent.toFixed(2)}%</Text>
            </Flex>
          }
        </HStack>
        <ButtonGroup color="gray">
          <Button size="sm" onClick={() => changeDays(1)} color={days === 1 ? 'black' : 'gray'}
            variant={ days === 1 ? 'solid' : 'ghost' }>24 hours</Button>
          <Button size="sm" onClick={() => changeDays(7)} color={days === 7 ? 'black' : 'gray'}
            variant={ days === 7 ? 'solid' : 'ghost' }>1 week</Button>
          <Button size="sm" onClick={() => changeDays(30)} color={days === 30 ? 'black' : 'gray'}
            variant={ days === 30 ? 'solid' : 'ghost' }>1 month</Button>
        </ButtonGroup>
      </Flex>
      <Skeleton isLoaded={prices.length > 0}>
      <Box height="360px" mt="6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={klineData}
            onMouseMove={onAreaMouseMove}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e3964e" stopOpacity={0.5}/>
                <stop offset="70%" stopColor="#e3964e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis hide={true} domain={[lowestPrice, highestPrice]} />
            <XAxis axisLine={false} tickLine={false} minTickGap={150}
              dataKey="humanTime" interval="preserveStartEnd" />
            <Tooltip position={{ y: 0 }} content={<CustomTooltip />} />
            <Area type="monotone" strokeWidth={2} dataKey="price"
              stroke="#e3964e" fill="url(#colorPrice)"/>
          </AreaChart>
        </ResponsiveContainer>
      </Box>
      </Skeleton>
    </Box>
  );
}

const ChartWithSWR = () => (
  <SWRConfig 
    value={{
      refreshInterval: 5000,
      fetcher: (api, data) => {
        return axios({
          url: `https://api.coingecko.com/api/v3/coins/${api}`,
          method: 'get',
          data,
          withCredentials: false,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then(res => res.data)
      }
    }}
  >
    <Chart />
  </SWRConfig>
);

export default ChartWithSWR;