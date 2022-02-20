import React, { useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';

import {
  GridItem,
  Grid,
  Container,
  Box,
  useMediaQuery
} from '@chakra-ui/react';

import multiVestingAbi from 'abis/multiVesting.json';
import { multiVestingContractAddress } from 'config/addresses';
import { getBalanceAmount, ZERO } from 'utils/formatBalance';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Welcome from 'components/Welcome';
import Overview from 'components/Overview';
import Panel from 'components/Panel';
import Chart from 'components/Chart';
import { MultiVestingPage } from './MultiVestingPage';

export const Root: React.FC = () => {

  const [vestingContract, setVestingContract] = useState();
  const [multiVestingContract, setMultiVestingContract] = useState<any>();
  const [issuedBenefitOfAccount, setIssuedBenefitOfAccount] = useState(ZERO);
  const [isDesktop] = useMediaQuery('(min-width: 62em)');

  const { account, library } = useWeb3React();

  useEffect(() => {

    if (!account) {
      return;
    }
   
    const web3 = new Web3(library.provider);
    const contract = new web3.eth.Contract(multiVestingAbi as any, multiVestingContractAddress);
   
    setMultiVestingContract(contract);
  }, [account]);

  useEffect(() => {
    if (!multiVestingContract || !account) {
      return;
    }
    multiVestingContract.methods.issuedBenefitOf(account).call().then(amount => {
      setIssuedBenefitOfAccount(getBalanceAmount(amount));
    });
  }, [multiVestingContract, account]);

  return (
    <>
      <Header />
      <Container maxW="container.xl" p="20px" minH="calc(100vh - 162px)">
        {
          issuedBenefitOfAccount.gt(ZERO) ?
          <MultiVestingPage multiVestingContract={multiVestingContract} /> :
          vestingContract ? 
          <Grid templateColumns={isDesktop ? 'repeat(9, 1fr)' : 'repeat(3, 1fr)'} gap="16">
            {
              isDesktop &&
              <GridItem colSpan={6}>
                <Overview />
                <Box mt="12" />
                <Chart />
              </GridItem>
            }
            <GridItem colSpan={3}>
              <Panel contract={vestingContract} />
            </GridItem>
          </Grid> :
          <Welcome onOpen={contract => setVestingContract(contract)} />
        }
      </Container>
      <Footer />
    </>
  );
}