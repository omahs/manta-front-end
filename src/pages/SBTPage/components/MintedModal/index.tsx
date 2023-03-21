import { useState, useEffect } from 'react';

import Icon from 'components/Icon';
import { Popover } from 'element-react';
import { useGenerated } from 'pages/SBTPage/SBTContext/generatedContext';
import asMatchImg from 'resources/images/sbt/asMatch.png';
import MintedImg from '../MintedImg';

const PopContent = () => {
  return (
    <div className="flex items-center text-xss text-white text-left">
      <img src={asMatchImg} className="w-24" />
      <p className="flex-1 ml-4">
        For AsMatch Users, please click here to copy and paste to the page at
        AsMatch App as shown on the left. If you have multiple zkSBTs, don’t
        worry this also works for multiple zkSBTs.
      </p>
    </div>
  );
};

const MintedModal = () => {
  const [copied, toggleCopied] = useState(false);

  const { mintSet } = useGenerated();
  const copyAll = () => {
    const textToCopy = [...mintSet].map(({ proofId }) => proofId).join(',');
    navigator.clipboard.writeText(textToCopy);
    toggleCopied(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => copied && toggleCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copiedStyled = copied ? 'opacity-60' : '';

  return (
    <div className="text-white w-204">
      <h2 className="text-2xl">MINTED！</h2>
      <p className="text-white text-opacity-60 text-xs mb-2 mt-6">
        Your zkSBTs should appear in your Manta Signer. You can also check all
        your zkSBTs and Proof Keys in your Manta Signer.
        <br />
        For AsMatch users, you can start using these zkSBTs now by copying your
        Proof Key or by copying all Proof Keys. <br />
        Have not downloaded AsMatch yet? <br />
        Click <span className="text-check">here</span> to Download and start
        Match2Earn right now!
      </p>
      <div className="grid w-full gap-6 grid-cols-4 pb-12 mt-6">
        {[...mintSet]?.map((generatedImg, index) => {
          return <MintedImg {...generatedImg} key={index} />;
        })}
      </div>
      {mintSet.size > 1 ? (
        <div className="flex justify-center items-center">
          <button
            className={`w-60 px-4 py-2 unselectable-text text-center text-white rounded-lg gradient-button filter ${copiedStyled}`}
            onClick={copyAll}>
            {copied ? 'Copied' : 'Click to copy all Proof Keys'}
          </button>
          {/* 
        // @ts-ignore */}
          <Popover
            trigger="hover"
            placement="right"
            content={<PopContent />}
            width="356">
            <div>
              <Icon name="question" className="ml-4 cursor-pointer" />
            </div>
          </Popover>
        </div>
      ) : (
        // @ts-ignore
        <Popover
          trigger="hover"
          placement="right"
          content={<PopContent />}
          width="356">
          <div className="absolute bottom-20 left-52">
            <Icon name="question" className="ml-4 cursor-pointer" />
          </div>
        </Popover>
      )}
    </div>
  );
};

export default MintedModal;
