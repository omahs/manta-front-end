// @ts-nocheck
import React from 'react';
import SendAmountInput from 'components/AmountInput/SendAmountInput';
import SendAssetTypeDropdown from 'components/AssetTypeDropdown/SendAssetTypeDropdown';
import { useBridge } from './BridgeContext';

const BridgeAssetSelect = () => {
  const {
    senderAssetCurrentBalance,
    senderAssetType,
    setSenderAssetTargetBalance,
    maxInput,
    senderAssetTypeOptions,
    setSelectedAssetType
  } = useBridge();

  const balanceText = senderAssetCurrentBalance
    ? `${senderAssetCurrentBalance.toString()} ${senderAssetType.ticker}`
    : '';

  return (
    <div className="w-100 relative">
      <SendAssetTypeDropdown
        senderAssetType={senderAssetType}
        senderAssetTypeOptions={senderAssetTypeOptions}
        setSelectedAssetType={setSelectedAssetType}
      />
      <SendAmountInput
        balanceText={balanceText}
        senderAssetCurrentBalance={senderAssetCurrentBalance}
        setSenderAssetTargetBalance={setSenderAssetTargetBalance}
        senderAssetType={senderAssetType}
        getMaxSendableBalance={() => maxInput}
      />
    </div>
  );
};

export default BridgeAssetSelect;
