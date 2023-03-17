import { ReactNode } from 'react';

import Navbar from 'components/Navbar';
import { Route, Routes } from 'react-router-dom';
import OnGoingTaskNotification from './components/OnGoingTaskModal';
import Main from './Main';
import { SBTContextProvider } from './SBTContext';
import { FaceRecognitionContextProvider } from './SBTContext/faceRecognitionContext';
import { GeneratedContextProvider } from './SBTContext/generatedContext';
import { GeneratingContextProvider } from './SBTContext/generatingContext';
import { SBTPrivateContextProvider } from './SBTContext/sbtPrivateWalletContext';
import { SBTThemeContextProvider } from './SBTContext/sbtThemeContext';
import { MintContextProvider } from './SBTContext/mintContext';
import { PolkadotChainProvider } from './SBTContext/PolkadotChainContext';
import { KusamaChainProvider } from './SBTContext/KusamaChainContext';
import AddressChangeNotification from './components/AddressChangeNotification';
import MintedList from './components/MintedList';

import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/navigation/navigation.scss'; // Navigation module
import 'swiper/modules/pagination/pagination.scss'; // Pagination module
import './index.scss';

const ChainsProviders = ({ children }: { children: ReactNode }) => {
  return (
    <PolkadotChainProvider>
      <KusamaChainProvider>{children}</KusamaChainProvider>
    </PolkadotChainProvider>
  );
};

const SBTProviders = ({ children }: { children: ReactNode }) => {
  return (
    <SBTContextProvider>
      <FaceRecognitionContextProvider>
        <SBTThemeContextProvider>
          <GeneratingContextProvider>
            <GeneratedContextProvider>
              <MintContextProvider>{children}</MintContextProvider>
            </GeneratedContextProvider>
          </GeneratingContextProvider>
        </SBTThemeContextProvider>
      </FaceRecognitionContextProvider>
    </SBTContextProvider>
  );
};

const SBT = () => {
  return (
    <ChainsProviders>
      <SBTProviders>
        <SBTPrivateContextProvider>
          <div className="text-white min-h-screen flex flex-col sbt-page">
            <Navbar showZkBtn={true} />
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/list" element={<MintedList />} />
            </Routes>
            <AddressChangeNotification />
            <OnGoingTaskNotification />
          </div>
        </SBTPrivateContextProvider>
      </SBTProviders>
    </ChainsProviders>
  );
};
export default SBT;
