// @ts-nocheck
import React from 'react';
import AppRouter from 'AppRouter';
import { ThemeProvider } from 'contexts/themeContext';
import { SubstrateContextProvider } from 'contexts/substrateContext';
import { PrivateWalletContextProvider } from 'contexts/privateWalletContext';
import { ExternalAccountContextProvider } from 'contexts/externalAccountContext';
import DeveloperConsole from 'components/Developer/DeveloperConsole';
import config from 'config';
import { TxStatusContextProvider } from 'contexts/txStatusContext';
import { KeyringContextProvider } from './contexts/keyringContext';

function App() {
  return (
    <SubstrateContextProvider>
      <KeyringContextProvider>
        <ExternalAccountContextProvider>
          <TxStatusContextProvider>
            <PrivateWalletContextProvider> 
              <ThemeProvider>
                <AppRouter />
                {config.DEV_CONSOLE && <DeveloperConsole />}
              </ThemeProvider>
            </PrivateWalletContextProvider> 
          </TxStatusContextProvider>
        </ExternalAccountContextProvider>
      </KeyringContextProvider>
    </SubstrateContextProvider>
  );
}

export default App;