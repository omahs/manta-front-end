// @ts-nocheck
import { localStorageKeys } from 'constants/LocalStorageConstants';
import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useLocation } from 'react-router-dom';
import store from 'store';
import { KeyringContextProvider } from './keyringContext';
import { ThemeProvider } from './themeContext';

const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {
  const initValue =
    store.get(localStorageKeys.UsingMantaWallet) === false ? false : true;
  const [usingMantaWallet, _setUsingMantaWallet] = useState(initValue);
  const { pathname } = useLocation();
  const isDolphinPage = pathname.includes('dolphin');

  useEffect(() => {
    if (isDolphinPage) {
      _setUsingMantaWallet(false); // force to use manta signer only
      return;
    }
    _setUsingMantaWallet(initValue);
  }, [isDolphinPage]);

  const setUsingMantaWallet = useCallback((state) => {
    _setUsingMantaWallet(state);
    store.set(localStorageKeys.UsingMantaWallet, state);
  }, []);

  const contextValue = useMemo(
    () => ({
      usingMantaWallet,
      setUsingMantaWallet
    }),
    [usingMantaWallet, setUsingMantaWallet, isDolphinPage]
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      <KeyringContextProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </KeyringContextProvider>
    </GlobalContext.Provider>
  );
};

GlobalContextProvider.propTypes = {
  children: PropTypes.any
};

export const useGlobal = () => ({
  ...useContext(GlobalContext)
});

export default GlobalContextProvider;
