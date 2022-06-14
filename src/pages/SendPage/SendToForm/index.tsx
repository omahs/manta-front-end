// @ts-nocheck
import React from 'react';
import PublicPrivateToggle from 'pages/SendPage/PublicPrivateToggle';
import SendButton from '../SendButton';
import { useSend } from '../SendContext';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import SendToPrivateAddressForm from './SendToPrivateAddressForm';
import SendToPublicAddressForm from './SendToPublicAddressForm';

const SendToForm = () => {
  const { toggleReceiverIsPrivate, receiverAssetType } = useSend();
  const { walletIsBusy, isInitialSync } = usePrivateWallet();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 items-stretch">
        <PublicPrivateToggle
          onToggle={toggleReceiverIsPrivate}
          isPrivate={receiverAssetType.isPrivate}
          prefix="receiver"
        />
        {receiverAssetType.isPrivate ? (
          <SendToPrivateAddressForm />
        ) : (
          <SendToPublicAddressForm />
        )}
      </div>
      <SendButton />
      <data
        value={isInitialSync || walletIsBusy.current}
        data-testing-id="sync-status"
      />
    </div>
  );
};

export default SendToForm;