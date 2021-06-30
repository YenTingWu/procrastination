import create from 'zustand';
import { combine } from 'zustand/middleware';
import type { State } from 'zustand';

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
