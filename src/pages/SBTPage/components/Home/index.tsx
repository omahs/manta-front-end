import Icon from 'components/Icon';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { Step, useSBT } from 'pages/SBTPage/SBTContext';
import { useEffect } from 'react';
import dayjs from 'utils/time/dayjs';
import ButtonWithSignerAndWallet from '../ButtonWithSignerAndWallet';
import Countdown from './CountDown';
import FAQ from './FAQ';
import Warning from './Warning';

const Home = () => {
  const {
    setCurrentStep,
    hasNFT,
    countDown,
    totalCount,
    isWhiteList,
    getHasNFT,
    getTotalCount,
    getCountDown,
    getIsWhiteList
  } = useSBT();
  const { externalAccount } = useExternalAccount();
  const hasWallet = externalAccount;
  // TODO
  const endTime = dayjs('2024-04-24');
  const started = endTime.diff(dayjs(Date.now())) < 0;
  // const endTime = dayjs(countDown);
  // const started = countDown ? endTime.diff(dayjs(Date.now())) < 0 : true;

  useEffect(() => {
    getTotalCount();
    getHasNFT();
    getCountDown();
    getIsWhiteList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toUpload = () => {
    setCurrentStep(Step.Upload);
  };

  const toMinted = () => {
    setCurrentStep(Step.Generated); // TODO go to [zkSBT display page]
  };

  return (
    <div className="font-red-hat-text flex flex-col items-center mx-auto bg-secondary rounded-xl p-6 w-75">
      <div className="w-full mb-6">
        {hasWallet && hasNFT && (
          <>
            <div className="text-2xl mb-4">My Account</div>
            <ButtonWithSignerAndWallet
              onClick={toMinted}
              btnComponent="My NFTs"
              className="px-14 py-2 unselectable-text text-center text-white rounded-lg gradient-button filter"
              noWalletComponent="Connect wallet to mint"
            />
          </>
        )}
      </div>
      <div className="w-full">
        <h1 className="font-red-hat-text text-2xl">Ongoing Projects</h1>
        <div className=" flex justify-between align-bottom mt-4">
          <div className="left ">
            <div className="flex h-80 w-80 bg-primary">
              <div className="m-auto flex flex-col items-center font-red-hat-mono">
                <Icon className="w-20 h-20" name="manta" />
                <div className="mt-4 text-xl text-center">zkSBT</div>
              </div>
            </div>
          </div>
          <div className="right ml-6">
            <div className="pt-6 pb-4 text-2xl">zkSBT</div>
            <div className="text-sm text-white text-opacity-80">
              Nullam suscipit ex et erat imperdiet, eu condimentum ex dapibus.
              Ut ornare tellus eget libero blandit, et dignissim dui mollis.
              Suspendisse potenti. Orci varius natoque penatibus et magnis dis
              parturient montes, nascetur ridiculus mus. Proin eleifend nisl in
              nunc fringilla, vitae elementum tortor porta. Suspendisse in
              lectus non risus varius egestas. Maecenas condimentum vehicula mi
              quis mattis. Nulla commodo velit non sagittis egestas. Cras ut
              risus sapien. Suspendisse pellentesque laoreet quam eget ornare.
              Maecenas in blandit erat. Donec convallis a erat sed ultricies.
              Pellentesque faucibus sapien lectus, non pretium eros eleifend ut.{' '}
            </div>
            <div className="count-down mt-4 py-4 px-6 flex justify-between bg-sbt-count-down rounded-md">
              <div className="flex flex-col justify-between w-full ">
                <div className="flex  justify-between">
                  <div className="text-2xl">WL Mint</div>
                  <Countdown endTime={endTime} started={started} />
                </div>
                <div className="flex justify-between mt-3">
                  <div className="text-xl">40 Manta</div>
                  <ButtonWithSignerAndWallet
                    disabled={!isWhiteList || !started}
                    btnComponent={started ? 'Generate' : 'Coming Soon'}
                    onClick={toUpload}
                    className="mb-2 px-12 py-2 unselectable-text text-center text-white rounded-lg gradient-button filter bottom-16 "
                  />
                </div>
                {!isWhiteList && (
                  <div className="flex justify-end gap-2">
                    <Warning />
                    <div className="text-xs text-error">
                      Only open to WL zkAddress
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>Total Minted: {totalCount}</div>
      </div>

      <div className="mt-4 w-full">
        <h1 className="font-red-hat-text text-2xl">Coming Soon</h1>
        <div className="flex justify-between align-bottom mt-4">
          <div className="left ">
            <div className="flex h-80 w-80 bg-primary">
              <div className="m-auto flex flex-col items-center font-red-hat-mono">
                <Icon className="w-20 h-20" name="manta" />
                <div className="mt-4 text-xl text-center">MANTA NETWORK</div>
                <div className=" text-xl text-center">NAME SERVICE</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full">
        <h1 className="font-red-hat-text text-2xl">FAQ</h1>
        <div className="sbt-faq-content w-full flex justify-between align-bottom mt-4">
          <FAQ />
        </div>
      </div>
    </div>
  );
};

export default Home;
