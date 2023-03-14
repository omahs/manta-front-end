import Usd from 'types/Usd';

const getUsdDisplayString = (value: Usd) => {
  const usdValue = value / 100;
  return `$${usdValue.toFixed(2)}`;
};

export default getUsdDisplayString;
