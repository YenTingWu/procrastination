import React, {
  useReducer,
  useCallback,
  useRef,
  useMemo,
  Reducer,
} from 'react';
import { Flex, Divider } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/select';
import { Input } from '@chakra-ui/input';
import { FormLabel } from '@chakra-ui/form-control';
import { useField } from 'formik';
import format from 'date-fns/fp/format';
import { UncontrolledMonthlyDatePicker } from '@components/DatePicker/UncontrolledMonthlyDatePicker';
import { compareFormatHoursMinutes } from '@lib/compareFormatHoursMinutes';
import { getYearObject } from '@lib/getYearObject';
import { createDailyTimeRangeArray } from '@lib/createDailyTimeRangeArray';
import {
  useSelectDateTimeOpen,
  OpenedPicker,
} from '@globalStore/client/useSelectDateTimeOpen';
import { DateInfoType } from '@types';

export type FormState = {
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
};

type DatePickerControllerState = {
  month: number;
  year: number;
};

type DatePickerControllerAction =
  | { type: 'increaseMonth' }
  | { type: 'decreaseMonth' }
  | { type: 'setMonth'; payload: { month: number; year: number } };

const monthlyDatePickerReducer: Reducer<
  DatePickerControllerState,
  DatePickerControllerAction
> = (state, action) => {
  switch (action.type) {
    case 'increaseMonth':
      if (state.month === 11) {
        return {
          month: 0,
          year: state.year + 1,
        };
      }
      return {
        ...state,
        month: state.month + 1,
      };
    case 'decreaseMonth':
      if (state.month === 0) {
        return {
          month: 11,
          year: state.year - 1,
        };
      }
      return {
        ...state,
        month: state.month - 1,
      };
    case 'setMonth':
      return {
        month: action.payload.month,
        year: action.payload.year,
      };

    default:
      throw new Error();
  }
};
interface DateTimePickerInputProps {
  fieldKey: string;
  label: string;
}

/**
 * ## DateTimePickerInput
 * A Date Time Pick with Input Showcase used as Formik children
 * @param { fieldKey: string, label: string; timeArr: string[] } props
 * @returns React.FC
 */

export const DateTimePickerInput: React.FC<DateTimePickerInputProps> = ({
  label,
  fieldKey,
}) => {
  const { openedPicker, setSelectOpenedPicker } = useSelectDateTimeOpen(
    (s) => ({
      openedPicker: s.openedPicker,
      setSelectOpenedPicker: s.setSelectOpenedPicker,
    })
  );
  const [field, _, helpers] = useField(fieldKey);
  const main = useRef<HTMLDivElement>(null);

  const { value }: { value: Date } = field;

  const formattedDate = format('MMM dd, yyyy HH:mm', value);
  const formattedTime = format('HH:mm', value);

  const handleToggleDrop = useCallback(
    (e) => {
      if (main.current == null) return;

      const { children } = main.current;
      let matched = false;

      for (let i = 0; i < children.length; i++) {
        if (children[i] === e.target) matched = true;
      }

      if (!matched) return;

      // setDrop((s) => !s);
      setSelectOpenedPicker(fieldKey as OpenedPicker);
    },
    [main.current, fieldKey]
  );

  // ------------------------- Monthly date picker controller ------------------------- \\
  // Controller of datePicker (control month add and minus)
  const [state, dispatch] = useReducer(monthlyDatePickerReducer, {
    // Initial value
    month: value.getMonth(),
    year: value.getFullYear(),
  });

  const handleAddMonth = useCallback(
    () => dispatch({ type: 'increaseMonth' }),
    []
  );
  const handleMinusMonth = useCallback(
    () => dispatch({ type: 'decreaseMonth' }),
    []
  );

  // -------------------------- Select Time, Date Controller -------------------------- \\
  const handleSelectDate = useCallback(
    (d: DateInfoType) => {
      const { month, year, date } = d;

      if (month !== state.month) {
        dispatch({ type: 'setMonth', payload: { month, year } });
      }

      const cloneT = new Date(value);
      cloneT.setDate(date);
      cloneT.setMonth(month);
      cloneT.setFullYear(year);
      helpers.setValue(cloneT);
    },
    [state.month, helpers]
  );

  const handleSelectTime = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const splitArr = e.target.value.split(':');
      const hours = parseInt(splitArr[0], 10);
      const minutes = parseInt(splitArr[1], 10);

      if (typeof hours !== 'number' || typeof minutes !== 'number') return;

      const cloneT = new Date(value);
      cloneT.setHours(hours);
      cloneT.setMinutes(minutes);

      helpers.setValue(cloneT);
    },
    [helpers]
  );

  const options = useMemo(() => {
    const timeArr = createDailyTimeRangeArray();
    return timeArr.reduce((acc, cur, i) => {
      acc.push(
        <option key={cur} value={cur}>
          {cur}
        </option>
      );

      /**
       * formattedTime is "the very current time" for creating mode,
       * when it is a modifying mode, it's the event's "startTime" and "endTime"
       *
       * If cur < formattedTime < next_value_of_cur
       * then push the formattedTime into accumulator
       *
       * If cur < formattedTime, and cur is the last value of the array
       * push the formattedTime into accumulator as well
       */

      if (
        compareFormatHoursMinutes(formattedTime, cur) === 1 &&
        (timeArr[i + 1] == null ||
          compareFormatHoursMinutes(formattedTime, timeArr[i + 1]) === -1)
      ) {
        acc.push(
          <option key={formattedTime} value={formattedTime}>
            {formattedTime}
          </option>
        );
      }
      return acc;
    }, [] as Array<JSX.Element>);
  }, []);

  return (
    <Flex pl={10} pr={10} flexDirection="column" alignItems="center">
      <Flex
        data-testid="main-date-picker-input-container"
        alignItems="center"
        ref={main}
        onClick={handleToggleDrop}
      >
        <FormLabel
          m="0"
          htmlFor={label}
          fontWeight="extrabold"
          flex={'1 150px'}
          _hover={{ cursor: 'pointer' }}
          _selection={{ bg: 'none' }}
        >
          {label}
        </FormLabel>
        <Input
          id={label}
          textAlign="center"
          fontSize="md"
          value={formattedDate}
          disabled
          border={'none'}
          _disabled={{ cursor: 'pointer' }}
          _hover={{ cursor: 'pointer' }}
          _selection={{ bg: 'none' }}
        />
      </Flex>
      {openedPicker === (fieldKey as OpenedPicker) && (
        <>
          <Divider />
          <Flex
            data-testid="monthly-date-picker-container"
            alignSelf="stretch"
            alignItems="center"
          >
            <UncontrolledMonthlyDatePicker
              flex={'3 40px'}
              monthInfo={{
                month: state.month,
                year: state.year,
              }}
              selectedDate={getYearObject(value)}
              onAddMonth={handleAddMonth}
              onMinusMonth={handleMinusMonth}
              onSelectDate={handleSelectDate}
            />
            <Select
              ml="5"
              flex={'1 30px'}
              variant="flushed"
              defaultValue={formattedTime}
              onChange={handleSelectTime}
            >
              {options}
            </Select>
          </Flex>
        </>
      )}
    </Flex>
  );
};
