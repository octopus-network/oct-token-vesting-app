import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Text,
  Image,
  Box,
  Button,
  VStack,
} from '@chakra-ui/react'

import { injected, walletconnect, ledger } from 'utils/connectors'

import { useEagerConnect } from 'hooks/useEagerConnect'
import { useInactiveListener } from 'hooks/useInactiveListener'

import MetaMaskLogo from 'assets/metamask.png'
import WalletConnectLogo from 'assets/walletConnectIcon.svg'
import LedgerLogo from 'assets/ledger.png'

enum ConnectorNames {
  Injected = 'Metamask',
  WalletConnect = 'WalletConnect',
  Ledger = 'Ledger',
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.Ledger]: ledger,
}

const logoByConnectName = {
  [ConnectorNames.Injected]: MetaMaskLogo,
  [ConnectorNames.WalletConnect]: WalletConnectLogo,
  [ConnectorNames.Ledger]: LedgerLogo,
}

const ConnectWalletModal = ({ isOpen }: { isOpen: boolean }) => {
  const { connector, activate, error } = useWeb3React<Web3Provider>()

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent ml={2} mr={2}>
        <ModalHeader>Connect to wallet</ModalHeader>

        <ModalBody>
          <VStack spacing={4}>
            {Object.keys(connectorsByName).map((name) => {
              const currentConnector = connectorsByName[name]
              const activating = currentConnector === activatingConnector
              const connected = currentConnector === connector
              const disabled =
                !triedEager || !!activatingConnector || connected || !!error
              const logo = logoByConnectName[name]

              return (
                <Button
                  cursor="pointer"
                  onClick={async () => {
                    try {
                      setActivatingConnector(currentConnector)
                      await activate(
                        connectorsByName[name],
                        (e) => {
                          console.log('e', e)
                        },
                        true
                      )
                      window.localStorage.removeItem('disconnected')
                    } catch (error) {
                      await (window as any).ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x1' }],
                      })
                      console.log('error', error)
                    }
                  }}
                  width="100%"
                  as={Flex}
                  justifyContent="space-between"
                  isLoading={activating}
                  size="lg"
                  isDisabled={activating || disabled}
                  variant={connected ? 'solid' : 'outline'}
                  key={`walle-${name}`}
                >
                  <Text>{name}</Text>
                  <Image src={logo} w="4" h="4" />
                </Button>
              )
            })}
          </VStack>
          <Box pb="4" />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ConnectWalletModal
