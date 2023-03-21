import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useContext,
  useState,
  useRef,
  useEffect
} from 'react';
import { FrameSystemAccountInfo } from '@polkadot/types/lookup';
import axios from 'axios';

import { useConfig } from 'contexts/configContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { useMetamask } from 'contexts/metamaskContext';
import Balance from 'types/Balance';
import AssetType from 'types/AssetType';
import BN from 'bn.js';
import Usd from 'types/Usd';
import Decimal from 'decimal.js';
import { useUsdPrices } from 'contexts/usdPricesContext';
import {
  Levels,
  LevelType,
  Tokens,
  TokenType
} from '../components/TokenButton';
import { useGenerated } from './generatedContext';
import { ThemeItem, useSBTTheme } from './sbtThemeContext';
import { GenerateStatus, useGenerating } from './generatingContext';
import { usePolkadotChain } from './PolkadotChainContext';
import { useKusamaChain } from './KusamaChainContext';
import { GeneratedImg, Step, useSBT } from './';

type WatermarkToken = {
  token: TokenType;
  level: LevelType;
  checked?: boolean;
  value: Usd;
  balance: Balance | null;
  network?: string;
};

type MintContextValue = {
  getWatermarkedImgs: () => Promise<Set<GeneratedImg>>;
  saveMintInfo: (mintSet: Set<GeneratedImg>) => void;
  mintSuccessed: boolean;
  toggleMintSuccessed: (mintSuccessed: boolean) => void;
  resetContextData: () => void;
  activeWatermarkIndex: number;
  setActiveWatermarkIndex: (index: number) => void;
  getWatermarkTokenList: () => void;
  watermarkTokenList: Array<WatermarkToken>;
};
const LEVEL_TO_SIZE = {
  [Levels.normal]: 1,
  [Levels.supreme]: 2,
  [Levels.master]: 3
};

const MintContext = createContext<MintContextValue | null>(null);

export type EvmBalance = {
  name: string;
  symbol: string;
  value: number;
};

const zeroUsd = new Usd(new Decimal(0));

const initTokenMap: Record<TokenType, WatermarkToken> = {
  [Tokens.manta]: {
    token: Tokens.manta,
    checked: false,
    level: Levels.normal,
    value: zeroUsd,
    balance: null
  },
  [Tokens.eth]: {
    token: Tokens.eth,
    checked: false,
    level: Levels.normal,
    value: zeroUsd,
    balance: null
  },
  [Tokens.usdc]: {
    token: Tokens.usdc,
    checked: false,
    level: Levels.normal,
    value: zeroUsd,
    balance: null
  },
  [Tokens.uni]: {
    token: Tokens.uni,
    checked: false,
    level: Levels.normal,
    value: zeroUsd,
    balance: null
  },
  [Tokens.wbtc]: {
    token: Tokens.wbtc,
    checked: false,
    level: Levels.normal,
    value: zeroUsd,
    balance: null
  },
  [Tokens.link]: {
    token: Tokens.link,
    checked: false,
    level: Levels.normal,
    value: zeroUsd,
    balance: null
  },
  [Tokens.matic]: {
    token: Tokens.matic,
    checked: false,
    level: Levels.normal,
    value: zeroUsd,
    balance: null
  },
  [Tokens.bnb]: {
    token: Tokens.bnb,
    checked: false,
    level: Levels.normal,
    value: zeroUsd,
    balance: null
  },
  [Tokens.usdt]: {
    token: Tokens.usdt,
    checked: false,
    level: Levels.normal,
    value: zeroUsd,
    balance: null
  },
  [Tokens.shib]: {
    token: Tokens.shib,
    checked: false,
    level: Levels.normal,
    value: zeroUsd,
    balance: null
  },
  [Tokens.ldo]: {
    token: Tokens.ldo,
    checked: false,
    level: Levels.normal,
    value: zeroUsd,
    balance: null
  },
  [Tokens.op]: {
    token: Tokens.op,
    checked: false,
    level: Levels.normal,
    value: zeroUsd,
    balance: null
  },
  [Tokens.avax]: {
    token: Tokens.avax,
    checked: false,
    level: Levels.normal,
    value: zeroUsd,
    balance: null
  },
  [Tokens.dot]: {
    token: Tokens.dot,
    checked: false,
    level: Levels.normal,
    value: zeroUsd,
    balance: null
  },
  [Tokens.ksm]: {
    token: Tokens.ksm,
    checked: false,
    level: Levels.normal,
    value: zeroUsd,
    balance: null
  }
};

const LEVEL_NORMAL_MAX = new Usd(new Decimal(100));
const LEVEL_SUPREME_MAX = new Usd(new Decimal(2000));

const getLevel = (usd: Usd) => {
  if (usd.value.gt(LEVEL_SUPREME_MAX.value)) {
    return Levels.master;
  } else if (usd.value.gt(LEVEL_NORMAL_MAX.value)) {
    return Levels.supreme;
  }
  return Levels.normal;
};

export const MintContextProvider = ({ children }: { children: ReactNode }) => {
  const [mintSuccessed, toggleMintSuccessed] = useState(false);
  const [activeWatermarkIndex, setActiveWatermarkIndex] = useState(0);
  const [watermarkTokenList, setWatermarkTokenList] = useState<
    Array<WatermarkToken>
  >([]);
  const [evmBalances, setEvmBalances] = useState([] as EvmBalance[]);

  const addressRef = useRef<string | null>(null);

  const config = useConfig();
  const { modelId, toggleCheckedThemeItem } = useSBTTheme();
  const { setGeneratedImgs, setGenerateStatus } = useGenerating();
  const { mintSet, setMintSet } = useGenerated();
  const { externalAccount } = useExternalAccount();
  const {
    setImgList,
    setOnGoingTask,
    nativeTokenBalance,
    setCurrentStep,
    setHintStatus
  } = useSBT();
  const { ethAddress } = useMetamask();
  const { api: polkadotApi } = usePolkadotChain();
  const { api: kusamaApi } = useKusamaChain();
  const { usdPrices } = useUsdPrices();

  const getWatermarkedImgs = useCallback(async () => {
    const url = `${config.SBT_NODE_SERVICE}/npo/watermark`;
    const data = {
      data: [...mintSet].map(({ url, watermarkToken, watermarkLevel }) => {
        return {
          url,
          token: watermarkToken,
          size: LEVEL_TO_SIZE[watermarkLevel ?? Levels.normal]
        };
      }),
      address: externalAccount?.address,
      model_id: modelId
    };
    const newMintSet = new Set<GeneratedImg>();
    const ret = await axios.post<GeneratedImg[]>(url, data);
    if (ret.status === 200 || ret.status === 201) {
      [...mintSet].forEach((generatedImg, index) => {
        newMintSet.add({
          ...generatedImg,
          ...ret.data[index]
        });
      });
    }
    setMintSet(newMintSet);
    return newMintSet;
  }, [
    config.SBT_NODE_SERVICE,
    externalAccount?.address,
    mintSet,
    modelId,
    setMintSet
  ]);

  const resetContextData = useCallback(() => {
    setHintStatus(false);
    setImgList([]);
    setOnGoingTask(null);
    toggleCheckedThemeItem(new Map<string, ThemeItem>());
    setGeneratedImgs([]);
    setGenerateStatus(GenerateStatus.doing);
    setMintSet(new Set());
  }, [
    setGenerateStatus,
    setGeneratedImgs,
    setImgList,
    setOnGoingTask,
    setMintSet,
    toggleCheckedThemeItem,
    setHintStatus
  ]);

  const saveMintInfo = useCallback(
    async (mintSet: Set<GeneratedImg>) => {
      const url = `${config.SBT_NODE_SERVICE}/npo/proofs`;
      const data = {
        proof_info: [...mintSet].map(({ proofId, assetId, blur_url }) => ({
          proof_id: proofId,
          asset_id: assetId,
          blur_url,
          token: 'manta',
          size: '1'
        })),
        address: externalAccount?.address,
        model_id: modelId
      };
      const ret = await axios.post<{ status: boolean }>(url, data);
      if (ret.status === 200 || ret.status === 201) {
        toggleMintSuccessed(ret.data.status);
      }
    },
    [config.SBT_NODE_SERVICE, externalAccount?.address, modelId]
  );

  const getPolkadotBalance = useCallback(async () => {
    if (polkadotApi?.query?.system && externalAccount?.address) {
      const {
        data: { free, miscFrozen }
      } = (await polkadotApi?.query?.system?.account(
        '13mx7NQBYoo6TY9sRsCAEbZBnen9BBK16AfkxhPf4LcsaTf5' // TODO will replace with the wallet's address later
      )) as FrameSystemAccountInfo;

      const polkadotAsset = AssetType.Dot(config);
      const total = new Balance(polkadotAsset, new BN(free.toString()));
      const staked = new Balance(polkadotAsset, new BN(miscFrozen.toString()));

      return total.sub(staked);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalAccount?.address, polkadotApi?.query?.system]);

  const getKusamaBalance = useCallback(async () => {
    if (kusamaApi?.query?.system && externalAccount?.address) {
      const {
        data: { free, miscFrozen }
      } = (await kusamaApi?.query?.system?.account(
        'CgaccaysLRMQSNJUznK3SXAZwNRMuM8UURGDUmMzGzJfq6A' // TODO will replace with the wallet's address later
      )) as FrameSystemAccountInfo;
      const kusamaAsset = AssetType.Kusama(config, false);
      const total = new Balance(kusamaAsset, new BN(free.toString()));
      const staked = new Balance(kusamaAsset, new BN(miscFrozen.toString()));

      return total.sub(staked);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalAccount?.address, kusamaApi?.query?.system]);

  useEffect(() => {
    const getEvmTokenBalance = async () => {
      if (ethAddress) {
        const url = `${config.SBT_NODE_SERVICE}/npo/balance`;
        const ret = await axios.post<{
          status: boolean;
          data: EvmBalance[];
        }>(url, {
          // TODO replace this with metamask wallet address
          address: '0x690b9a9e9aa1c9db991c7721a92d351db4fac990'
        });
        if (ret.status === 200 || ret.status === 201) {
          setEvmBalances(ret.data.data);
        }
      }
    };
    getEvmTokenBalance();
  }, [config.SBT_NODE_SERVICE, ethAddress]);

  const getWatermarkTokenList = useCallback(async () => {
    if (!externalAccount?.address) {
      return;
    }
    // TODO use the true usd price of manta
    const mantaValue =
      nativeTokenBalance?.toUsd(new Usd(new Decimal(1))) ??
      new Usd(new Decimal(0));
    const mantaToken = {
      token: Tokens.manta,
      level: getLevel(mantaValue),
      balance: nativeTokenBalance,
      value: mantaValue
    };

    if (!ethAddress) {
      const tokenList: WatermarkToken[] = [mantaToken];
      setWatermarkTokenList(tokenList);
    } else {
      const [polkadotBalance, kusamaBalance] = await Promise.all([
        getPolkadotBalance(),
        getKusamaBalance()
      ]);

      const polkadotValue =
        polkadotBalance?.toUsd(usdPrices.DOT ?? zeroUsd) ?? zeroUsd;
      const kusamaValue =
        kusamaBalance?.toUsd(usdPrices.KSM ?? zeroUsd) ?? zeroUsd;

      const tokensMap: Record<TokenType, WatermarkToken> = {} as Record<
        TokenType,
        WatermarkToken
      >;
      Object.values(initTokenMap).forEach((tokenItem) => {
        for (const evmBalance of evmBalances) {
          const targetToken = tokenItem.token;
          if (evmBalance.symbol.toLowerCase() === tokenItem.token) {
            const usd = new Usd(new Decimal(evmBalance.value));
            if (tokensMap[targetToken]) {
              tokensMap[targetToken].value.add(usd);
            } else {
              tokensMap[targetToken] = {
                ...initTokenMap[targetToken],
                value: usd
              };
            }
            tokensMap[targetToken].level = getLevel(
              tokensMap[targetToken].value
            );
          }
        }
      });

      tokensMap[Tokens.manta] = {
        ...mantaToken,
        level: getLevel(mantaToken.value)
      };
      tokensMap[Tokens.dot] = {
        ...initTokenMap[Tokens.dot],
        value: polkadotValue,
        level: getLevel(polkadotValue)
      };
      tokensMap[Tokens.ksm] = {
        ...initTokenMap[Tokens.ksm],
        value: kusamaValue,
        level: getLevel(kusamaValue)
      };

      const list = Object.values(tokensMap).sort((a, b) => {
        return b.value.value.minus(a.value.value).toNumber();
      });

      setWatermarkTokenList(list);
    }
  }, [
    externalAccount?.address,
    nativeTokenBalance,
    ethAddress,
    getPolkadotBalance,
    getKusamaBalance,
    usdPrices.DOT,
    usdPrices.KSM,
    evmBalances
  ]);

  useEffect(() => {
    const goHomePageAfterChangedAddress = () => {
      if (!addressRef?.current) {
        addressRef.current = externalAccount?.address;
        return;
      }
      if (externalAccount?.address !== addressRef?.current) {
        addressRef.current = externalAccount?.address;
        setCurrentStep(Step.Home);
        // to home first
        setTimeout(() => {
          resetContextData();
        });
      }
    };

    goHomePageAfterChangedAddress();
  }, [externalAccount?.address, resetContextData, setCurrentStep]);

  const value = useMemo(
    () => ({
      getWatermarkedImgs,
      saveMintInfo,
      mintSuccessed,
      toggleMintSuccessed,
      resetContextData,
      activeWatermarkIndex,
      setActiveWatermarkIndex,
      getWatermarkTokenList,
      watermarkTokenList
    }),
    [
      getWatermarkedImgs,
      saveMintInfo,
      mintSuccessed,
      resetContextData,
      activeWatermarkIndex,
      watermarkTokenList,
      getWatermarkTokenList
    ]
  );
  return <MintContext.Provider value={value}>{children}</MintContext.Provider>;
};

export const useMint = () => {
  const data = useContext(MintContext);
  if (!data || !Object.keys(data)?.length) {
    throw new Error(
      'useMint can only be used inside of <MintContext />, please declare it at a higher level.'
    );
  }
  return data;
};
