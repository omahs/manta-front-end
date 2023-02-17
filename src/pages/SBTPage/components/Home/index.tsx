import Icon from 'components/Icon';
import { Step, useSBT } from 'pages/SBTPage/SBTContext';
import sbtImgs from 'resources/images/sbt';
import ConnectWalletModal from 'components/Modal/connectWalletModal';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { useModal } from 'hooks';

const Home = () => {
  const { setCurrentStep } = useSBT();
  const { ModalWrapper, showModal, hideModal } = useModal();
  const { externalAccount } = useExternalAccount();

  const toUpload = () => {
    if (!externalAccount) {
      showModal();
      return;
    }
    setCurrentStep(Step.Upload);
  };
  return (
    <div className="flex flex-col items-center mx-auto bg-secondary rounded-xl p-14 w-75">
      <Icon className="w-20 h-20" name="manta" />
      <h2 className="text-white text-6xl mt-6 mb-4">MANTA zkSBT</h2>
      <div className="grid gap-6 grid-cols-9 grid-rows-3 w-full justify-between mt-8 mb-20">
        {sbtImgs.map((item, index) => {
          return (
            <img
              className="w-24 h-24 rounded-xl cursor-pointer hover:scale-200 transform duration-200 hover:z-10"
              key={index}
              src={item}
            />
          );
        })}
      </div>
      <button
        onClick={toUpload}
        className="px-36 py-2 unselectable-text text-center text-white rounded-lg gradient-button filter">
        {externalAccount
          ? 'Mint your AI-generated zkSBT'
          : 'Connect wallet to mint'}
      </button>
      <ModalWrapper>
        <ConnectWalletModal
          setIsMetamaskSelected={null}
          hideModal={hideModal}
        />
      </ModalWrapper>
    </div>
  );
};

export default Home;
