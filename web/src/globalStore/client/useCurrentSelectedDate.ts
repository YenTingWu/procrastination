import create from 'zustand';
import { combine } from 'zustand/middleware';
import { DateInfoType } from '@types';
import { getYearObject } from '@lib/getYearObject';

const getCurrentDate = (): DateInfoType => {
  const today = new Date();
  return getYearObject(today);
};

const getDefaultValues = () => ({
  currentSelectedDate: getCurrentDate(),
});

export const useCurrentSelectedDate = create(
  combine(getDefaultValues(), (set) => ({
    setDate: ({ year, month, date }: DateInfoType) =>
      set({ currentSelectedDate: { year, month, date } }),
  }))
);
