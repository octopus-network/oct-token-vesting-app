import React, { useEffect, useState } from 'react'

import { Box, Button, Flex, Heading, Input, useToast } from '@chakra-ui/react'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'
import { getDecimalAmount } from 'utils/formatBalance'

export default function IssueBenefitPanel({ contract }) {
  const [isOwner, setIsOwner] = useState(false)
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date())
  const [days, setDays] = useState('')

  const { account, library } = useWeb3React()
  useEffect(() => {
    contract.methods
      .owner()
      .call()
      .then((res) => {
        setIsOwner(res === account)
        // setIsOwner(true)
      })
  }, [contract, account])

  const toast = useToast()

  const onSubmit = async () => {
    try {
      const web3 = new Web3(library.currentProvider)
      if (!web3.utils.isAddress(address)) {
        throw new Error('Invalid address')
      }
      if (!amount.trim() || Number(amount.trim()) <= 0) {
        throw new Error('Invalid amount')
      }
      if (!days.trim() || Number(days.trim()) <= 0) {
        throw new Error('Invalid days')
      }
      const totalAmount = getDecimalAmount(amount).toString()
      const releaseStartTime = Math.floor(date.getTime() / 1000)
      const daysOfTimelock = Number(days)
      await contract.methods
        .issueBenefitTo(address, totalAmount, releaseStartTime, daysOfTimelock)
        .send({
          from: account,
        })
      setAddress('')
      setAmount('')
      toast({
        title: 'Success',
        description: 'Issued benefit',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }

  if (!isOwner) {
    return null
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <Box p={6} pb={8} boxShadow="octoShadow" borderRadius="8" bg="#fff">
        <Flex alignItems="center" justifyContent="space-between">
          <Heading fontSize="2xl">Add Beneficiary</Heading>
        </Flex>
        <Box mt={5} borderRadius={5}>
          <Input
            type="text"
            value={address}
            placeholder="Please input the beneficiary address"
            onChange={(e) => setAddress(e.target.value)}
            autoFocus
          />
        </Box>
        <Box mt={5} borderRadius={5}>
          <Input
            type="number"
            value={amount}
            placeholder="Please input amount"
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />
        </Box>
        <Box mt={5} borderRadius={5}>
          <SingleDatepicker
            name="date-input"
            date={date}
            onDateChange={setDate}
          />
        </Box>
        <Box mt={5} borderRadius={5}>
          <Input
            type="number"
            value={days}
            placeholder="Please input days of lock"
            onChange={(e) => setDays(e.target.value)}
            autoFocus
          />
        </Box>
        <Box mt={5} borderRadius={5}>
          <Button
            width="100%"
            size="lg"
            variant="solid"
            colorScheme="octoColor"
            onClick={onSubmit}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </div>
  )
}
