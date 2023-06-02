import React, { useState } from 'react'

import { useWeb3React } from '@web3-react/core'
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

export const Root: React.FC = () => {
  const [vestingContract, setVestingContract] = useState<any>()
  const [multiVestingContract, setMultiVestingContract] = useState<any>()

  const [isDesktop] = useMediaQuery('(min-width: 62em)')

  const { library } = useWeb3React()

  const onOpen = (contract: any) => {
    if (
      multiVestingContractAddress.toLocaleLowerCase() ===
      contract.options.address.toLocaleLowerCase()
    ) {
      const web3 = new Web3(library.provider)
      const contract = new web3.eth.Contract(
        multiVestingAbi as any,
        multiVestingContractAddress
      )
      setMultiVestingContract(contract)
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
