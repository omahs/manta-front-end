const giantSquidStartTimeStr =
  'Thu Mar 16 2023 00:00:00 GMT+0800 (中国标准时间)';
const giantSquidEndTimeStr = 'Fri Mar 31 2023 00:00:00 GMT+0800 (中国标准时间)';

export const getGiantSquidBannerIsActive = (): boolean => {
  return getTimeWindowIsActive(
    new Date(),
    new Date(giantSquidStartTimeStr),
    new Date(giantSquidEndTimeStr)
  );
};
export const getTimeWindowIsActive = (
  time: Date,
  startTime: Date,
  endTime: Date
): boolean => {
  const targetTimeStamp = new Date(time.toUTCString()).getTime();
  const startTimeStamp = new Date(startTime.toUTCString()).getTime();
  const endTimeStamp = new Date(endTime.toUTCString()).getTime();
  if (targetTimeStamp <= endTimeStamp && targetTimeStamp >= startTimeStamp) {
    return true;
  }
  return false;
};
