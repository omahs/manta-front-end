import React from 'react';
import DotLoader from 'components/Loaders/DotLoader';

interface IBalanceDisplayProps {
  balance: string;
  className: string;
  loader: boolean;
}

const BalanceDisplay: React.FC<IBalanceDisplayProps> = ({
  balance,
  className,
  loader
}) => {
  return (
    <div id="balanceText" className={className}>
      {!loader ? (
        <span className="font-red-hat-mono">{balance ? balance : 'Balance: --'}</span>
      ) : (
        <DotLoader />
      )}
    </div>
  );
};

export default BalanceDisplay;
