import { useState } from 'react';
import QRCode from 'react-qr-code';

import CopyPasteIcon from 'components/CopyPasteIcon';
import Icon from 'components/Icon';
import { GeneratedImg } from 'pages/SBTPage/SBTContext';

const MintedImg = ({ blur_url, url, proofId = '', style }: GeneratedImg) => {
  const [showQrCode, toggleQrCode] = useState(false);
  return (
    <div className="relative w-max bg-primary rounded-lg">
      <img src={blur_url ?? url} className="rounded-lg w-44 h-44" />
      <div className="absolute bottom-16 w-full flex px-2 justify-between items-end">
        <span className="text-white text-sm font-red-hat-mono font-bold">
          {style}
        </span>
        {!showQrCode && (
          <Icon
            name="qrCode"
            onClick={() => toggleQrCode(true)}
            className="cursor-pointer"
          />
        )}
      </div>
      {showQrCode && (
        <div
          onClick={() => toggleQrCode(false)}
          className="absolute flex justify-center w-44 h-44 top-0 left-0 cursor-pointer bg-black bg-opacity-60">
          <QRCode value={proofId} size={123} />
        </div>
      )}
      <div className="px-2 py-2 pt-2.5 flex items-center w-44 justify-between text-xs unselectable-text">
        <div className="flex-1">
          <p className="text-white text-opacity-60 text-xsss font-red-hat-text">
            Proof Key
          </p>
          <p className="text-white text-sm font-red-hat-mono">{`${proofId?.slice(
            0,
            6
          )}..${proofId?.slice(-4)}`}</p>
        </div>
        <CopyPasteIcon textToCopy={proofId ?? ''} />
      </div>
    </div>
  );
};
export default MintedImg;
