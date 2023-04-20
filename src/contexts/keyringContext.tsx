import APP_NAME from 'constants/AppConstants';
import { SS58 } from 'constants/NetworkConstants';
import { KeyringPair } from '@polkadot/keyring/types';
import keyring, { Keyring } from '@polkadot/ui-keyring';
import { Wallet } from 'manta-extension-connect';
import {
  createContext,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { getSubstrateWallets } from 'utils';
import {
  getAuthedWalletListStorage,
  setAuthedWalletListStorage
} from 'utils/persistence/connectAuthorizationStorage';
import { getLastAccessedExternalAccount } from 'utils/persistence/externalAccountStorage';
import {
  getLastAccessedWallet,
  setLastAccessedWallet
} from 'utils/persistence/walletStorage';
import isObjectEmpty from 'utils/validation/isEmpty';
import { useGlobal } from './globalContexts';

type KeyringContextValue = {
  keyring: Keyring;
  isKeyringInit: boolean;
  keyringAddresses: string[];
  selectedWallet: Wallet;
  keyringIsBusy: MutableRefObject<boolean>;
  connectWallet: (
    extensionName: string,
    saveToStorage?: boolean
  ) => Promise<boolean | undefined>;
  connectWalletExtension: (extensionName: string) => void;
  refreshWalletAccounts: (wallet: Wallet) => Promise<string | void>;
  getLatestAccountAndPairs: () => {
    account: KeyringPair;
    pairs: KeyringPair[];
  };
};
const KeyringContext = createContext<KeyringContextValue | null>(null);

export const KeyringContextProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [isKeyringInit, setIsKeyringInit] = useState(false);
  const [keyringAddresses, setKeyringAddresses] = useState<string[]>([]);
  const [isTalismanExtConfigured, setIsTalismanExtConfigured] =
    useState<boolean>(true);
  const [web3ExtensionInjected, setWeb3ExtensionInjected] = useState<string[]>(
    []
  );
  const [selectedWallet, setSelectedWallet] = useState<Wallet>(
    getLastAccessedWallet()
  );
  const lastAccessExtensionName = getLastAccessedWallet()?.extensionName;
  const [authedWalletList, setAuthedWalletList] = useState<string[]>(
    getAuthedWalletListStorage()
  );
  const { usingMantaWallet } = useGlobal();
  const keyringIsBusy = useRef(false);

  const addWalletName = (walletName: string, walletNameList: string[]) => {
    const copyWalletNameList = [...walletNameList];
    if (!copyWalletNameList.includes(walletName)) {
      copyWalletNameList.push(walletName);
      return copyWalletNameList;
    }
    return copyWalletNameList;
  };

  const connectWalletExtension = useCallback(
    (extensionName: string) => {
      const walletNames = addWalletName(extensionName, authedWalletList);
      setAuthedWalletListStorage(walletNames);
      setAuthedWalletList(walletNames);
    },
    [authedWalletList]
  );

  const refreshWalletAccounts = async (wallet: Wallet) => {
    if (!wallet?.enable) {
      return Promise.resolve('no enable function');
    }
    await wallet.enable(APP_NAME);
    keyringIsBusy.current = true;
    let currentKeyringAddresses = keyring
      .getAccounts()
      .map((account) => account.address);

    const originUpdatedAccounts = await wallet.getAccounts();
    const updatedAccounts = originUpdatedAccounts.filter((a) => {
      // @ts-ignore
      return ['ecdsa', 'ed25519', 'sr25519'].includes(a.type);
    }); // ethereum account address should be avoid in substrate (tailsman)
    const substrateAddresses: string[] = updatedAccounts.map(
      (account) => account.address
    );
    currentKeyringAddresses.forEach((address) => {
      keyring.forgetAccount(address);
    });
    // keyring has the possibility to still contain accounts
    currentKeyringAddresses = keyring
      .getAccounts()
      .map((account) => account.address);

    if (currentKeyringAddresses.length === 0) {
      updatedAccounts.forEach((account) => {
        // loadInjected is a privated function, will caused eslint error
        // @ts-ignore
        keyring.loadInjected(account.address, { ...account }, account.type);
      });

      setSelectedWallet(wallet);
      setKeyringAddresses(substrateAddresses);
    }

    keyringIsBusy.current = false;
  };

  const getLatestAccountAndPairs = () => {
    const pairs = keyring.getPairs();
    const {
      meta: { source }
    } = pairs[0] || { meta: {} };
    const account =
      getLastAccessedExternalAccount(keyring, source as string) || pairs[0];
    return { account, pairs };
  };

  useEffect(() => {
    const hasSelectedWallet = !isObjectEmpty(selectedWallet);
    const interval = setInterval(async () => {
      hasSelectedWallet && refreshWalletAccounts(selectedWallet);
    }, 1000);
    return () => interval && clearInterval(interval);
  }, [selectedWallet]);

  const initKeyring = useCallback(async () => {
    if (!isKeyringInit && web3ExtensionInjected.length !== 0) {
      const isCalamari = window?.location?.pathname?.includes('calamari');
      keyring.loadAll(
        {
          ss58Format: isCalamari ? SS58.CALAMARI : SS58.DOLPHIN
        },
        []
      );
      setIsKeyringInit(true);
    }
  }, [isKeyringInit, web3ExtensionInjected.length]);

  const getWeb3ExtensionInjected = useCallback(async () => {
    if (!isKeyringInit) {
      if (
        (window as any).injectedWeb3 &&
        Object.getOwnPropertyNames((window as any).injectedWeb3).length !== 0
      ) {
        setWeb3ExtensionInjected(
          Object.getOwnPropertyNames((window as any).injectedWeb3)
        );
      }
    }
  }, [isKeyringInit]);

  useEffect(() => {
    getWeb3ExtensionInjected();
  }, [getWeb3ExtensionInjected]);

  useEffect(() => {
    initKeyring();
  }, [initKeyring]);

  const connectWallet = useCallback(
    async (extensionName: string, saveToStorage = true) => {
      if (!isKeyringInit) {
        return false;
      }
      const substrateWallets = getSubstrateWallets();
      const selectedWallet = substrateWallets.find(
        (wallet: any) => wallet.extensionName === extensionName
      );
      if (!selectedWallet?.extension) {
        try {
          if (
            extensionName.toLowerCase() === 'talisman' &&
            !isTalismanExtConfigured
          ) {
            setIsTalismanExtConfigured(true);
          }
          await selectedWallet?.enable(APP_NAME);
          if (selectedWallet) {
            await refreshWalletAccounts(selectedWallet);
          }
          saveToStorage &&
            selectedWallet &&
            setLastAccessedWallet(selectedWallet);
          return true;
        } catch (e: any) {
          if (
            e.message ===
            'Talisman extension has not been configured yet. Please continue with onboarding.'
          ) {
            setIsTalismanExtConfigured(false);
          }
          return false;
        }
      }
      return true;
    },
    [isKeyringInit]
  );

  /** Keyring Init Logic */
  useEffect(() => {
    if (!isKeyringInit) {
      return;
    }

    const authedWalletList = getAuthedWalletListStorage();
    if (authedWalletList.length !== 0) {
      Promise.all(
        authedWalletList
          .filter((name: string) => name !== lastAccessExtensionName)
          .map(async (walletName: string) => {
            await connectWallet(walletName, false);
          })
      ).finally(async () => {
        await connectWallet(lastAccessExtensionName, true);
      });
    }
  }, [isKeyringInit]);

  const value = useMemo(
    () => ({
      keyring, // keyring object would not change even if properties changed
      isKeyringInit,
      keyringAddresses, //keyring object would not change so use keyringAddresses to trigger re-render
      selectedWallet,
      keyringIsBusy,
      isTalismanExtConfigured,
      connectWallet,
      connectWalletExtension,
      refreshWalletAccounts,
      getLatestAccountAndPairs
    }),
    [
      connectWallet,
      connectWalletExtension,
      isKeyringInit,
      keyringAddresses,
      selectedWallet,
      isTalismanExtConfigured
    ]
  );

  return (
    <KeyringContext.Provider value={value}>{children}</KeyringContext.Provider>
  );
};

export const useKeyring = () => {
  const data = useContext(KeyringContext);
  if (!data || !Object.keys(data)?.length) {
    throw new Error(
      'useKeyring can only be used inside of <KeyringContext />, please declare it at a higher level.'
    );
  }
  return data;
};
