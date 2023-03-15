import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useContext,
  useState
} from 'react';
import { FrameSystemAccountInfo } from '@polkadot/types/lookup';
import axios from 'axios';

import { useConfig } from 'contexts/configContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { useMetamask } from 'contexts/metamaskContext';
import Balance from 'types/Balance';
import AssetType from 'types/AssetType';
import BN from 'bn.js';
import {
  levels,
  LevelType,
  Tokens,
  TokenType
} from '../components/TokenButton';
import { useGenerated } from './generatedContext';
import { ThemeItem, useSBTTheme } from './sbtThemeContext';
import { GenerateStatus, useGenerating } from './generatingContext';
import { usePolkadotChain } from './PolkadotChainContext';
import { useKusamaChain } from './KusamaChainContext';
import { GeneratedImg, useSBT } from './';

type WatermarkToken = {
  token: TokenType;
  level: LevelType;
  checked?: boolean;
  price: string;
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
  [levels.normal]: 1,
  [levels.supreme]: 2,
  [levels.master]: 3
};

const MintContext = createContext<MintContextValue | null>(null);

export const MintContextProvider = ({ children }: { children: ReactNode }) => {
  const [mintSuccessed, toggleMintSuccessed] = useState(false);
  const [activeWatermarkIndex, setActiveWatermarkIndex] = useState(0);
  const [watermarkTokenList, setWatermarkTokenList] = useState<
    Array<WatermarkToken>
  >([]);

  const config = useConfig();
  const { modelId, toggleCheckedThemeItem } = useSBTTheme();
  const { setGeneratedImgs, setGenerateStatus } = useGenerating();
  const { mintSet, setMintSet } = useGenerated();
  const { externalAccount } = useExternalAccount();
  const { setImgList, setOnGoingTask, getPublicBalance } = useSBT();
  const { ethAddress } = useMetamask();
  const { api: polkadotApi } = usePolkadotChain();
  const { api: kusamaApi } = useKusamaChain();

  const getWatermarkedImgs = useCallback(async () => {
    const url = `${config.SBT_NODE_SERVICE}/npo/watermark`;
    const data = {
      data: [...mintSet].map(({ url, watermarkToken, watermarkLevel }) => {
        return {
          url,
          token: watermarkToken,
          size: LEVEL_TO_SIZE[watermarkLevel ?? levels.normal]
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
    toggleCheckedThemeItem
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

      const polkadotAsset = AssetType.Dot();
      const total = new Balance(polkadotAsset, new BN(free.toString()));
      const staked = new Balance(polkadotAsset, new BN(miscFrozen.toString()));

      return total.sub(staked);
    }
  }, [externalAccount?.address, polkadotApi?.query?.system]);

  const getKusamaBalance = useCallback(async () => {
    if (kusamaApi?.query?.system && externalAccount?.address) {
      const {
        data: { free, miscFrozen }
      } = (await kusamaApi?.query?.system?.account(
        'CgaccaysLRMQSNJUznK3SXAZwNRMuM8UURGDUmMzGzJfq6A' // TODO will replace with the wallet's address later
      )) as FrameSystemAccountInfo;
      const kusamaAsset = AssetType.Kusama(null, false);
      const total = new Balance(kusamaAsset, new BN(free.toString()));
      const staked = new Balance(kusamaAsset, new BN(miscFrozen.toString()));

      return total.sub(staked);
    }
  }, [externalAccount?.address, kusamaApi?.query?.system]);

  const getWatermarkTokenList = useCallback(async () => {
    if (!externalAccount?.address) {
      return;
    }
    if (!ethAddress) {
      const balance = await getPublicBalance(
        externalAccount?.address,
        AssetType.Native(false)
      );
      const tokenList = [
        {
          token: Tokens.manta,
          level: levels.normal,
          price: '0',
          balance
        }
      ];
      setWatermarkTokenList(tokenList);
      getPolkadotBalance();
      getKusamaBalance();
    } else {
      // TODO all the tokens info
    }
  }, [
    ethAddress,
    externalAccount?.address,
    getPolkadotBalance,
    getPublicBalance,
    getKusamaBalance
  ]);

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
