import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import {
  Flex,
  Box,
  Image,
  Button,
  Container,
  Link,
  useBoolean,
  HStack
} from '@chakra-ui/react';

import { getBalanceAmount, beautifyAmount } from 'utils/formatBalance';
import { useTokenContract } from 'hooks/useContract';
import ConnectWalletModal from './ConnectWalletModal';
import AccountModal from './AccountModal';

import OctoLogo from 'assets/logo.png';
import AccountBox from './AccountBox';

const Header = () => {
  const { account } = useWeb3React();
  const [walletModalOpen, setWalletModalOpen] = useBoolean(false);
  const [accountModalOpen, setAccountModalOpen] = useBoolean(false);
  
  const [accountBalance, setAccountBalance] = useState('0.00');
  const tokenContract = useTokenContract();

  const selectedLinkStyle = {
    color: 'octoColor.500', fontWeight: '600'
  }

  useEffect(() => {
    if (!account) {
      setWalletModalOpen.on();
      return;
    }
    if (account && walletModalOpen) {
      setWalletModalOpen.off();
    }
    if (tokenContract) {
      tokenContract
        .methods
        .balanceOf(account)
        .call()
        .then(balance => {
          setAccountBalance(
            beautifyAmount(getBalanceAmount(balance))
          );
        });
    } else {
      setAccountBalance('0.00');
    }
  }, [tokenContract, account]);

  return (
    <>
    <Container maxW="full" p="4" h="74px">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          <Image src={OctoLogo} h="32px" />
          <HStack spacing={5} ml={12}>
            <Link aria-selected={true} _selected={selectedLinkStyle}>Vesting</Link>
            <Link target="_blank" href="https://mainnet.oct.network">Octopus App</Link>
          </HStack>
        </Flex>
        <Box display={{ base: 'none', lg: 'flex' }}>
          {
            account ?
            <AccountBox address={account} balance={accountBalance} onAccountClick={setAccountModalOpen.toggle} /> :
            <Button variant="outline" onClick={setWalletModalOpen.toggle}>Connect to wallet</Button>
          }
        </Box>
      </Flex>
    </Container>
    <ConnectWalletModal isOpen={walletModalOpen} />
    <AccountModal isOpen={accountModalOpen} onClose={setAccountModalOpen.off} />
    </>
  );
}

export default Header;