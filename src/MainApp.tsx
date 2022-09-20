// @ts-nocheck
import React from 'react';
import config from 'config';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SendPage } from 'pages';
import MissingRequiredSoftwareModal from 'components/Modal/missingRequiredSoftwareModal';
import MobileNotSupportedModal from 'components/Modal/mobileNotSupported';
import Sidebar from 'components/Sidebar';
import ThemeToggle from 'components/ThemeToggle';
import userIsMobile from 'utils/ui/userIsMobile';
import NewerSignerVersionRequiredModal from 'components/Modal/newerSignerVersionRequiredModal';
import DowntimeModal from 'components/Modal/downtimeModal';
import signerIsOutOfDate from 'utils/validation/signerIsOutOfDate';
import { usePrivateWallet } from 'contexts/privateWalletContext';

function MainApp() {
  const { signerVersion } = usePrivateWallet();
  const onMobile = userIsMobile();

  let warningModal;
  if (config.DOWNTIME) {
    warningModal = <DowntimeModal />;
  } else if (onMobile) {
    warningModal = <MobileNotSupportedModal />;
  } else if (signerIsOutOfDate(signerVersion)) {
    warningModal = <NewerSignerVersionRequiredModal />;
  } else {
    warningModal = <MissingRequiredSoftwareModal />;
  }

  document.title = config.PAGE_TITLE;

  return (
    <div className="main-app bg-primary flex">
      <Sidebar />
      {warningModal}
      <Routes>
        <Route path="/" element={<Navigate to="/transact" replace />} />
        <Route path="/send" element={<Navigate to="/transact" replace />} />
        <Route path="/transact" element={<SendPage />} />
      </Routes>
      <div className="p-4 hidden change-theme lg:block fixed right-0 bottom-0">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default MainApp;
