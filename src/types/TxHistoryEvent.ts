import Balance, { JsonBalance } from './Balance';

export enum HISTORY_EVENT_STATUS {
  FAILED = 'Failed',
  SUCCESS = 'Success',
  PENDING = 'Pending'
}

export enum PRIVATE_TX_TYPE {
  TO_PRIVATE = 'toPrivate',
  TO_PUBLIC = 'toPublic',
  PRIVATE_TRANSFER = 'privateTransfer'
}

export enum TransactionMsgAction {
  Send = 'Send',
  Transact = 'Transact'
}

export default class TxHistoryEvent {
  transactionType: PRIVATE_TX_TYPE;
  jsonBalance: JsonBalance;
  date: Date;
  status: HISTORY_EVENT_STATUS;
  extrinsicHash: string;
  subscanUrl: string;
  network: string;
  constructor(
    config: any,
    balance: Balance,
    extrinsicHash: string,
    transactionType: PRIVATE_TX_TYPE
  ) {
    const subscanUrl = `${config.SUBSCAN_URL}/extrinsic/${extrinsicHash}`;
    this.transactionType = transactionType;
    this.jsonBalance = balance.toJson();
    this.date = new Date();
    this.status = HISTORY_EVENT_STATUS.PENDING;
    this.extrinsicHash = extrinsicHash;
    this.subscanUrl = subscanUrl;
    this.network = config.network;
  }
}
