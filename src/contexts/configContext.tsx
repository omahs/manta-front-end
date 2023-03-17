// @ts-nocheck
import NETWORK from 'constants/NetworkConstants';
import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { dolphinConfig, calamariConfig } from 'config';

const ConfigContext = createContext();

export const ConfigContextProvider = ({ children, network }) => {
  const config = useMemo(() => {
    if (network === NETWORK.CALAMARI) {
      return calamariConfig;
    } else if (network === NETWORK.DOLPHIN) {
      return dolphinConfig;
    }
  }, [network]);

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

ConfigContextProvider.propTypes = {
  children: PropTypes.any,
  network: PropTypes.string
};

export const useConfig = () => ({
  ...useContext(ConfigContext)
});
