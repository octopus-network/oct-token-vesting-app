import React, { useState } from 'react';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import styled from '@emotion/styled';

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
  Icon,
  InputRightElement,
  IconButton,
  Link,
  Center
} from '@chakra-ui/react';

import { CloseIcon } from '@chakra-ui/icons';
import { AiOutlineGithub } from 'react-icons/ai';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import vestingAbi from 'abis/vesting.json';
import { multiVestingContractAddress } from 'config/addresses';
import otto from 'assets/otto.png';

const localVestingAddress = window.localStorage.getItem('oct-vesting-address');

const OpenButton = styled(Button)`
  svg {
    transition: .6s ease;
    transform: translateX(0px);
  }
  &:hover {
    svg {
      transform: translateX(5px);
    }
  }
`;

const Welcome = ({ onOpen }) => {
  const [vestingAddress, setVestingAddress] = useState(localVestingAddress || '');
  const { library, account } = useWeb3React();
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

  const onInputMultiVestingContract = () => {
    setVestingAddress(multiVestingContractAddress);
  }

  return (
    <Container maxW="460px">
      <Flex flexDirection="column" pt={6}>
        <VStack>
          <Box w="96px" h="123px">
            <Image src={otto} w="96px" />
          </Box>
          <Heading>Welcome Back :)</Heading>
          <Text color="gray">Open with your vesting contract</Text>
        </VStack>
        <Box mt={12}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text color="gray">Input Address</Text>
            <Button size="sm" variant="link" colorScheme="blue" onClick={onInputMultiVestingContract}>multi-vesting contract</Button>
          </Flex>
          <InputGroup size="lg" mt={3}>
            <Input bg="white" autoFocus placeholder="vesting contract address/beneficiary address"
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
          <OpenButton size="lg" isFullWidth colorScheme="octoColor" onClick={_onOpen}
            disabled={!vestingAddress}>
            <Text>Open</Text>
            <Icon as={HiOutlineArrowNarrowRight} ml="2" />
          </OpenButton>
        </Box>
        <Box mt={4}>
          <Button as={Link} fontSize="sm" fontWeight="normal" isFullWidth variant="link" href="https://github.com/octopus-network/oct-token-eth" target="_blank">
            <Icon as={AiOutlineGithub} w={4} h={4} mr={1} /> Source Code
          </Button>
        </Box>
        
      </Flex>
    </Container>
  );
}

export default Welcome;