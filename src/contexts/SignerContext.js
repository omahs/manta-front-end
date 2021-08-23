import React, { createContext, useState, useEffect, useContext } from 'react';
import SignerClient from 'services/SignerClient';
import { useSubstrate } from 'utils/substrate-lib';


const SignerContext = createContext();

export const SignerContextProvider = props => {
  const { api } = useSubstrate();

  const [signerClient, setSignerClient] = useState(null);

  useEffect(() => {
    const initSignerClient = async () => {
      if (!api || !api.isConnected) {
        return;
      }
      await api.isReady;
      console.log(api);
      setSignerClient(new SignerClient(api));
    };
    initSignerClient();
  }, [api]);

  console.log(signerClient);

  return <SignerContext.Provider value={signerClient} > {props.children} </ SignerContext.Provider >;
};

export const useSigner = () => {
  return useContext(SignerContext);
};
