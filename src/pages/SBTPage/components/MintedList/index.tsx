import axios from 'axios';
import Icon from 'components/Icon';
import { useConfig } from 'contexts/configContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import dayjs from 'dayjs';
import { GeneratedImg } from 'pages/SBTPage/SBTContext';
import { useEffect, useState } from 'react';
import MintedImg from '../MintedImg';

type GeneratedImgType = GeneratedImg & {
  proof_id?: string;
  asset_id?: string;
};

type MintedMap = Record<string, GeneratedImgType[]>;

const MintedImgItem = ({
  date,
  mintedMap
}: {
  date: string;
  mintedMap: MintedMap;
}) => (
  <div key={date} className="my-4">
    <p className="text-white text-opacity-60 text-sm font-red-mono-text">
      {dayjs(date).format('MMM DD，YYYY')}
    </p>
    <div className="grid grid-cols-5 gap-2 mt-4">
      {mintedMap[date].map((item, index) => (
        <MintedImg
          {...item}
          key={index}
          proofId={item.proof_id}
          assetId={`#${item.asset_id}`}
        />
      ))}
    </div>
  </div>
);

const MintedList = () => {
  const [mintedMap, setMintedMap] = useState<MintedMap>({});

  const config = useConfig();
  const { externalAccount } = useExternalAccount();

  useEffect(() => {
    const getMintedMap = async () => {
      if (!externalAccount?.address) {
        return;
      }
      const url = `${config.SBT_NODE_SERVICE}/npo/nftlist`;
      const data = {
        address: externalAccount?.address
      };
      const ret = await axios.post<MintedMap>(url, data);
      if (ret.status === 200 || ret.status === 201) {
        setMintedMap(ret.data);
      }
    };
    getMintedMap();
  }, [config.SBT_NODE_SERVICE, externalAccount?.address]);

  return (
    <div className="flex-1 flex flex-col mx-auto mb-8 bg-secondary rounded-xl p-6 w-75 relative">
      <div className="flex items-center">
        <Icon name="manta" className="w-8 h-8 mr-3" />
        <h2 className="text-2xl font-red-hat-mono tracking-widest font-medium">
          zkSBT
        </h2>
      </div>
      <h1 className="text-3xl mt-4">Minted</h1>
      <div className="overflow-y-auto max-h-60vh">
        {Object.keys(mintedMap).map((date) => {
          return <MintedImgItem date={date} key={date} mintedMap={mintedMap} />;
        })}
      </div>
    </div>
  );
};

export default MintedList;
