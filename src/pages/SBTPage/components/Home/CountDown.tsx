import { Dayjs } from 'dayjs';
import { useInterval } from 'hooks';
import React, { memo, useState } from 'react';
import dayjs, { twoDP } from 'utils/time/dayjs';

interface CountDownProps {
  endTime: Dayjs;
  started: boolean;
}

const INTERVAL = 1000;

const CountDown: React.FC<CountDownProps> = ({ endTime, started }) => {
  const [days, setDays] = useState<string | number>();
  const [hours, setHours] = useState<string | number>();
  const [minutes, setMinutes] = useState<string | number>();
  const [seconds, setSeconds] = useState<string | number>();

  const currentTime = dayjs();
  const diffTime = endTime.unix() - currentTime.unix();
  let duration = dayjs.duration(diffTime * 1000, 'milliseconds');

  useInterval(
    () => {
      duration = dayjs.duration(
        duration.asMilliseconds() - INTERVAL,
        'milliseconds'
      );

      const days = twoDP(Math.floor(duration.asDays()));
      const hours = twoDP(duration.hours());
      const minutes = twoDP(duration.minutes());
      const seconds = twoDP(duration.seconds());
      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    },
    diffTime > 0 ? INTERVAL : null
  );

  return (
    <div className="flex items-end mb-4">
      {started && (
        <>
          <span>Ends in</span>
          <div className="ml-4 flex items-end gap-2">
            <span className="font-red-hat-mono text-2xl text-center text-sbt-date">
              {days}
            </span>
            <span>D</span>
            <span className="w-8 font-red-hat-mono text-2xl text-center text-sbt-date">
              {hours}
            </span>
            <span>H</span>
            <span className="w-8 font-red-hat-mono text-2xl text-center text-sbt-date">
              {minutes}
            </span>
            <span>M</span>
            <span className="w-8 font-red-hat-mono text-2xl text-center text-sbt-date">
              {seconds}
            </span>
            <span>S</span>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(CountDown);
