import axios from 'axios';
import Icon from 'components/Icon';
import { useConfig } from 'contexts/configContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { Step, useSBT } from 'pages/SBTPage/SBTContext';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import dayjs, { twoDP } from 'utils/time/dayjs';
import ButtonWithSignerAndWallet from '../ButtonWithSignerAndWallet';
import CountDown from './CountDown';
import FAQ from './FAQ';

export enum DateStatus {
  comingSoon,
  started,
  ended
}
export type hasNFTRes = {
  status: boolean;
  count: boolean;
};

const ONE_DAY_SECONDS = 3600 * 24;

const Home = () => {
  const { setCurrentStep } = useSBT();
  const { externalAccount } = useExternalAccount();
  const hasWallet = externalAccount;
  const config = useConfig();
  const [totalCount, setTotalCount] = useState(0);
  const [hasNFT, setHasNFT] = useState(false);
  const [dateStatus, setDateStatus] = useState<null | DateStatus>(null);

  const [searchParams] = useSearchParams();

  const endDate = useMemo(
    () => dayjs(searchParams.get('endDate') ?? '2024-04-24'),
    [searchParams]
  );
  const startDate = useMemo(
    () => dayjs(searchParams.get('startDate') ?? '2023-03-20'),
    [searchParams]
  );

  useEffect(() => {
    const curDate = dayjs(Date.now());
    if (curDate.diff(startDate) < 0) {
      setDateStatus(DateStatus.comingSoon);
    } else if (curDate.diff(endDate) > 0) {
      setDateStatus(DateStatus.ended);
    } else {
      setDateStatus(DateStatus.started);
    }
  }, [endDate, searchParams, startDate]);

  useEffect(() => {
    const getTotalCount = async () => {
      const url = `${config.SBT_NODE_SERVICE}/npo/count`;
      try {
        const res = await axios.post<{ count: number }>(url);
        if (res.status === 200 || res.status === 201) {
          const totalCount = Number(res.data.count) || 0;
          setTotalCount(totalCount);
        }
      } catch (error) {
        console.error('get total minted count error: ', error);
      }
    };
    getTotalCount();
  }, [config.SBT_NODE_SERVICE]);

  useEffect(() => {
    const getHasNFT = async () => {
      if (!externalAccount?.address) {
        return;
      }
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
        console.error('get address nft error: ', error);
      }
    };
    getHasNFT();
  }, [config.SBT_NODE_SERVICE, externalAccount?.address]);

  const toUpload = () => {
    setCurrentStep(Step.Upload);
  };

  const btnText = useMemo(() => {
    if (dateStatus === DateStatus.comingSoon) {
      return 'Coming Soon';
    }
    if (dateStatus === DateStatus.started) {
      return 'Generate';
    }
    return 'Ended';
  }, [dateStatus]);

  const title = dateStatus === DateStatus.started ? 'Ends in' : 'Start in';

  const startInDays = useMemo(() => {
    const curDate = dayjs();
    const diffTime = startDate.unix() - curDate.unix();

    const startInMoreThanOneDay =
      dateStatus === DateStatus.comingSoon && diffTime > ONE_DAY_SECONDS;
    if (startInMoreThanOneDay) {
      const duration = dayjs.duration(diffTime * 1000, 'milliseconds');
      return twoDP(Math.ceil(duration.asDays()));
    }
    return '';
  }, [dateStatus, startDate]);

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
                  {dateStatus !== DateStatus.ended && (
                    <div className="flex items-end mb-4">
                      <span>{title}</span>
                      {startInDays ? (
                        <div className="ml-4 flex items-end gap-2">
                          <span className="font-red-hat-mono text-2xl text-center text-sbt-date">
                            {startInDays}
                          </span>
                          <span>DAY(S) (UTC)</span>
                        </div>
                      ) : (
                        <CountDown
                          targetTime={
                            dateStatus === DateStatus.comingSoon
                              ? startDate
                              : endDate
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-3">
                  <div className="text-xl">40 $Manta</div>
                  <ButtonWithSignerAndWallet
                    disabled={dateStatus !== DateStatus.started}
                    btnComponent={btnText}
                    onClick={toUpload}
                    className="mb-2 px-12 py-2 unselectable-text text-center text-white rounded-lg gradient-button filter bottom-16 "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-white text-opacity-60">
          Total Minted: {totalCount}
        </div>
      </div>

      <div className="mt-4 w-full">
        <h1 className="text-2xl">Coming Soon</h1>
        <div className="flex justify-between align-bottom mt-4">
          <div className="left ">
            <div className="flex h-80 w-80 bg-primary">
              <div className="m-auto flex flex-col items-center font-red-hat-mono">
                <Icon className="w-20 h-20" name="manta" />
                <div className="mt-4 text-xl text-center">
                  MANTA <span className="ml-3">NETWORK</span>
                </div>
                <div className=" text-xl text-center">
                  NAME <span className="ml-3">SERVICE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 w-full">
        <h1 className="text-2xl">FAQ</h1>
        <div className="sbt-faq-content w-full flex justify-between align-bottom mt-4">
          <FAQ />
        </div>
      </div>
    </div>
  );
};

export default Home;
