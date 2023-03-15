import React, { useEffect, useState } from 'react';
import { getGiantSquidBannerIsActive } from 'utils/time/timeDuring';
import GiantSquidBanner from './GiantSquidBanner';
export enum BANNER_TYPE {
  GIANT_SQUID,
  DEFAULT
}
const ActivityBanner: React.FC<object> = () => {
  const [bannerType, setBannerType] = useState(BANNER_TYPE.DEFAULT);

  useEffect(() => {
    if (getGiantSquidBannerIsActive()) {
      setBannerType(BANNER_TYPE.GIANT_SQUID);
    } else {
      setBannerType(BANNER_TYPE.DEFAULT);
    }
  }, []);

  if (bannerType === BANNER_TYPE.GIANT_SQUID) {
    return <GiantSquidBanner />;
  }
  return null;
};
export default ActivityBanner;
