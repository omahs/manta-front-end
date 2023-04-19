import { API_STATE, useSubstrate } from 'contexts/substrateContext';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import getZkTransactBalanceText from 'utils/display/getZkTransactBalanceText';
import { useGlobal } from 'contexts/globalContexts';
import { useSend } from '../SendContext';

const useReceiverBalanceText = () => {
  const {
    receiverCurrentBalance,
    receiverAddress,
    receiverIsPrivate,
    isToPrivate,
    isToPublic
  } = useSend();
  const { usingMantaWallet } = useGlobal();
  const { isInitialSync, isReady } = usePrivateWallet();
  const { apiState } = useSubstrate();

  const apiIsDisconnected =
    apiState === API_STATE.ERROR || apiState === API_STATE.DISCONNECTED;

  const balanceText = getZkTransactBalanceText(
    receiverCurrentBalance,
    apiIsDisconnected,
    receiverIsPrivate(),
    isInitialSync.current,
    usingMantaWallet,
    isReady
  );

  const shouldShowLoader =
    receiverAddress &&
    !receiverCurrentBalance &&
    !balanceText &&
    (isToPrivate() || isToPublic()) &&
    // Prevent loader from appearing in Manta Wallet mode if Manta Wallet is not synced
    (isToPublic() || !usingMantaWallet || isReady);

  return { balanceText, shouldShowLoader };
};

export default useReceiverBalanceText;
