import { createContext, useContext, ReactNode } from 'react';

import { ChainStateType, useConnectChain } from 'hooks/useConnectChain';

const PolkadotChainContext = createContext<ChainStateType | null>(null);

export const PolkadotChainProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  // TODO will remove this socket url to config file later
  const value = useConnectChain('wss://polkadot.api.onfinality.io/public-ws');
  return (
    <PolkadotChainContext.Provider value={value}>
      {children}
    </PolkadotChainContext.Provider>
  );
};

export const usePolkadotChain = () => ({ ...useContext(PolkadotChainContext) });
