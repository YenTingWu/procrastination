import create, { SetState } from 'zustand';
import { combine } from 'zustand/middleware';
import type { State } from 'zustand';

type timeCounter = {
  duration: number;
  uuid: string;
};

interface InitialState extends State {
  timeCounters: timeCounter[];
}

function refreshTimeCounterList(set: SetState<InitialState>) {
  return (list: timeCounter[]) => set({ timeCounters: [...list] });
}

function setDuration(set: SetState<InitialState>) {
  return ({ uuid, duration }: timeCounter) =>
    set((state) => {
      const timeCounters = [...state.timeCounters].map((timeCounter) => {
        if (timeCounter.uuid !== uuid) return timeCounter;
        timeCounter.duration = duration;
        return timeCounter;
      });
      return {
        timeCounters,
      };
    });
}

function increaseSecond(set: SetState<InitialState>) {
  return (uuid: string) =>
    set((state) => {
      const timeCounters = [...state.timeCounters].map((timer) => {
        if (timer.uuid !== uuid) return timer;
        timer.duration += 1;
        return timer;
      });
      return {
        timeCounters,
      };
    });
}

const getInitialState = (): InitialState => ({ timeCounters: [] });
const getInitialMutation = (set: SetState<InitialState>) => ({
  refreshTimeCounterList: refreshTimeCounterList(set),
  setDuration: setDuration(set),
  increaseSecond: increaseSecond(set),
});

export const useTimeCounterStore = create(
  combine(getInitialState(), (set) => getInitialMutation(set))
);
