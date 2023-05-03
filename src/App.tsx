import React from 'react'

import { ChakraProvider } from '@chakra-ui/react'

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { SWRConfig } from 'swr'

import Transactions from 'components/Transactions'
import { Root } from 'components/Root'
import defaultTheme from 'config/defaultTheme'

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const App = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Transactions>
        <SWRConfig
          value={{
            refreshInterval: 30000,
          }}
        >
          <ChakraProvider theme={defaultTheme}>
            <Root />
          </ChakraProvider>
        </SWRConfig>
      </Transactions>
    </Web3ReactProvider>
  )
}

export default App
