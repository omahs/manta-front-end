import IPBlockingModal from 'components/Modal/IPBlockingModal';
import MantaWalletIntroModal from 'components/Modal/MantaWalletIntroModal';
import Navbar from 'components/Navbar';
import PageContent from 'components/PageContent';
import { SendContextProvider } from './SendContext';
import SendForm from './SendForm';
import { PrivateTxHistoryContextProvider } from './privateTxHistoryContext';

const SendPage = () => {
  return (
    <SendContextProvider>
      <PrivateTxHistoryContextProvider>
        <Navbar />
        <PageContent>
          <SendForm />
        </PageContent>
        <MantaWalletIntroModal />
        <IPBlockingModal />
      </PrivateTxHistoryContextProvider>
    </SendContextProvider>
  );
};

export default SendPage;
