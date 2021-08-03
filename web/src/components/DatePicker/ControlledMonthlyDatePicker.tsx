import React, { useMemo, useReducer, Reducer, useCallback } from 'react';
import { Flex, SimpleGrid, Text } from '@chakra-ui/layout';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { WEEKDAYS, MONTHS, DateInfoType } from '@types';
import { useCurrentSelectedDate } from '@globalStore/client/useCurrentSelectedDate';
import { getThisMonthDateInfo } from '@lib/getThisMonthDateInfo';
import { DateContainer } from './DateContainer';

type State = {
  month: number;
  year: number;
};

type Action =
  | { type: 'monthIncrement' }
  | { type: 'monthDecrement' }
  | { type: 'setMonth'; payload: { month: number; year: number } };

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'monthIncrement':
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
    case 'monthDecrement':
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
        year: action.payload.year,
        month: action.payload.month,
      };

    default:
      throw new Error();
  }
};

export interface ControlledMonthlyDatePickerProps {}

/**
 * ## ControlledMonthlyDatePicker
 * @param
 * @returns React.FC
 */

export const ControlledMonthlyDatePicker: React.FC<ControlledMonthlyDatePickerProps> = ({}) => {
  const { currentSelectedDate, setDate } = useCurrentSelectedDate((s) => ({
    currentSelectedDate: s.currentSelectedDate,
    setDate: s.setDate,
  }));

  const [state, dispatch] = useReducer(reducer, {
    /**
     * This is for initial value.
     * While uncontrolled picker's value is provided by parent, controlled picker use currentDate to be initial value.
     *
     * This can improve user experience.
     * It's because every time users load into the page with controlled picker, the controlled picker will show the month of currentDate
     */

    year: currentSelectedDate.year,
    month: currentSelectedDate.month,
  });

  const weekdays = useMemo(
    () =>
      Object.values(WEEKDAYS).map((d) => (
        <Flex
          key={d}
          justifyContent="center"
          color="gray.500"
          as="span"
          fontSize="12px"
        >
          {d}
        </Flex>
      )),
    []
  );

  const datesForThisMonthCalendar = useMemo(
    () => getThisMonthDateInfo({ year: state.year, month: state.month }),
    [state.year, state.month]
  );

  const handleAddMonth = useCallback(
    () => dispatch({ type: 'monthIncrement' }),
    []
  );
  const handleMinusMonth = useCallback(
    () => dispatch({ type: 'monthDecrement' }),
    []
  );
  const handleDateContainerClick = (d: DateInfoType) => {
    if (d.month !== state.month) {
      dispatch({ type: 'setMonth', payload: { month: d.month, year: d.year } });
    }
    setDate(d);
  };

  return (
    <Flex
      maxWidth="270px"
      w="100%"
      direction="column"
      alignItems="center"
      borderRadius="10px"
    >
      <Flex
        alignSelf="stretch"
        mt="2"
        alignItems="center"
        justifyContent="center"
      >
        <ChevronLeftIcon
          w="20px"
          h="20px"
          _hover={{
            cursor: 'pointer',
          }}
          onClick={handleMinusMonth}
        />
        <Text ml="2" mr="2" fontSize="16px" fontWeight="extrabold">
          {MONTHS[state.month]}, {state.year}
        </Text>
        <ChevronRightIcon
          w="20px"
          h="20px"
          _hover={{
            cursor: 'pointer',
          }}
          onClick={handleAddMonth}
        />
      </Flex>
      <SimpleGrid
        pl="3"
        pr="3"
        pb="3"
        pt="2"
        w="100%"
        columns={7}
        columnGap="2"
        rowGap="2"
      >
        {weekdays}
        {datesForThisMonthCalendar.map((d) => (
          <DateContainer
            key={`${d.year}_${d.month}_${d.date}`}
            containerDateInfo={d}
            currentDate={currentSelectedDate}
            onClick={handleDateContainerClick}
          />
        ))}
      </SimpleGrid>
    </Flex>
  );
};
