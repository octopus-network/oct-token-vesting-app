import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import Web3 from 'web3';

import tokenAbi from 'abis/token.json';

import { tokenAddress } from 'config/addresses';

function useContract(address, abi) {
  const { library, chainId } = useWeb3React();
  const [contract, setContract] = useState<any>();

  useEffect(() => {
    if (!library) return;
    const addr = address[chainId];
    if (addr) {
      const web3 = new Web3(library.provider);
      setContract(new web3.eth.Contract(abi, addr));
    } else {
      setContract(null);
    }
  
  }, [library, chainId]);

  return contract;
}

export const useTokenContract = () => {
  return useContract(tokenAddress, tokenAbi);
}
