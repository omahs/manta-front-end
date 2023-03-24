import Icon from 'components/Icon';
import { SwiperSlide } from 'swiper/react';

import { useGenerated } from 'pages/SBTPage/SBTContext/generatedContext';
import { useGenerating } from 'pages/SBTPage/SBTContext/generatingContext';
import { GeneratedImg } from 'pages/SBTPage/SBTContext/index';
import { MAX_MINT_SIZE } from '../Generated';

type ItemType = {
  generatedImg: GeneratedImg;
  toggleMint: (generatedImg: GeneratedImg) => void;
};
const GeneratedImgItem = ({ generatedImg, toggleMint }: ItemType) => {
  const { mintSet } = useGenerated();

  const checkedStyle = mintSet.has(generatedImg) ? 'border-4 border-check' : '';
  const disabledStyle =
    mintSet.size >= MAX_MINT_SIZE && !mintSet.has(generatedImg)
      ? 'cursor-not-allowed filter grayscale'
      : 'cursor-pointer';

  return (
    <div className="relative">
      <img
        src={generatedImg?.url}
        className={`rounded-xl ${checkedStyle} ${disabledStyle} img-bg unselectable-text w-24 h-24`}
        onClick={() => toggleMint(generatedImg)}
      />
      {mintSet.has(generatedImg) && (
        <Icon name="greenCheck" className="absolute bottom-2 left-2 w-4 h-4" />
      )}
    </div>
  );
};

const GeneratedImgs = () => {
  const { generatedImgs } = useGenerating();
  const { mintSet, setMintSet } = useGenerated();

  const toggleMint = (generatedImg: GeneratedImg) => {
    const newMintSet = new Set(mintSet);
    if (newMintSet.has(generatedImg)) {
      newMintSet.delete(generatedImg);
    } else {
      if (newMintSet.size >= MAX_MINT_SIZE) {
        return;
      }
      newMintSet.add(generatedImg);
    }
    setMintSet(newMintSet);
  };

  return (
    <div className="w-full mx-auto">
      <div className="w-full grid grid-rows-2 grid-cols-10 gap-4">
        {generatedImgs.map((generatedImg, index) => {
          return (
            <GeneratedImgItem
              generatedImg={generatedImg}
              toggleMint={toggleMint}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GeneratedImgs;
