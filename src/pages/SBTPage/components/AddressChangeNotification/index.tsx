import Icon from 'components/Icon';
import { Notification } from 'element-react';
import { Step, useSBT } from 'pages/SBTPage/SBTContext';
import { useEffect, useState } from 'react';

const AddressChangeNotification = () => {
  const { hintStatus, updateHintStatus, currentStep } = useSBT();

  useEffect(() => {
    const toggleNotification = () => {
      if (hintStatus && currentStep !== Step.Home) {
        if (!document.getElementById('address-change-content')) {
          Notification({
            title: '',
            message: (
              <AddressChangeContent updateHintStatus={updateHintStatus} />
            ),
            duration: 0,
            offset: 80
          });
        }
      } else {
        // hack Notification component does not support to close it mannually
        let dom = document.getElementById('address-change-content');
        while (dom?.parentElement && dom?.parentElement !== document.body) {
          dom = dom.parentElement;
        }
        dom?.remove();
      }
    };

    toggleNotification();
  }, [currentStep, hintStatus, updateHintStatus]);

  return null;
};

const AddressChangeContent = ({
  updateHintStatus
}: {
  updateHintStatus: () => void;
}) => {
  const [checked, toggleChecked] = useState(false);

  const handleClick = () => {
    toggleChecked(!checked);
    setTimeout(() => {
      updateHintStatus();
    });
  };

  return (
    <div
      className="flex items-start pt-2 cursor-pointer"
      id="address-change-content">
      <Icon name="warning" fill="#FFA132" />
      <div className="flex flex-col ml-4 flex-1">
        <p className="text-white text-sm">
          Please note that you will be led to the home page if you switch to
          another wallet address.
          <br />
          You will not lose your progress if you change back to the current
          wallet address.
        </p>
        <p
          className="flex items-center text-white text-xs pt-4 flex text-opacity-60"
          onClick={handleClick}>
          {checked ? (
            <Icon name="greenCheck" className="mr-2 w-4 h-4" />
          ) : (
            <svg
              className="mr-2 w-4 h-4"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="10" fill="white" fillOpacity="0.05" />
              <circle
                cx="10"
                cy="10"
                r="9.5"
                stroke="white"
                strokeOpacity="0.1"
              />
            </svg>
          )}
          Never show again
        </p>
      </div>
    </div>
  );
};
export default AddressChangeNotification;
