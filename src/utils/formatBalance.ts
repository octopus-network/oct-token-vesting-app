import BigNumber from 'bignumber.js';

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

export const beautifyAmount = (amount: BigNumber | number, fixed = 2) => {
  
  if (typeof amount == 'number') {
    amount = new BigNumber(amount);
  } else {
    let strArr = amount.toString().split('.');
    if (strArr.length > 1) {
      strArr[1] = strArr[1].substr(0,6);
      amount = new BigNumber(strArr[0] + '.' + strArr[1]);
    } else {
      amount = new BigNumber(strArr[0]);
    }
    
  }

  let thousands = new BigNumber(1000);
  let millions = thousands.times(1000);
  let billions = millions.times(1000);
  let trillions = billions.times(1000);
  
  let t = amount, s = '';
  if (amount.gte(thousands)) {
    t = amount.dividedBy(thousands);
    s = 'K';
  }
  if (amount.gte(millions)) {
    t = amount.dividedBy(millions);
    s = 'M';
  }
  if (amount.gte(billions)) {
    t = amount.dividedBy(billions);
    s = 'B';
  }
  if (amount.gte(trillions)) {
    t = amount.dividedBy(trillions);
    s = 'T';
  }
  let tmpArr = t.toFixed().split('.');
  if (tmpArr.length > 1) {
    return [tmpArr[0],tmpArr[1].substr(0, fixed).padEnd(fixed, '0')].join('.') + s;
  } else if (fixed) {
    return [tmpArr[0], ''.padEnd(fixed, '0')].join('.') + s;
  } else {
    return tmpArr[0];
  }
}