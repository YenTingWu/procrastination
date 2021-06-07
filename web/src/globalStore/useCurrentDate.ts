import create from 'zustand';
import { combine } from 'zustand/middleware';
import { DateInfoType } from '@types';

const getCurrentDate = (): DateInfoType => {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth(),
    date: today.getDate(),
  };
};

export const useCurrentDate = create(
  combine({ currentDate: getCurrentDate() }, (set) => ({
    setDate: ({ year, month, date }: DateInfoType) =>
      set({ currentDate: { year, month, date } }),
  }))
);
