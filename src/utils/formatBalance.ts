import BigNumber from 'bignumber.js';

export const ZERO = new BigNumber(0);
/**
 * Take a formatted amount, e.g. 15 BNB and convert it to full decimal value, e.g. 15000000000000000
 */
export const getDecimalAmount = (amount: string | number | BigNumber, decimals = 18) => {
  if (!amount) amount = 0;
  return new BigNumber(amount.toString()).times(new BigNumber(10).pow(decimals));
}

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  if (!amount) return new BigNumber(0);
  return new BigNumber(amount.toString()).dividedBy(new BigNumber(10).pow(decimals));
}

export const beautifyAmount = (amount: BigNumber | number | string, fixed) => {
  if (typeof amount === 'number' || typeof amount === 'string') {
    amount = new BigNumber(amount);
  }
  if (!fixed) {
    fixed = amount.gt(0) && amount.lte(1) ? 4 : 2;
  } 
  const str = amount.toFixed(fixed);
  const reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
  return str.replace(reg, '$1,');
}
