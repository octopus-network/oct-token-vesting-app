import React from 'react'

import { Flex, Box, Button, Text, Heading, Spinner } from '@chakra-ui/react'

import useTxns from 'hooks/useTransactions'
import StatusIcon from './StatusIcon'

const AccountBox = ({
  address,
  balance,
  onAccountClick,
  hideBalance = false,
}) => {
  const { pendingTxns } = useTxns()
  return (
    <Flex
      bg="rgb(237, 238, 242)"
      alignItems="center"
      borderRadius="10"
      p="1px"
      overflow="hidden"
    >
      {hideBalance === false && (
        <Box pl="4" pr="2">
          <Text>{balance} OCT</Text>
        </Box>
      )}

      {pendingTxns > 0 ? (
        <Button
          alignItems="center"
          p="2"
          bg="rgba(255, 255, 255, 1)"
          borderRadius="10"
          onClick={onAccountClick}
        >
          <Text>{pendingTxns} Pending</Text>
          <Spinner size="xs" speed="1s" ml="2" />
        </Button>
      ) : (
        <Button
          bg="rgba(255, 255, 255, 1)"
          p="2"
          borderRadius="10"
          onClick={onAccountClick}
        >
          <Heading fontSize="md" mr="1">
            {address.substr(0, 6)}...{address.substr(-4)}
          </Heading>
        </Button>
      )}
    </Flex>
  )
}

export default AccountBox
