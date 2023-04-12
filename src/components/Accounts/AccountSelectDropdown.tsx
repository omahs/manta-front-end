// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { useTxStatus } from 'contexts/txStatusContext';
import { useMetamask } from 'contexts/metamaskContext';
import { usePublicAccount } from 'contexts/publicAccountContext';
import getAbbreviatedName from 'utils/display/getAbbreviatedName';
import Identicon from '@polkadot/react-identicon';
import makeBlockie from 'ethereum-blockies-base64';
import CopyPasteIcon from 'components/CopyPasteIcon';
import Icon from 'components/Icon';

const SingleAccountDisplay = ({
  accountName,
  accountAddress,
  isAccountSelected,
  isMetamaskSelected,
  onClickAccountHandler,
  zkAddress
}) => {
  const succinctAddress = getAbbreviatedName(accountAddress, 5, 5);

  const succinctAccountName =
    accountName.length > 12 ? `${accountName?.slice(0, 12)}...` : accountName;
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();

  const AccountIcon = () =>
    isMetamaskSelected ? (
      <img
        className="ml-1 rounded-full w-6 h-6"
        src={makeBlockie(accountAddress)}
        alt={'blockie address icon'}
      />
    ) : (
      <Identicon
        value={accountAddress}
        size={24}
        theme="polkadot"
        className="px-1"
      />
    );
  
  if (zkAddress) {
    const succinctZkAddress = getAbbreviatedName(zkAddress, 5, 5);
    const AddressDisplay = ({ addressType, className }: { addressType: 'Public' | 'Private', className: string }) => (
      <div
        className={classNames(
          'bg-white bg-opacity-5 cursor-pointer flex items-center gap-5 justify-between border border-white-light rounded-lg px-3 text-green w-68 h-16',
          className,
          { disabled: disabled }
        )}>
        <div className="flex flex-col">
          <div className="text-base">{addressType} Address</div>
          <div className="flex flex-row items-center gap-2 text-white text-opacity-60 text-sm">
            {addressType === 'Private' ? succinctZkAddress : succinctAddress}
            <CopyPasteIcon
              iconClassName="w-5 h-5"
              textToCopy={addressType === 'Private' ? zkAddress : accountAddress}
            />
          </div>
        </div>
        <div className="relative right-2">
          <Icon name="greenCheck" />
        </div>
      </div>
    );

    return (
      <div key={accountAddress}>
        <div className="flex gap-1 items-center mb-4">
          <AccountIcon />
          <div className="text-base">{succinctAccountName}</div>
        </div>

        <AddressDisplay addressType="Private" className="mb-5" />
        <AddressDisplay addressType="Public" />
        
      </div>
    );
  }

  return (
    <div
      key={accountAddress}
      className={classNames(
        'bg-white bg-opacity-5 cursor-pointer flex items-center gap-5 justify-between border border-white-light rounded-lg px-3 text-green w-68 h-16',
        { disabled: disabled }
      )}
      onClick={onClickAccountHandler}>
      <div>
        <div className="flex flex-row items-center gap-3">
          <AccountIcon />
          <div className="flex flex-col">
            <div className="text-base">{succinctAccountName}</div>
            <div className="flex flex-row items-center gap-2 text-white text-opacity-60 text-sm">
              {succinctAddress}
              <CopyPasteIcon
                iconClassName="w-5 h-5"
                textToCopy={accountAddress}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative right-2">
        {isAccountSelected && <Icon name="greenCheck" />}
      </div>
    </div>
  );
};

const AccountSelectDropdown = ({ isMetamaskSelected }) => {
  const { ethAddress } = useMetamask();
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();
  const { externalAccount, externalAccountOptions, changeExternalAccount } =
    usePublicAccount();

  const isMetamaskEnabled = isMetamaskSelected && ethAddress;
  const onClickAccountHandler = (account) => () => {
    !disabled && changeExternalAccount(account);
  };

  return isMetamaskEnabled ? (
    <SingleAccountDisplay
      accountName={'MetaMask'}
      accountAddress={ethAddress}
      isAccountSelected={true}
      isMetamaskSelected={isMetamaskEnabled}
      onClickAccountHandler={() => {}}
    />
  ) : (
    <div className="flex flex-col gap-5">
      {externalAccountOptions.map((account: any) => (
        <SingleAccountDisplay
          key={account.address}
          accountName={account.meta.name}
          accountAddress={account.address}
          isAccountSelected={account.address === externalAccount.address}
          isMetamaskSelected={isMetamaskEnabled}
          onClickAccountHandler={onClickAccountHandler(account)}
          zkAddress={account.meta.zkAddress}
        />
      ))}
    </div>
  );
};

export default AccountSelectDropdown;
