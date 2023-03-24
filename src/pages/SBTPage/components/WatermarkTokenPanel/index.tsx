import { GeneratedImg } from 'pages/SBTPage/SBTContext';
import { useMint } from 'pages/SBTPage/SBTContext/mintContext';
import TokenButton, { TokenType, LevelType } from '../TokenButton';

const WatermarkTokenPanel = ({
  activeGeneratedImg,
  handleClickTokenBtn
}: {
  activeGeneratedImg: GeneratedImg;
  handleClickTokenBtn: (token: TokenType, level: LevelType) => void;
}) => {
  const { watermarkTokenList } = useMint();

  return (
    <div className="bg-secondary rounded-lg mt-4 ml-6 pb-4">
      <div className="text-white text-opacity-60 border-b border-split p-4 flex font-red-hat-mono font-medium text-sm">
        Please select up to one Crypto Watermark to include in your zkSBT
      </div>
      {watermarkTokenList.map(({ token, level }, index) => {
        return (
          <TokenButton
            token={token}
            level={level}
            checked={activeGeneratedImg?.watermarkToken === token}
            key={index}
            handleClickTokenBtn={handleClickTokenBtn}
          />
        );
      })}
    </div>
  );
};

export default WatermarkTokenPanel;
