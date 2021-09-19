import React, { useState } from 'react';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';

import {
  Image,
  Heading,
  VStack,
  Text,
  Flex,
  Box,
  Input,
  Container,
  Button,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';

import { CloseIcon } from '@chakra-ui/icons';
import vestingAbi from 'abis/vesting.json';
import otto from 'assets/otto.png';

const localVestingAddress = window.localStorage.getItem('oct-vesting-address');

const Welcome = ({ onOpen }) => {
  const [vestingAddress, setVestingAddress] = useState(localVestingAddress || '');
  const { library, chainId, account } = useWeb3React();
  const toast = useToast();

  const _onOpen = () => {
    window.localStorage.setItem('oct-vesting-address', vestingAddress);
    try {
      if (!account) {
        throw Error('Please connect to your wallet first');
      }
      const web3 = new Web3(library.provider);
      const contract = new web3.eth.Contract(vestingAbi as any, vestingAddress);
      onOpen(contract);
    } catch(err) {
      toast({
        position: 'top-right',
        description: err.toString(),
        status: 'error'
      });
    }
  }

  const onClearInput = () => {
    window.localStorage.removeItem('oct-vesting-address');
    setVestingAddress('');
  }

  return (
    <Container maxW="480px">
      <Flex flexDirection="column" pt={6}>
        <VStack>
          <Box w="96px" h="123px">
            <Image src={otto} w="96px" />
          </Box>
          <Heading>Welcome Back~</Heading>
          <Text color="gray">Open with your vesting contract</Text>
        </VStack>
        <Box mt={12}>
          <InputGroup size="lg">
            <Input bg="white" autoFocus placeholder="your vesting contract address"
              value={vestingAddress} onChange={(e: any) => setVestingAddress(e.target.value)} />
            {
              vestingAddress &&
              <InputRightElement>
                <IconButton aria-label="clear" size="xs" isRound onClick={onClearInput}>
                  <CloseIcon w={2} h={2} />
                </IconButton>
              </InputRightElement>
            }
          </InputGroup>
        </Box>
        <Box mt={6}>
          <Button size="lg" isFullWidth colorScheme="octoColor" onClick={_onOpen}
            disabled={!vestingAddress}>Open</Button>
        </Box>
      </Flex>
    </Container>
  );
}

export default Welcome;