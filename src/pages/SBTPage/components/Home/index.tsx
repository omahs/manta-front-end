import axios from 'axios';
import Icon from 'components/Icon';
import { useConfig } from 'contexts/configContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { Step, useSBT } from 'pages/SBTPage/SBTContext';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'utils/time/dayjs';
import ButtonWithSignerAndWallet from '../ButtonWithSignerAndWallet';
import CountDown from './CountDown';
import FAQ from './FAQ';

export type hasNFTRes = {
  status: boolean;
  count: boolean;
};

const Home = () => {
  const { setCurrentStep } = useSBT();
  const { externalAccount } = useExternalAccount();
  const hasWallet = externalAccount;
  const config = useConfig();
  const [totalCount, setTotalCount] = useState(0);
  const [countDown, setCountDown] = useState('');
  const [hasNFT, setHasNFT] = useState(false);
  const [isWhiteList, setIsWhiteList] = useState(true);
  // TODO
  // const endTime = dayjs('2024-04-24');
  // const started = endTime.diff(dayjs(Date.now())) < 0;
  const endTime = dayjs(countDown);
  const started = countDown ? endTime.diff(dayjs(Date.now())) < 0 : true;

  const getTotalCount = useCallback(async () => {
    const url = `${config.SBT_NODE_SERVICE}/npo/count`;
    try {
      const res = await axios.post<number>(url);
      if (res.status === 200 || res.status === 201) {
        const totalCount = Number(res.data) || 0;
        setTotalCount(totalCount);
      }
    } catch (error) {
      // TODO
    }
  }, [config.SBT_NODE_SERVICE]);

  const getHasNFT = useCallback(async () => {
    const url = `${config.SBT_NODE_SERVICE}/npo/hasnft`;
    const address = externalAccount?.address;
    if (!address) return;
    const data = { address };
    try {
      const res = await axios.post<hasNFTRes>(url, data);
      if (res.status === 200 || res.status === 201) {
        const hasNFT = res.data?.count || false;
        setHasNFT(hasNFT);
      }
    } catch (error) {
      // TODO
    }
  }, [config.SBT_NODE_SERVICE, externalAccount?.address]);

  const getCountDown = useCallback(async () => {
    const url = `${config.SBT_NODE_SERVICE}/npo/countdown`;
    try {
      const res = await axios.post<string>(url);
      if (res.status === 200 || res.status === 201) {
        const countDown = res.data || '';
        setCountDown(countDown);
      }
    } catch (error) {
      // TODO
    }
  }, [config.SBT_NODE_SERVICE]);

  const getIsWhiteList = useCallback(async () => {
    const url = `${config.SBT_NODE_SERVICE}/npo/whitelist`;
    const address = externalAccount?.address;
    if (!address) return;
    const data = { address };
    try {
      const res = await axios.post<boolean>(url, data);
      if (res.status === 200 || res.status === 201) {
        const isWhiteList = res.data || false;
        setIsWhiteList(isWhiteList);
      }
    } catch (error) {
      // TODO
    }
  }, [config.SBT_NODE_SERVICE, externalAccount?.address]);

  // TODO
  useEffect(() => {
    getTotalCount();
    // getCountDown();
    if (externalAccount?.address) {
      getHasNFT();
      // getIsWhiteList();
    }
  }, [
    config.SBT_NODE_SERVICE,
    externalAccount?.address,
    getCountDown,
    getHasNFT,
    getIsWhiteList,
    getTotalCount
  ]);

  const toUpload = () => {
    setCurrentStep(Step.Upload);
  };

  return (
    <div className="flex flex-col items-center mx-auto bg-secondary rounded-xl p-6 w-75">
      <div className="w-full mb-6">
        {hasWallet && hasNFT && (
          <>
            <div className="text-2xl mb-4">My Account</div>
            <Link to="/dolphin/sbt/list">
              <ButtonWithSignerAndWallet
                btnComponent="My NFTs"
                className="px-14 py-2 unselectable-text text-center text-white rounded-lg gradient-button filter"
                noWalletComponent="Connect wallet to mint"
              />
            </Link>
          </>
        )}
      </div>
      <div className="w-full">
        <h1 className="text-2xl">Ongoing Projects</h1>
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
                  <CountDown endTime={endTime} started={started} />
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
                    <Icon name="information" className="text-error" />
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
        <h1 className="text-2xl">Coming Soon</h1>
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

      {/* <div className="mt-4 w-full">
        <h1 className="text-2xl">FAQ</h1>
        <div className="sbt-faq-content w-full flex justify-between align-bottom mt-4">
          <FAQ />
        </div>
      </div> */}
    </div>
  );
};

export default Home;
