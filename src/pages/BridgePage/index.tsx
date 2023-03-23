// @ts-nocheck
import React from 'react';
import PageContent from 'components/PageContent';
import Navbar from 'components/Navbar';
// import { useConfig } from 'contexts/configContext';
// import { dolphinConfig } from 'config';
// import DowntimeModal from 'components/Modal/downtimeModal';
import { BridgeDataContextProvider } from './BridgeContext/BridgeDataContext';
import { BridgeTxContextProvider } from './BridgeContext/BridgeTxContext';
import BridgeForm from './BridgeForm';

const BridgePage = () => {
  // const { NETWORK_NAME } = useConfig();
  // const isDolphinPage = NETWORK_NAME === dolphinConfig.NETWORK_NAME;
  return (
    <BridgeDataContextProvider>
      <BridgeTxContextProvider>
        <Navbar />
        <PageContent>
          <BridgeForm />
        </PageContent>
        {/* { isDolphinPage && <DowntimeModal />} */}
      </BridgeTxContextProvider>
    </BridgeDataContextProvider>
  );
};

export default BridgePage;
