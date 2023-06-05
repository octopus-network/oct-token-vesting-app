import React from 'react'

import { ChakraProvider } from '@chakra-ui/react'
import { Web3OnboardProvider, init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { SWRConfig } from 'swr'

import Transactions from 'components/Transactions'
import { Root } from 'components/Root'
import defaultTheme from 'config/defaultTheme'

const ethereumRopsten = {
  id: '0x1',
  token: 'ETH',
  label: 'Ethereum',
  rpcUrl: `https://rpc.ankr.com/eth`,
}

const chains = [ethereumRopsten]
const wallets = [injectedModule()]

const web3Onboard = init({
  wallets,
  chains,
  appMetadata: {
    name: 'Web3-Onboard Demo',
    icon: '<svg>App Icon</svg>',
    description: 'A demo of Web3-Onboard.',
  },
})

const App = () => {
  return (
    <Web3OnboardProvider web3Onboard={web3Onboard}>
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
    </Web3OnboardProvider>
  )
}

export default App
