import { useCallback, useMemo, useEffect } from 'react';
import { useTimeCounterStore } from '@globalStore/client/useTimeCounterStore';
import hoursToSeconds from 'date-fns/fp/hoursToSeconds';

interface Params {
  uuid: string;
  duration: number;
  isCounting: boolean;
}

export function getTimeObject(time: number) {
  const minToSeconds = 60;
  const hourToSeconds = hoursToSeconds(1);

  if (time < minToSeconds) return { hours: 0, mins: 0, secs: time };
  if (time < hourToSeconds)
    return {
      hours: 0,
      mins: Math.floor(time / 60),
      secs: time % 60,
    };

  const hours = Math.floor(time / hourToSeconds);
  const mins = Math.floor((time - hoursToSeconds(hours)) / 60);
  const secs = (time % hourToSeconds) % minToSeconds;

  return {
    hours,
    mins,
    secs,
  };
}

export const useTimeCounter = ({
  uuid,
  duration,
  isCounting = false,
}: Params) => {
  const { timerCounters, increaseSecond } = useTimeCounterStore(
    useCallback(
      (s) => ({
        timerCounters: s.timeCounters,
        increaseSecond: s.increaseSecond,
      }),
      [uuid]
    )
  );
  const timer = useMemo(
    () => timerCounters.find((timer) => timer.uuid === uuid),
    [timerCounters]
  );

  useEffect(() => {
    if (isCounting && timer) {
      const t = setInterval(() => increaseSecond(timer.uuid), 1000);
      return () => clearInterval(t);
    }
  }, []);

  return getTimeObject(timer?.duration || duration);
};
