import Balance from 'types/Balance';

const getMantaWalletZkBalanceText = (
  balance: Balance | null,
  apiIsDisconnected: boolean,
  isPrivate: boolean,
  isInitialSync: boolean,
  isReady: boolean,
) => {
  if (apiIsDisconnected) {
    return 'Connecting to network';
  } else if (isPrivate && !isReady) {
    return '';
  } else if (isInitialSync && isPrivate && isReady) {
    return 'Syncing zk account';
  } else if (balance) {
    return `Balance: ${balance.toString()}`;
  } else {
    return '';
  }
};

const getMantaSignerZkBalanceText = (
  balance: Balance | null,
  apiIsDisconnected: boolean,
  isPrivate: boolean,
  isInitialSync: boolean,
  isReady: boolean,
) => {
  if (apiIsDisconnected) {
    return 'Connecting to network';
  } else if (isInitialSync && isPrivate && isReady) {
    return 'Syncing zk account';
  } else if (balance) {
    return `Balance: ${balance.toString()}`;
  } else {
    return '';
  }
};

const getZkTransactBalanceText = (
  balance: Balance | null,
  apiIsDisconnected: boolean,
  isPrivate: boolean,
  isInitialSync: boolean,
  usingMantaWallet: boolean,
  isReady: boolean,
) => {
  if (usingMantaWallet) {
    return getMantaWalletZkBalanceText(
      balance,
      apiIsDisconnected,
      isPrivate,
      isInitialSync,
      isReady
    );
  }
  return getMantaSignerZkBalanceText(
    balance,
    apiIsDisconnected,
    isPrivate,
    isInitialSync,
    isReady
  );
};

export default getZkTransactBalanceText;
