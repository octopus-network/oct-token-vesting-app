import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';

export const injected = new InjectedConnector({ supportedChainIds: [1, 3] });

const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.REACT_APP_RPC_URL_1 as string,
  3: process.env.REACT_APP_RPC_URL_3 as string
}

const POLLING_INTERVAL = 12000;

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1], 3: RPC_URLS[3] },
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
});

export const ledger = new LedgerConnector({ 
  chainId: 1, 
  url: RPC_URLS[1], 
  pollingInterval: POLLING_INTERVAL 
});