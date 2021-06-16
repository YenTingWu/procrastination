import create from 'zustand';
import { State } from 'zustand';
import { combine } from 'zustand/middleware';

export type OpenedPicker = null | 'startTime' | 'endTime';

interface DefaultValue extends State {
  openedPicker: OpenedPicker;
}

const getDefaultValues = (): DefaultValue => ({ openedPicker: null });

export const useSelectDateTimeOpen = create(
  combine(getDefaultValues(), (set) => ({
    setSelectOpenedPicker: (value: OpenedPicker) =>
      set((state) => {
        if (state.openedPicker === value) return { openedPicker: null };
        return { openedPicker: value };
      }),
  }))
);
