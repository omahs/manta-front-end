import WALLET_NAME from 'constants/WalletConstants';
import { useGlobal } from 'contexts/globalContexts';
import { useKeyring } from 'contexts/keyringContext';
import { usePublicAccount } from 'contexts/publicAccountContext';
import { setLastAccessedWallet } from 'utils/persistence/walletStorage';
import getSubstrateWallets from '../utils/getSubstrateWallets';
import { getLastAccessedWallet } from '../utils/persistence/walletStorage';

export default () => {
  const { usingMantaWallet } = useGlobal();
  const { refreshWalletAccounts, getLatestAccountAndPairs, keyringIsBusy } =
    useKeyring();
  const { changeExternalAccountOptions } = usePublicAccount();
  const lastAccessedWallet = getLastAccessedWallet();

  const resetLastAccessedWallet = async () => {
    const lastAccessExtensionName = lastAccessedWallet?.extensionName;
    if (usingMantaWallet && lastAccessExtensionName === WALLET_NAME.MANTA) {
      const substrateWallets = getSubstrateWallets();
      const enabledExtentions = substrateWallets.filter(
        (wallet) =>
          wallet.extension && wallet.extensionName !== WALLET_NAME.MANTA
      );
      if (enabledExtentions.length > 0) {
        // switch to another wallet as the default wallet
        if (keyringIsBusy.current === false) {
          const defaultWallet = enabledExtentions[0];
          await refreshWalletAccounts(defaultWallet);
          const { account, pairs } = getLatestAccountAndPairs();
          changeExternalAccountOptions(account, pairs);
          setLastAccessedWallet(defaultWallet);
        }
      } else {
        // reset state if no wallet exist
        changeExternalAccountOptions(null, []);
        setLastAccessedWallet(null);
      }
    }
  };
  return { resetLastAccessedWallet };
};
