import { createContext, ReactNode, useContext } from 'react';
import { ChainStateType, useConnectChain } from 'hooks/useConnectChain';
import { useConfig } from './configContext';
export enum API_STATE {
  CONNECT_INIT,
  READY,
  ERROR,
  DISCONNECTED
}
const SubstrateContext = createContext<ChainStateType | null>(null);

const SubstrateContextProvider = ({ children }: { children: ReactNode }) => {
  const config = useConfig();
  const value = useConnectChain(config.PROVIDER_SOCKET);

  return (
    <SubstrateContext.Provider value={value}>
      {children}
    </SubstrateContext.Provider>
  );
};

const useSubstrate = () => ({ ...useContext(SubstrateContext) });

export { SubstrateContextProvider, useSubstrate };
