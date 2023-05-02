import React from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import {
  Flex,
  Heading,
  SimpleGrid,
  Box,
  Text,
  Icon,
  Skeleton,
  Link,
} from '@chakra-ui/react'

import { FcComboChart, FcCurrencyExchange, FcGlobe } from 'react-icons/fc'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { beautifyAmount } from 'utils/formatBalance'

import useSWR from 'swr'

const StatBox = ({ title, value, icon }) => {
  return (
    <Box p="6" boxShadow="octoShadow" borderRadius="8" bg="#fff">
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="gray" fontSize="sm">
          {title}
        </Text>
        {icon}
      </Flex>
      <Box mt="1" pt="3" pb="2">
        <Skeleton isLoaded={!!value}>
          <Heading
            fontSize="xl"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {value || 'loading...'}
          </Heading>
        </Skeleton>
      </Box>
    </Box>
  )
}

const totalIssuance = 100000000

const beginTime = dayjs('2021-09-01')
const endTime = dayjs('2024-09-01')

const totalDays = endTime.diff(beginTime, 'days')

const Overview = () => {
  let pastDays = dayjs().diff(beginTime, 'days')

  if (pastDays > totalDays) {
    pastDays = totalDays
  }

  const circulation = Number(
    (((35 + (65 * pastDays) / totalDays) * totalIssuance) / 100).toFixed(2)
  )

  const { data: coinData } = useSWR(
    `https://api.coingecko.com/api/v3/coins/octopus-network`,
    (url) => axios.get(url).then((res) => res.data)
  )

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading fontSize="2xl">Market Overview</Heading>
        <Link
          href="https://www.coingecko.com/en/coins/octopus-network"
          target="_blank"
          color="gray"
        >
          <Flex alignItems="center" fontSize="sm">
            Detail <ExternalLinkIcon ml={1} />
          </Flex>
        </Link>
      </Flex>
      <SimpleGrid columns={3} spacing="8" mt="6">
        <StatBox
          title="Circulation"
          value={circulation ? `${beautifyAmount(circulation)} OCT` : ''}
          icon={<Icon as={FcComboChart} w="6" h="6" />}
        />
        <StatBox
          title="Market Cap"
          value={
            coinData && circulation
              ? '$' +
                beautifyAmount(
                  coinData.market_data.current_price.usd * circulation
                )
              : ''
          }
          icon={<Icon as={FcGlobe} w="6" h="6" />}
        />
        <StatBox
          title="24 Hour Trading Vol"
          value={
            coinData
              ? '$' + beautifyAmount(coinData.market_data.total_volume.usd)
              : ''
          }
          icon={<Icon as={FcCurrencyExchange} w="6" h="6" />}
        />
      </SimpleGrid>
    </>
  )
}

export default Overview
