import React, { useEffect, useState } from 'react'
import { Container, Flex, useBoolean, Box, Button } from '@chakra-ui/react'

import { getBalanceAmount, beautifyAmount } from 'utils/formatBalance'
import { useTokenContract } from 'hooks/useContract'
import AccountModal from './AccountModal'
import AccountBox from './AccountBox'
import Polling from './Polling'
import useWalletStat from 'hooks/useWalletStat'

const Footer = () => {
  const { account } = useWalletStat()
  const [accountModalOpen, setAccountModalOpen] = useBoolean(false)
  const [walletModalOpen, setWalletModalOpen] = useBoolean(false)

  const [accountBalance, setAccountBalance] = useState('0.00')
  const tokenContract = useTokenContract()

  useEffect(() => {
    if (!account) return
    if (account && walletModalOpen) {
      setWalletModalOpen.off()
    }
    if (tokenContract) {
      tokenContract.methods
        .balanceOf(account)
        .call()
        .then((balance) => {
          setAccountBalance(beautifyAmount(getBalanceAmount(balance)))
        })
    } else {
      setAccountBalance('0.00')
    }
  }, [tokenContract, account, setWalletModalOpen, walletModalOpen])

  return (
    <>
      <Container maxW="full" p="4">
        <Flex
          justifyContent={{ base: 'space-between', lg: 'flex-end' }}
          alignItems="center"
        >
          <Box display={{ base: 'flex', lg: 'none' }}>
            {account ? (
              <AccountBox
                hideBalance
                address={account}
                balance={accountBalance}
                onAccountClick={setAccountModalOpen.toggle}
              />
            ) : (
              <Button variant="outline" onClick={setWalletModalOpen.toggle}>
                Connect to wallet
              </Button>
            )}
          </Box>
          <Polling />
        </Flex>
      </Container>
      <AccountModal
        isOpen={accountModalOpen}
        onClose={setAccountModalOpen.off}
      />
    </>
  )
}

export default Footer
