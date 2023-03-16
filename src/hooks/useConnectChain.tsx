import { useReducer, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import type { DefinitionRpc, DefinitionRpcSub } from '@polkadot/types/types';

import { useConfig } from 'contexts/configContext';
import { API_STATE } from 'contexts/substrateContext';
import { useTxStatus } from 'contexts/txStatusContext';
import TxStatus from 'types/TxStatus';
import types from '../config/types.json';

type RPCType = Record<string, Record<string, DefinitionRpc | DefinitionRpcSub>>;
export type ChainStateType = {
  socket: string;
  rpc: RPCType;
  types: typeof types;
  api: ApiPromise | null;
  apiError: any;
  apiState: API_STATE | null;
  blockNumber: string | number;
};

const INIT_STATE: ChainStateType = {
  socket: '',
  rpc: {} as RPCType,
  types: types,
  api: null,
  apiError: null,
  apiState: null,
  blockNumber: 0
};

const SUBSTRATE_ACTIONS = {
  CONNECT_INIT: 'CONNECT_INIT',
  CONNECT_SUCCESS: 'CONNECT_SUCCESS',
  CONNECT_ERROR: 'CONNECT_ERROR',
  DISCONNECTED: 'DISCONNECTED',
  UPDATE_BLOCK: 'UPDATE_BLOCK'
};

type SubstrateActionType = keyof typeof SUBSTRATE_ACTIONS;

const reducer = (
  state: ChainStateType,
  action: {
    type: SubstrateActionType;
    payload: any;
  }
) => {
  switch (action.type) {
    case SUBSTRATE_ACTIONS.CONNECT_INIT:
      return { ...state, apiState: API_STATE.CONNECT_INIT };

    case SUBSTRATE_ACTIONS.CONNECT_SUCCESS:
      return { ...state, api: action.payload, apiState: API_STATE.READY };

    case SUBSTRATE_ACTIONS.CONNECT_ERROR:
      return { ...state, apiState: API_STATE.ERROR, apiError: action.payload };

    case SUBSTRATE_ACTIONS.DISCONNECTED:
      return { ...state, apiState: API_STATE.DISCONNECTED };

    case SUBSTRATE_ACTIONS.UPDATE_BLOCK:
      return { ...state, blockNumber: action.payload };

    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

export const useConnectChain = (socket: string) => {
  const config = useConfig();
  const initState = {
    ...INIT_STATE,
    socket,
    rpc: config.RPC
  };
  const [state, dispatch] = useReducer(reducer, initState);
  const { types, rpc } = state;
  const { txStatusRef, setTxStatus } = useTxStatus();

  useEffect(() => {
    const handleConnected = (api: ApiPromise) => {
      console.log('polkadot.js api connected');
      // `ready` event is not emitted upon reconnection and is checked explicitly here.
      api.isReady.then(async () => {
        dispatch({
          type: SUBSTRATE_ACTIONS.CONNECT_SUCCESS as SubstrateActionType,
          payload: api
        });
        await api.rpc.chain.subscribeNewHeads((header) => {
          dispatch({
            type: SUBSTRATE_ACTIONS.UPDATE_BLOCK as SubstrateActionType,
            payload: header.number.toHuman()
          });
        });
      });
    };

    const handleError = (err: any) => {
      console.error(err);
      dispatch({
        type: SUBSTRATE_ACTIONS.CONNECT_ERROR as SubstrateActionType,
        payload: err
      });
      if (txStatusRef.current?.isProcessing()) {
        setTxStatus(TxStatus.disconnected());
      }
    };

    const handleDisconnected = (provider: WsProvider) => {
      dispatch({
        type: SUBSTRATE_ACTIONS.DISCONNECTED as SubstrateActionType,
        payload: provider
      });
      if (txStatusRef.current?.isProcessing()) {
        setTxStatus(TxStatus.disconnected());
      }
    };

    const connect = async () => {
      dispatch({
        type: SUBSTRATE_ACTIONS.CONNECT_INIT as SubstrateActionType,
        payload: null
      });
      const provider = new WsProvider(socket);
      const api = new ApiPromise({
        provider,
        types,
        rpc
      });
      // Set listeners for disconnection and reconnection event.
      api.on('connected', () => handleConnected(api));
      api.on('ready', () =>
        dispatch({
          type: SUBSTRATE_ACTIONS.CONNECT_SUCCESS as SubstrateActionType,
          payload: api
        })
      );
      api.on('error', (err) => handleError(err));
      api.on('disconnected', () => handleDisconnected(provider));
    };
    connect();
  }, []);

  return state;
};
