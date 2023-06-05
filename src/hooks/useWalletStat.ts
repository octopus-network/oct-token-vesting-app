import { useConnectWallet, useSetChain } from '@web3-onboard/react'

export default function useWalletStat() {
  const [{ wallet }] = useConnectWallet()
  const [{ connectedChain }] = useSetChain()
  const account = wallet?.accounts[0].address

  return {
    account,
    chainId: connectedChain?.id,
  }
}
