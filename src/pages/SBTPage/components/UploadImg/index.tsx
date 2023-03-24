import { ChangeEvent, useRef } from 'react';

import Icon from 'components/Icon';
import { useSBT } from 'pages/SBTPage/SBTContext';
import DotLoader from 'components/Loaders/DotLoader';
import { useExternalAccount } from 'contexts/externalAccountContext';

const UploadImg = ({
  uploadLoading,
  toggleUploadLoading
}: {
  uploadLoading: boolean;
  toggleUploadLoading: (uploadLoading: boolean) => void;
}) => {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const { externalAccount } = useExternalAccount();
  const { uploadImgs } = useSBT();

  const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files?.length) {
      toggleUploadLoading(true);
      await uploadImgs([...e.target.files]);
      toggleUploadLoading(false);
    }
    // fix the same file can not upload twice bug
    if (fileRef?.current) {
      fileRef.current.value = '';
    }
  };
  const disabledStyle =
    uploadLoading || !externalAccount
      ? 'brightness-50 cursor-not-allowed'
      : 'cursor-pointer';

  return (
    <div className="relative w-max">
      <div className="border border-dash-gray border-dashed bg-secondary rounded-lg w-52 h-52 flex justify-center items-center">
        {uploadLoading ? (
          <DotLoader cls="transform scale-200" />
        ) : (
          <Icon name="defaultImg" />
        )}
      </div>
      <input
        className={`opacity-0 absolute top-0 left-0 right-0 bottom-0 ${disabledStyle}`}
        type="file"
        multiple
        accept="image/*"
        onChange={onImageChange}
        disabled={uploadLoading}
        ref={fileRef}
      />
    </div>
  );
};

export default UploadImg;
