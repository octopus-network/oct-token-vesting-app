import { useContext } from 'react';
import { TxnsContext } from 'components/Transactions';

const useTxns = () => {
  return useContext(TxnsContext);
}

export default useTxns;