// @ts-nocheck
import React, { useReducer, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSubstrate } from 'contexts/substrateContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import Balance from 'types/Balance';
import BN from 'bn.js';
import { useTxStatus } from 'contexts/txStatusContext';
import TxStatus from 'types/TxStatus';
import AssetType from 'types/AssetType';
import { setLastAccessedExternalAccountAddress } from 'utils/persistence/externalAccountStorage';
// import extrinsicWasSentByUser from 'utils/api/ExtrinsicWasSendByUser';
import BRIDGE_ACTIONS from './bridgeActions';
import bridgeReducer, { BRIDGE_INIT_STATE } from './bridgeReducer';

const BridgeContext = React.createContext();

export const BridgeContextProvider = (props) => {
  const { api } = useSubstrate();
  const { setTxStatus, txStatus } = useTxStatus();
  const {
    externalAccount,
    externalAccountSigner,
    externalAccountOptions,
    changeExternalAccount
  } = useExternalAccount();
  const initState = { ...BRIDGE_INIT_STATE };
  const [state, dispatch] = useReducer(bridgeReducer, initState);
  const {
    senderAssetType,
    senderAssetCurrentBalance,
    senderAssetTargetBalance,
    senderNativeTokenPublicBalance,
    senderPublicAccount,
  } = state;

  /**
   * Initialization logic
   */

  // Adds the user's polkadot.js accounts to state on pageload
  // These populate public address select dropdowns in the ui
  useEffect(() => {
    const initPublicAccountOptions = () => {
      dispatch({
        type: BRIDGE_ACTIONS.SET_SENDER_PUBLIC_ACCOUNT_OPTIONS,
        senderPublicAccountOptions: externalAccountOptions
      });
    };
    initPublicAccountOptions();
  }, [externalAccountOptions]);


  /**
   * External state
   */

  // Synchronizes the user's current 'active' public account in local state
  // to match its upstream source of truth in `externalAccountContext`
  // The active `senderPublicAccount` receivs `toPublic` payments,
  // send `toPrivate` and `publicTransfer` payments, and covers fees for all payments
  useEffect(() => {
    const syncPublicAccountToExternalAccount = () => {
      dispatch({
        type: BRIDGE_ACTIONS.SET_SENDER_PUBLIC_ACCOUNT,
        senderPublicAccount: externalAccount
      });
    };
    syncPublicAccountToExternalAccount();
  }, [externalAccount]);

  // Sets the polkadot.js signing and fee-paying account in 'externalAccountContext'
  // to match the user's public account as set in the send form
  useEffect(() => {
    const syncExternalAccountToPublicAccount = () => {
        senderPublicAccount && changeExternalAccount(senderPublicAccount);
    };
    syncExternalAccountToPublicAccount();
  }, [
    senderAssetType,
    externalAccountOptions
  ]);

  /**
   *
   * Mutations exposed through UI
   */

  // Sets the sender's public account, exposed in the `To Public` and `Public transfer` form;
  // State is set upstream in `externalAccountContext`, and propagates downstream here
  // (see `syncPublicAccountToExternalAccount` above)
  const setSenderPublicAccount = async (senderPublicAccount) => {
    setLastAccessedExternalAccountAddress(senderPublicAccount.address);
    await changeExternalAccount(senderPublicAccount);
  };

  // Sets the asset type to be transacted
  const setSelectedAssetType = (selectedAssetType) => {
    dispatch({ type: BRIDGE_ACTIONS.SET_SELECTED_ASSET_TYPE, selectedAssetType });
  };

  // Sets the balance the user intends to send
  const setSenderAssetTargetBalance = (senderAssetTargetBalance) => {
    dispatch({
      type: BRIDGE_ACTIONS.SET_SENDER_ASSET_TARGET_BALANCE,
      senderAssetTargetBalance
    });
  };

  /**
   *
   * Balance refresh logic
   */

  // Dispatches the user's available balance to local state for the currently selected account and asset
  const setSenderAssetCurrentBalance = (
    senderAssetCurrentBalance,
    senderPublicAddress
  ) => {
    dispatch({
      type: BRIDGE_ACTIONS.SET_SENDER_ASSET_CURRENT_BALANCE,
      senderAssetCurrentBalance,
      senderPublicAddress
    });
  };

  // Dispatches the user's available public balance for the currently selected fee-paying account to local state
  const setSenderNativeTokenPublicBalance = (
    senderNativeTokenPublicBalance
  ) => {
    dispatch({
      type: BRIDGE_ACTIONS.SET_SENDER_NATIVE_TOKEN_PUBLIC_BALANCE,
      senderNativeTokenPublicBalance
    });
  };

  // Gets available public balance for some public address and asset type
  const fetchPublicBalance = async (address, assetType) => {
    if (!api || !address) {
      return null;
    }
    await api.isReady;
    if (assetType.isNativeToken) {
      const balance = await fetchNativeTokenPublicBalance(address);
      return balance;
    }
    const account = await api.query.assets.account(assetType.assetId, address);
    const balanceString = account.value.isEmpty
      ? '0'
      : account.value.balance.toString();
    return new Balance(assetType, new BN(balanceString));
  };

  // Gets available native public balance for some public address;
  // This is currently a special case because querying native token balnces
  // requires a different api call
  const fetchNativeTokenPublicBalance = async (address) => {
    if (!api || !address) {
      return null;
    }
    await api.isReady;
    const balances = await api.derive.balances.account(address);
    return new Balance(
      AssetType.Dolphin(false),
      new BN(balances.freeBalance.toString())
    );
  };

  // Gets the available balance for the currently selected sender account, whether public or private
  const fetchSenderBalance = async () => {
    if (!senderAssetType.isPrivate) {
      const publicBalance = await fetchPublicBalance(
        senderPublicAccount?.address,
        senderAssetType
      );
      setSenderAssetCurrentBalance(publicBalance, senderPublicAccount?.address);
      // private balances cannot be queries while a transaction is processing
      // because web assambly wallet panics if asked to do two things at a time
    } else if (senderAssetType.isPrivate && !txStatus?.isProcessing()) {
      const privateBalance = await privateWallet.getSpendableBalance(
        senderAssetType
      );
      setSenderAssetCurrentBalance(
        privateBalance,
        senderPublicAccount?.address
      );
    }
  };


  // Gets the available public balance for the user's public account set to pay transaction fee
  const fetchFeeBalance = async () => {
    if (!api || !externalAccount) {
      return;
    }
    const address = externalAccount.address;
    const balance = await fetchNativeTokenPublicBalance(address);
    setSenderNativeTokenPublicBalance(balance, address);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSenderBalance();
      fetchFeeBalance();
    }, 200);
    return () => clearInterval(interval);
  }, [
    senderAssetType,
    externalAccount,
    senderPublicAccount,
    api,
    txStatus
  ]);

  /**
   *
   * Transaction validation
   */

  // Gets the highest amount the user is allowed to send for the currently
  // selected asset
  const getMaxSendableBalance = () => {
    if (!senderAssetCurrentBalance || !senderNativeTokenPublicBalance) {
      return null;
    }
    if (senderAssetType.isNativeToken) {
      const reservedNativeTokenBalance = getReservedNativeTokenBalance();
      const zeroBalance = new Balance(senderAssetType, new BN(0));
      return Balance.max(
        senderAssetCurrentBalance.sub(reservedNativeTokenBalance),
        zeroBalance
      );
    }
    return senderAssetCurrentBalance.valueOverExistentialDeposit();
  };

  // Gets the amount of the native token the user is not allowed to go below
  // If the user attempts a transaction with less than this amount of the
  // native token, the transaction will fail
  const getReservedNativeTokenBalance = () => {
    if (!senderNativeTokenPublicBalance) {
      return null;
    }
    const conservativeFeeEstimate = Balance.fromBaseUnits(
      AssetType.Dolphin(false),
      0.1
    );
    const existentialDeposit = new Balance(
      AssetType.Dolphin(false),
      AssetType.Dolphin(false).existentialDeposit
    );
    return conservativeFeeEstimate.add(existentialDeposit);
  };

  // Returns true if the current tx would cause the user to go below a
  // recommended min fee balance of 1. This helps prevent users from
  // accidentally becoming unable to transact because they cannot pay fees
  const txWouldDepleteSuggestedMinFeeBalance = () => {
    if (
      senderAssetCurrentBalance?.assetType.isNativeToken &&
      senderAssetTargetBalance?.assetType.isNativeToken
    ) {
      const SUGGESTED_MIN_FEE_BALANCE = Balance.fromBaseUnits(
        AssetType.Dolphin(false),
        1
      );
      const balanceAfterTx = senderAssetCurrentBalance.sub(
        senderAssetTargetBalance
      );
      return SUGGESTED_MIN_FEE_BALANCE.gte(balanceAfterTx);
    }
    return false;
  };

  // Checks if the user has enough funds to pay for a transaction
  const userHasSufficientFunds = () => {
    if (!senderAssetTargetBalance || !senderAssetCurrentBalance) {
      return null;
    }
    if (
      senderAssetTargetBalance.assetType.assetId !==
      senderAssetCurrentBalance.assetType.assetId
    ) {
      return null;
    }
    const maxSendableBalance = getMaxSendableBalance();
    return maxSendableBalance.gte(senderAssetTargetBalance);
  };

  // Checks if the user has enough native token to pay fees & publish a transaction
  const userCanPayFee = () => {
    if (!senderNativeTokenPublicBalance) {
      return null;
    }
    let requiredNativeTokenBalance = getReservedNativeTokenBalance();
    if (senderAssetType.isNativeToken) {
      requiredNativeTokenBalance = requiredNativeTokenBalance.add(
        senderAssetTargetBalance
      );
    }
    return senderNativeTokenPublicBalance.gte(requiredNativeTokenBalance);
  };

  // Checks the user is sending at least the existential deposit
  const receiverAmountIsOverExistentialBalance = () => {
    if (!senderAssetTargetBalance) {
      return null;
    }
    return senderAssetTargetBalance.valueAtomicUnits.gte(
      receiverAssetType.existentialDeposit
    );
  };

  // Checks that it is valid to attempt a transaction
  const isValidToSend = () => {
    return (
      api &&
      externalAccountSigner &&
      senderAssetTargetBalance &&
      senderAssetCurrentBalance &&
      userHasSufficientFunds() &&
      userCanPayFee() &&
      receiverAmountIsOverExistentialBalance()
    );
  };

  /**
   *
   * Transaction logic
   */

  // Handles the result of a transaction
  const handleTxRes = async ({ status, events }) => {
    // if (status.isInBlock) {
    //   for (const event of events) {
    //     if (api.events.utility.BatchInterrupted.is(event.event)) {
    //       setTxStatus(TxStatus.failed());
    //       console.error('Transaction failed', event);
    //     }
    //   }
    // } else if (status.isFinalized) {
    //   try {
    //     const signedBlock = await api.rpc.chain.getBlock(status.asFinalized);
    //     const extrinsics = signedBlock.block.extrinsics;
    //     const extrinsic = extrinsics.find((extrinsic) =>
    //       extrinsicWasSentByUser(extrinsic, externalAccount, api)
    //     );
    //     const extrinsicHash = extrinsic.hash.toHex();
    //     setTxStatus(TxStatus.finalized(extrinsicHash));

    //     // Correct private balances will only appear after a sync has completed
    //     // Until then, do not display stale balances
    //     privateWallet.balancesAreStale.current = true;
    //     senderAssetType.isPrivate && setSenderAssetCurrentBalance(null);
    //     receiverAssetType.isPrivate && setReceiverCurrentBalance(null);
    //   } catch (err) {
    //     console.err(err);
    //   }
    // }
  };

  // Attempts to build and send a transaction
  const send = async () => {
    if (!isValidToSend()) {
      return;
    }
    setTxStatus(TxStatus.processing());
    try {
        setTxStatus(TxStatus.success());
        console.log('success :)')
    } catch (error) {
      console.error('Transaction failed', error);
      setTxStatus(TxStatus.failed());
      return false;
    }
  };

  const value = {
    userHasSufficientFunds,
    userCanPayFee,
    getMaxSendableBalance,
    receiverAmountIsOverExistentialBalance,
    txWouldDepleteSuggestedMinFeeBalance,
    isValidToSend,
    setSenderAssetTargetBalance,
    setSenderPublicAccount,
    setSelectedAssetType,
    send,
    ...state
  };

  return (
    <BridgeContext.Provider value={value}>{props.children}</BridgeContext.Provider>
  );
};

BridgeContextProvider.propTypes = {
  children: PropTypes.any
};

export const useBridge = () => ({ ...useContext(BridgeContext) });
