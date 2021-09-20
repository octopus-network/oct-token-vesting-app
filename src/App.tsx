import React, { useState } from 'react';

import {
  ChakraProvider,
  GridItem,
  Grid,
  Container,
  Box,
  useMediaQuery,
} from '@chakra-ui/react';

import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { SWRConfig } from 'swr';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Welcome from 'components/Welcome';
import Overview from 'components/Overview';
import Chart from 'components/Chart';

import Transactions from 'components/Transactions';
import Panel from 'components/Panel';

import defaultTheme from 'config/defaultTheme';

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const App = () => {
  const [vestingContract, setVestingContract] = useState();
  const [isDesktop] = useMediaQuery('(min-width: 62em)');

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Transactions>
        <SWRConfig 
          value={{
            refreshInterval: 3000,
          }}
        >
          <ChakraProvider theme={defaultTheme}>
            <Header />
            <Container maxW="container.xl" p="20px" minH="calc(100vh - 162px)">
              {
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
          </ChakraProvider>
        </SWRConfig>
      </Transactions>
      
    </Web3ReactProvider>
  );
}

export default App;