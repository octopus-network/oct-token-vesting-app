import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';

import {
  Box,
  Heading,
  Flex,
  Text,
  Button,
  Center,
  VStack,
  Skeleton,
  useBoolean,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  Icon
} from '@chakra-ui/react';

import styled from 'styled-components';
import { useEffect } from 'react';
import { MdRefresh } from 'react-icons/md';
import { AiOutlineWarning } from 'react-icons/ai';
import { getBalanceAmount, beautifyAmount } from 'utils/formatBalance';
import useTxns from 'hooks/useTransactions';

const RefreshIcon = styled(Icon)<{ refreshing: boolean; }>`
  animation: ${({ refreshing }) => (refreshing ? 'rotate360 .3s cubic-bezier(0.83, 0, 0.17, 1) infinite' : 'none')};
  transform: translateZ(0);
`;

const Panel = ({ contract }) => {
  const { account } = useWeb3React();
  const [totalBenefit, setTotalBenefit] = useState('');
  const [unreleasedBalance, setUnreleasedBalance] = useState('');
  const [releasedBalance, setReleasedBalance] = useState('');
  const [withdrawedBalance, setWithdrawedBalance] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useBoolean();
  const { appendTx } = useTxns();

  useEffect(() => {
    if (!contract) {
      return;
    }
    onRefresh();
  }, [contract]);

  const onRefresh = () => {
    setIsRefreshing(true);
    Promise.all([
      contract.methods.totalBenefit().call(),
      contract.methods.unreleasedBalance().call(),
      contract.methods.releasedBalance().call(),
      contract.methods.withdrawedBalance().call(),
    ]).then(([benefit, unreleased, released, withdrawed]) => {
      setTotalBenefit(beautifyAmount(getBalanceAmount(benefit)));
      setUnreleasedBalance(beautifyAmount(getBalanceAmount(unreleased)));
      setReleasedBalance(beautifyAmount(getBalanceAmount(released)));
      setWithdrawedBalance(beautifyAmount(getBalanceAmount(withdrawed)));
      setTimeout(() => {
        setIsRefreshing(false);
      }, 300);

    });
  }

  const onWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      await contract
        .methods
        .withdraw()
        .send({
          from: account
        }, (err, hash) => {

          if (!err) {
            appendTx({
              addedTime: new Date().getTime(),
              hash,
              from: account,
              summary: `Withdrawed OCT`
            });
            setTimeout(() => {
              setIsWithdrawing(false);
            }, 1500);
          }
        }).catch(err => {
          throw err;
        });
        
    } catch({code, message}) {
      console.log(code, message);
      if (code === 4001) {
        setModalMessage('Transaction rejected.');
      } else if (message) {
        setModalMessage(message);
      } else {
        setModalMessage('Unknown error.')
      }
      setIsModalOpen.on();
      setIsWithdrawing(false);
    }
    
  }

  return (
    <>
    <Box p={6} pb={8} boxShadow="octoShadow" borderRadius="8" bg="#fff">
      <Flex alignItems="center" justifyContent="space-between">
        <Heading fontSize="2xl">Vesting Info</Heading>
        <Flex fontSize="sm" onClick={onRefresh} color="gray" cursor="pointer" alignItems="center">
          <RefreshIcon refreshing={isRefreshing} as={MdRefresh} w="4" h="4" />
          <Text>Refresh</Text>
        </Flex>
      </Flex>
      <Box mt={6} p={4} bg="rgba(120, 120, 150, .06)" borderRadius={5}>
        <VStack spacing={3} alignItems="flex-start">
          <Flex color="gray" alignItems="flex-end">
            <Text minW="140px" fontSize="sm" mr={1}>Total Benefit: </Text>
            <Skeleton isLoaded={!!totalBenefit}>
              <Heading fontSize="md" color="black">{totalBenefit} OCT</Heading>
            </Skeleton>
          </Flex>
          <Flex color="gray" alignItems="flex-end">
            <Text minW="140px" fontSize="sm" mr={1}>Unreleased Balance: </Text>
            <Skeleton isLoaded={!!unreleasedBalance}>
              <Heading fontSize="md" color="black">{unreleasedBalance} OCT</Heading>
            </Skeleton>
          </Flex>
          <Flex color="gray" alignItems="flex-end">
            <Text minW="140px" fontSize="sm" mr={1}>Released Balance: </Text>
            <Skeleton isLoaded={!!releasedBalance}>
              <Heading fontSize="md" color="black">{releasedBalance} OCT</Heading>
            </Skeleton>
          </Flex>
        </VStack>
      </Box>
      <Box mt={6}>
        <Button isFullWidth={true} size="lg" variant="solid" onClick={onWithdraw} isLoading={isWithdrawing}
          isDisabled={!contract || isWithdrawing}  borderRadius="30" colorScheme="octoColor">Withdraw</Button>
      </Box>
      <Center mt={2}>
        <Skeleton isLoaded={!!withdrawedBalance}>
          <Text color="gray" fontSize="sm">Withdrawed: {withdrawedBalance} OCT</Text>
        </Skeleton>
      </Center>
    </Box>
    <Modal isOpen={isModalOpen} onClose={setIsModalOpen.off}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Error</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <Icon as={AiOutlineWarning} w="16" h="16" color="red" />
            <Box textAlign="center">
              <Heading fontSize="lg" color="red">
                {modalMessage}
              </Heading>
            </Box>
          </VStack>
          <Box mt="8" mb="2">
            <Button onClick={setIsModalOpen.off} isFullWidth={true}>Dismiss</Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  )
}

export default Panel;