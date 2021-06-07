import React, { useMemo, useReducer, Reducer } from 'react';
import { Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { WEEKDAYS, MONTHS, DateInfoType } from '@types';
import { useCurrentDate } from '@globalStore/useCurrentDate';
import { getThisMonthDateInfo } from '../../lib/getThisMonthDateInfo';
import { DateContainer } from './DateContainer';

type State = {
  month: number;
  year: number;
};

type Action =
  | { type: 'monthIncrement' }
  | { type: 'monthDecrement' }
  | { type: 'yearIncrement' }
  | { type: 'yearDecrement' };

function reducer(state: State, action: Action): State {
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
    case 'yearIncrement':
      return { ...state, year: state.year + 1 };
    case 'yearDecrement':
      return { ...state, year: state.year - 1 };
    default:
      throw new Error();
  }
}

interface ControlledMonthlyDatePickerProps {}

/**
 * ## ControlledMonthlyDatePicker
 * @param
 * @returns React.FC
 */

export const ControlledMonthlyDatePicker: React.FC<ControlledMonthlyDatePickerProps> = ({}) => {
  const { currentDate, setDate } = useCurrentDate((s) => ({
    currentDate: s.currentDate,
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

    year: currentDate.year,
    month: currentDate.month,
  });

  const weekdays = useMemo(
    () =>
      Object.values(WEEKDAYS).map((d) => (
        <Flex key={d} justifyContent="center" as="span" fontSize="12px">
          {d}
        </Flex>
      )),
    []
  );

  const datesForThisMonthCalendar = useMemo(
    () => getThisMonthDateInfo({ year: state.year, month: state.month }),
    [state.year, state.month]
  );

  const handleDateContainerClick = (d: DateInfoType) => setDate(d);

  return (
    <Flex
      maxWidth="270px"
      w="100%"
      direction="column"
      alignItems="center"
      boxShadow="1px 3px 8px 3px rgba(0, 0, 0, 0.25)"
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
          onClick={() => dispatch({ type: 'monthDecrement' })}
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
          onClick={() => dispatch({ type: 'monthIncrement' })}
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
            currentDate={currentDate}
            onClick={handleDateContainerClick}
          />
        ))}
      </SimpleGrid>
    </Flex>
  );
};
