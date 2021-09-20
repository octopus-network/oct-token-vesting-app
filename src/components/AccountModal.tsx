import React from 'react';
import { useWeb3React } from '@web3-react/core';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Flex,
  Text,
  Button,
  Heading,
  HStack,
  Link,
  List,
  Icon,
  ListItem,
  useClipboard,
  Spinner,
} from '@chakra-ui/react';

import { CopyIcon, CheckIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { AiOutlineWarning, AiOutlineCheckCircle } from 'react-icons/ai';
import useTxns from 'hooks/useTransactions';
import StatusIcon from './StatusIcon';

const AccountModal = ({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: VoidFunction;
}) => {
  const { account, chainId, deactivate } = useWeb3React();
  const { hasCopied, onCopy } = useClipboard(account);
  const { txns, clearTxns } = useTxns();

  const onLogout = () => {
    onClose();
    deactivate();
  }

  const explorerUrl = chainId === 1 ? 'https://www.etherscan.io' : 'https://ropsten.etherscan.io';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent ml={2} mr={2}>
        <ModalHeader>Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box borderRadius={10} p={4} border="1px solid #eee">
            <Flex justifyContent="space-between" alignItems="center">
              <Text color="gray">Connected Account</Text>
              <Button size="sm" variant="outline" onClick={onLogout}>Logout</Button>
            </Flex>
            <Flex alignItems="center" mt={2}>
              <StatusIcon />
              <Heading fontSize="xl" ml={1}>{account?.substr(0, 6)}...{account?.substr(-4)}</Heading>
            </Flex>
            <HStack alignItems="center" mt={2} spacing={4}>
              <Button variant="unstyled" size="sm" color="gray" onClick={onCopy}>
                { hasCopied ? <CheckIcon mr={1} /> : <CopyIcon mr={1} /> }
                { hasCopied ? 'Copied' : 'Copy Address' }
              </Button>
              <Button as={Link} variant="link" size="sm" color="gray" href={`${explorerUrl}/address/${account}`} target="_blank">
                <ExternalLinkIcon mr={1} /> View on Explorer
              </Button>
            </HStack>
          </Box>
          
        </ModalBody>
        <Box bg="#f3f3f9" p={4} mt={2} borderBottomRadius="8">
          {
            txns.length ?
            <>
              <Flex alignItems="center" justifyContent="space-between">
                <Text>Recent Transactions</Text>
                <Button variant="unstyled" size="sm" color="red" onClick={clearTxns}>Clear All</Button>
              </Flex> 
              <List spacing={3} mt={3} maxH="180px" overflowY="auto">
                {
                  txns.map((tx, idx) => (
                    <ListItem key={`tx-${idx}`}>
                      <Flex justifyContent="space-between" alignItems="center">
                        <Link href={`${explorerUrl}/tx/${tx.hash}`} target="_blank" color={
                          tx.receipt ?
                          (
                            tx.receipt.status === 1 ? 'green' : 'red'
                          ) :
                          'gray'
                        }>
                          <HStack>
                            <Heading fontSize="sm">{tx.summary}</Heading>
                            <ExternalLinkIcon ml="1" />
                          </HStack>
                        </Link>
                        {
                          tx.receipt ?
                          (
                            tx.receipt.status === 1 ?
                            <Icon as={AiOutlineCheckCircle} color="green" /> :
                            <Icon as={AiOutlineWarning} color="red" /> 
                          ) :
                          <Spinner size="xs" color="gray" speed="1s" />
                        }
                      </Flex>
                    </ListItem>
                  ))
                }
              </List>
            </> :
            <Text>Your transactions will appear here...</Text>
          }
          
        </Box>
      </ModalContent>
      
    </Modal>
  );
}

export default AccountModal;