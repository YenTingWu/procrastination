import React, { useState, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Flex, Text, SimpleGrid } from '@chakra-ui/layout';
import { useTypeSafeBreakpointValue } from '@hooks/useTypeSafeBreakpointValue';
import { UncontrolledMonthlyDatePicker } from './UncontrolledMonthlyDatePicker';
import { useCurrentSelectedDate } from '@globalStore/client/useCurrentSelectedDate';
import { DateInfoType } from '@types';

export interface YearlyDatePickerProps {}

export const YearlyDatePicker: React.FC<YearlyDatePickerProps> = () => {
  const { currentSelectedDate, setDate } = useCurrentSelectedDate((s) => ({
    currentSelectedDate: s.currentSelectedDate,
    setDate: s.setDate,
  }));

  const [year, setYear] = useState<number>(currentSelectedDate.year);

  const containerWidthVariant = useTypeSafeBreakpointValue({
    xl: '980px',
    lg: '800px',
    default: '100%',
  });

  const columnsVariant = useTypeSafeBreakpointValue({
    xl: 4,
    lg: 3,
    md: 2,
    default: 1,
  });

  const handleAddYear = useCallback(() => setYear((y) => y + 1), []);
  const handleMinusYear = useCallback(() => setYear((y) => y - 1), []);
  const handleSelectedDate = useCallback((d: DateInfoType) => setDate(d), []);

  let monthlyPicker: Array<JSX.Element> = [];

  for (let i = 0; i < 12; i++) {
    monthlyPicker.push(
      <UncontrolledMonthlyDatePicker
        key={`${year}_${i}`}
        monthInfo={{ year, month: i }}
        selectedDate={currentSelectedDate}
        onSelectDate={handleSelectedDate}
      />
    );
  }

  return (
    <Flex flexDirection="column" w={containerWidthVariant}>
      <Flex justifyContent="center" alignItems="center" alignSelf="center">
        <ChevronLeftIcon
          w="20px"
          h="20px"
          _hover={{
            cursor: 'pointer',
          }}
          onClick={handleMinusYear}
        />
        <Text ml="2" mr="2" fontSize="16px" fontWeight="extrabold">
          {year}
        </Text>
        <ChevronRightIcon
          w="20px"
          h="20px"
          _hover={{
            cursor: 'pointer',
          }}
          onClick={handleAddYear}
        />
      </Flex>
      <SimpleGrid
        w="100%"
        columnGap="7"
        rowGap="3"
        columns={columnsVariant as number}
      >
        {monthlyPicker}
      </SimpleGrid>
    </Flex>
  );
};
