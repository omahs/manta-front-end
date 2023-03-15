import { createContext, useContext, ReactNode } from 'react';

import { ChainStateType, useConnectChain } from 'hooks/useConnectChain';

const KusamaChainContext = createContext<ChainStateType | null>(null);

export const KusamaChainProvider = ({ children }: { children: ReactNode }) => {
  // TODO will remove this socket url to config file later
  const value = useConnectChain('wss://kusama.api.onfinality.io/public-ws');
  return (
    <KusamaChainContext.Provider value={value}>
      {children}
    </KusamaChainContext.Provider>
  );
};

export const useKusamaChain = () => ({ ...useContext(KusamaChainContext) });
