import React, { useState, useEffect, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';

import {
  useToast,
  Box,
  Heading,
  Flex,
  Link,
  Icon
} from '@chakra-ui/react';

import { BsCheckCircle } from 'react-icons/bs';

export const TxnsContext = React.createContext(undefined);

const localTxnsObj = window.localStorage.getItem('transactions');

const TxnsProvider = ({ children }) => {
  const { account, chainId, library } = useWeb3React();

  const [allTxns, setAllTxns] = useState({});
  const [txns, setTxns] = useState([]);
  const [pendingTxns, setPendingTxns] = useState(0);
  const toast = useToast();

  useEffect(() => {
    if (allTxns) {
      const tmpArr = [];
      Object.keys(allTxns).map(hash => {
        let tx = allTxns[hash];
        if (new RegExp(`${tx.from}`, 'i').test(account)) {
          tmpArr.push(tx);
        }
      });
      setTxns(tmpArr.sort((a, b) => b.addedTime - a.addedTime));
    } else {
      setTxns([]);
    }
  }, [allTxns, account]);

  useEffect(() => {
    if (localTxnsObj) {
      setAllTxns(JSON.parse(localTxnsObj)[chainId]);
    } else {
      setAllTxns({});
    }
   
  }, [localTxnsObj, chainId, account]);

  const timer = useRef<any>();

  useEffect(() => {
    if (!txns.length) return;
    
    if (timer.current) {
      clearTimeout(timer.current);
    }

    const getReceipts = async () => {
      const promises = [];
      txns.forEach(tx => {
        if (!tx.receipt) {
          promises.push(library.getTransactionReceipt(tx.hash));
        }
      });
      let tmpObj = {...allTxns};
      try {
        await Promise.all(promises).then(receipts => {
          receipts.forEach((r, idx) => {
            if (r) {
              tmpObj[r.transactionHash]['receipt'] = r;
              if (r.status === 1) {
                toast({
                  position: 'top-right',
                  render: () => {
                    const tx = txns[idx];
                    const explorer = chainId === 1 ? 'https://www.etherscan.io' : 'https://ropsten.etherscan.io';
                    return (
                      <Box p="12px" borderRadius="10px" bg="white">
                        <Flex alignItems="center">
                          <Icon as={BsCheckCircle} width="28px" height="28px" />
                          <Flex flexDirection="column" marginLeft="16px">
                            <Heading fontWeight="600" fontSize="lg">{tx.summary}</Heading>
                            <Link href={`${explorer}/tx/${r.transactionHash}`} target="_blank" color="gray" textDecoration="underline">View on explorer</Link>
                          </Flex>
                        </Flex>
                      </Box>
                    );
                  },
                  duration: 2500
                });
              }
            }
          });
        });
      } catch(err) {
        console.log(err);
      }

      setPendingTxns(promises.length);
      setAllTxns(tmpObj);
      storeTxns(tmpObj);
    }

    timer.current = setTimeout(() => {
      getReceipts();
    }, 1000);

    return () => {
      timer.current && clearTimeout(timer.current);
    }

  }, [txns, library]);
  
  const clearTxns = () => {
    setAllTxns({});
    setPendingTxns(0);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    window.localStorage.removeItem('transactions');
  }

  const appendTx = (tx) => {
    const tmpObj = Object.assign({}, allTxns, {
      [tx.hash]: tx
    });
    setAllTxns(tmpObj);
    storeTxns(tmpObj);
  }

  const storeTxns = (txns) => {
    window.localStorage.setItem(
      'transactions', 
      JSON.stringify(Object.assign(localTxnsObj ? JSON.parse(localTxnsObj) : {}, {
        [chainId]: txns
      }))
    );
  }

  return (
    <TxnsContext.Provider value={{
      txns, clearTxns, appendTx, pendingTxns
    }}>
      { children }
    </TxnsContext.Provider>
  );
}

export default TxnsProvider;