import React, { useState } from 'react'

import Web3 from 'web3'

import { GridItem, Grid, Container, Box, useMediaQuery } from '@chakra-ui/react'

import multiVestingAbi from 'abis/multiVesting.json'
import { multiVestingContractAddress } from 'config/addresses'
import Header from 'components/Header'
import Footer from 'components/Footer'
import Welcome from 'components/Welcome'
import Overview from 'components/Overview'
import Panel from 'components/Panel'
import Chart from 'components/Chart'
import { MultiVestingPage } from './MultiVestingPage'
import { useConnectWallet } from '@web3-onboard/react'
import { ethers, Contract } from 'ethers'

export const Root: React.FC = () => {
  const [vestingContract, setVestingContract] = useState<any>()
  const [multiVestingContract, setMultiVestingContract] = useState<Contract>()

  const [isDesktop] = useMediaQuery('(min-width: 62em)')

  const [{ wallet }] = useConnectWallet()

  const onOpen = (contract: any) => {
    if (
      multiVestingContractAddress.toLocaleLowerCase() ===
      contract.options.address.toLocaleLowerCase()
    ) {
      const ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')

      const _contract = new ethers.Contract(
        multiVestingContractAddress,
        multiVestingAbi,
        ethersProvider
      )
      setMultiVestingContract(_contract)
    } else {
      setVestingContract(contract)
    }
  }

  return (
    <>
      <Header />
      <Container maxW="container.xl" p="20px" minH="calc(100vh - 162px)">
        {multiVestingContract ? (
          <MultiVestingPage multiVestingContract={multiVestingContract} />
        ) : vestingContract ? (
          <Grid
            templateColumns={isDesktop ? 'repeat(9, 1fr)' : 'repeat(3, 1fr)'}
            gap="16"
          >
            {isDesktop && (
              <GridItem colSpan={6}>
                <Overview />
                <Box mt="12" />
                <Chart />
              </GridItem>
            )}
            <GridItem colSpan={3}>
              <Panel contract={vestingContract} />
            </GridItem>
          </Grid>
        ) : (
          <Welcome onOpen={onOpen} />
        )}
      </Container>
      <Footer />
    </>
  )
}
