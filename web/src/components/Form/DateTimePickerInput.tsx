import React, {
  useReducer,
  useCallback,
  useRef,
  useMemo,
  Reducer,
} from 'react';
import { Flex, Input, Select, FormLabel, Divider } from '@chakra-ui/react';
import { useField } from 'formik';
import format from 'date-fns/fp/format';
import { UncontrolledMonthlyDatePicker } from '@components/DatePicker/UncontrolledMonthlyDatePicker';
import { compareFormatHoursMinutes } from '@lib/compareFormatHoursMinutes';
import { getYearObject } from '@lib/getYearObject';
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
  timeArr: string[];
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
  timeArr,
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

  const options = useMemo(
    () =>
      timeArr.reduce((acc, cur, i) => {
        acc.push(
          <option key={cur} value={cur}>
            {cur}
          </option>
        );

        /* If cur < formattedTime < next_value_of_cur */
        /* Then push the formattedTime into accumulator */

        if (
          compareFormatHoursMinutes(formattedTime, cur) === 1 &&
          compareFormatHoursMinutes(timeArr[i + 1], formattedTime) === 1
        ) {
          acc.push(
            <option key={formattedTime} value={formattedTime}>
              {formattedTime}
            </option>
          );
        }
        return acc;
      }, [] as Array<JSX.Element>),
    []
  );

  return (
    <Flex pl={10} pr={10} flexDirection="column" alignItems="center">
      <Flex alignItems="center" ref={main} onClick={handleToggleDrop}>
        <FormLabel
          m="0"
          fontWeight="extrabold"
          flex={'1 150px'}
          _hover={{ cursor: 'pointer' }}
          _selection={{ bg: 'none' }}
        >
          {label}
        </FormLabel>
        <Input
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
      {(fieldKey as OpenedPicker) === openedPicker && (
        <>
          <Divider />
          <Flex alignSelf="stretch" alignItems="center">
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
