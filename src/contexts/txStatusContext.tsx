import {
  createContext,
  useState,
  useContext,
  useRef,
  MutableRefObject,
  ReactNode,
  useMemo
} from 'react';
import TxStatus from 'types/TxStatus';

type TxStatusValue = {
  txStatus: TxStatus | null;
  txStatusRef: MutableRefObject<TxStatus | null>;
  setTxStatus: (txStatus: TxStatus) => void;
};

const TxStatusContext = createContext<TxStatusValue | null>(null);

export const TxStatusContextProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [txStatus, _setTxStatus] = useState<TxStatus | null>(null);
  const txStatusRef = useRef<TxStatus | null>(null);

  const setTxStatus = (status: TxStatus) => {
    _setTxStatus(status);
    txStatusRef.current = status;
  };

  const value = useMemo(
    () => ({
      txStatus,
      txStatusRef,
      setTxStatus
    }),
    [txStatus]
  );

  return (
    <TxStatusContext.Provider value={value}>
      {children}
    </TxStatusContext.Provider>
  );
};

export const useTxStatus = () => {
  const data = useContext(TxStatusContext);
  if (!data || !Object.keys(data)?.length) {
    throw new Error(
      'useTxStatus can only be used inside of <TxStatusContext />, please declare it at a higher level.'
    );
  }
  return data;
};
