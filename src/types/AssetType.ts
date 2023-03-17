// @ts-nocheck
import NETWORK from 'constants/NetworkConstants';
import BN from 'bn.js';

const CalamariAssetIds = {
  KMA: 1,
  KAR: 8,
  AUSD: 9,
  LKSM: 10,
  MOVR: 11,
  KSM: 12
};

const DolphinAssetIds = {
  DOL: 1,
  KAR: 8,
  AUSD: 9,
  LKSM: 10,
  MOVR: 11,
  KSM: 12,
  DOT: 13 // Asset id is not correct, it's just to initialize an Dot Asset
};

const getAssetIds = (config) => {
  if (config.NETWORK_NAME === NETWORK.CALAMARI) {
    return CalamariAssetIds;
  } else if (config.NETWORK_NAME === NETWORK.DOLPHIN) {
    return DolphinAssetIds;
  }
};

export default class AssetType {
  assetId: number;
  baseName: string;
  name: string;
  baseTicker: string;
  ticker: string;
  logicalTicker: string;
  icon: string;
  numberOfDecimals: number;
  publicExistentialDeposit: BN;
  existentialDeposit: BN;
  isPrivate: boolean;
  isTestnet: boolean;
  isNativeToken: boolean;
  coingeckoId: string;

  constructor(
    assetId,
    baseName,
    baseTicker,
    icon,
    numberOfDecimals,
    publicExistentialDeposit,
    isPrivate,
    coingeckoId,
    isTestnet,
    isNativeToken = false,
    logicalTicker = null
  ) {
    this.assetId = assetId;
    this.baseName = baseName;
    this.baseTicker = baseTicker;
    this.logicalTicker = logicalTicker || baseTicker;
    this.name = AssetType._getFullName(baseName, isPrivate, isTestnet);
    this.ticker = AssetType._getFullTicker(baseTicker, isPrivate);
    this.icon = icon;
    this.numberOfDecimals = numberOfDecimals;
    this.publicExistentialDeposit = publicExistentialDeposit;
    this.existentialDeposit = isPrivate ? new BN(0) : publicExistentialDeposit;
    this.isPrivate = isPrivate;
    this.isTestnet = isTestnet;
    this.isNativeToken = isNativeToken;
    this.coingeckoId = coingeckoId;
  }

  static Native(config) {
    if (config.NETWORK_NAME === 'Calamari') {
      return AssetType.Calamari(config, false);
    } else {
      return AssetType.DolphinSkinnedCalamari(config, false);
    }
  }

  static DolphinSkinnedCalamari(config, isPrivate) {
    return new AssetType(
      getAssetIds(config).DOL,
      'Dolphin',
      'DOL',
      'dolphin',
      18, // TODO: just for test only, will remove this later
      new BN('100000000000000000'), // TODO: just for test only, will remove this later
      isPrivate,
      'dolphin',
      config.IS_TESTNET,
      true,
      'KMA'
    );
  }

  static Calamari(config, isPrivate) {
    return new AssetType(
      getAssetIds(config).KMA,
      'Calamari',
      'KMA',
      'calamari',
      12,
      new BN('100000000000'),
      isPrivate,
      'calamari-network',
      config.IS_TESTNET,
      true
    );
  }

  static Karura(config, isPrivate) {
    return new AssetType(
      getAssetIds(config).KAR,
      'Karura',
      'KAR',
      'kar',
      12,
      new BN('100000000000'),
      isPrivate,
      'karura',
      config.IS_TESTNET
    );
  }
  static Kusama(config, isPrivate) {
    return new AssetType(
      getAssetIds(config).KSM,
      'Kusama',
      'KSM',
      'kusama',
      12,
      new BN('500000000'),
      isPrivate,
      'kusama',
      config.IS_TESTNET
    );
  }

  static Rococo(config, isPrivate) {
    return new AssetType(
      getAssetIds(config).ROC,
      'Rococo',
      'ROC',
      'roc',
      12,
      new BN('1'),
      isPrivate,
      'rococo',
      config.IS_TESTNET
    );
  }

  static KintsugiBTC(config, isPrivate) {
    return new AssetType(
      getAssetIds(config).KBTC,
      'Kintsugi BTC',
      'kBTC',
      'kbtc',
      8,
      new BN('1'),
      isPrivate,
      'bitcoin',
      config.IS_TESTNET
    );
  }

  static Moonriver(config, isPrivate) {
    return new AssetType(
      getAssetIds(config).MOVR,
      'Moonriver',
      'MOVR',
      'movr',
      18,
      new BN('100000000000000000'),
      isPrivate,
      'moonriver',
      config.IS_TESTNET
    );
  }
  static Dot(config, isPrivate = false) {
    return new AssetType(
      getAssetIds(config).DOT,
      'Polkadot',
      'DOT',
      'dot',
      10,
      new BN('100000000'),
      isPrivate,
      'polkadot',
      true
    );
  }

  static AllCurrencies(config, isPrivate) {
    if (config.NETWORK_NAME === NETWORK.DOLPHIN) {
      return [
        AssetType.DolphinSkinnedCalamari(config, isPrivate),
        AssetType.Karura(config, isPrivate),
        AssetType.Kusama(config, isPrivate),
        AssetType.Moonriver(config, isPrivate),
        AssetType.Dot(config, isPrivate)
      ];
    } else if (config.NETWORK_NAME === NETWORK.CALAMARI) {
      return [
        AssetType.Calamari(config, isPrivate),
        // AssetType.Karura(config, isPrivate),
        AssetType.Kusama(config, isPrivate),
        AssetType.Moonriver(config, isPrivate)
      ];
    }
  }

  static _getFullName(baseName, isPrivate, isTestnet) {
    let name = isTestnet ? 'Test ' : '';
    if (isPrivate) {
      name += 'zk';
    }
    return name + baseName;
  }

  static _getFullTicker(baseTicker, isPrivate) {
    return isPrivate ? `zk${baseTicker}` : baseTicker;
  }

  toPrivate() {
    return new AssetType(
      this.assetId,
      this.baseName,
      this.baseTicker,
      this.icon,
      this.numberOfDecimals,
      this.publicExistentialDeposit,
      true,
      this.coingeckoId,
      this.isTestnet,
      this.isNativeToken,
      this.logicalTicker
    );
  }

  toPublic() {
    return new AssetType(
      this.assetId,
      this.baseName,
      this.baseTicker,
      this.icon,
      this.numberOfDecimals,
      this.publicExistentialDeposit,
      false,
      this.coingeckoId,
      this.isTestnet,
      this.isNativeToken,
      this.logicalTicker
    );
  }

  toggleIsPrivate() {
    if (this.isPrivate) {
      return this.toPublic();
    } else {
      return this.toPrivate();
    }
  }

  canTransferXcm = (originChain, destinationChain) => {
    return (
      originChain.xcmAssets.find((asset) => asset.name === this.name) &&
      destinationChain.xcmAssets.find((asset) => asset.name === this.name)
    );
  };
}
