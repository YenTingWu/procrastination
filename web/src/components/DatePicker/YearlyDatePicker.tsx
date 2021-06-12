import React, { useState, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Flex, Text, SimpleGrid, useBreakpointValue } from '@chakra-ui/react';
import { UncontrolledMonthlyDatePicker } from './UncontrolledMonthlyDatePicker';
import { useCurrentDate } from '@globalStore/useCurrentDate';
import { DateInfoType } from '@types';

export interface YearlyDatePickerProps {}

export const YearlyDatePicker: React.FC<YearlyDatePickerProps> = () => {
  const { currentDate, setDate } = useCurrentDate((s) => ({
    currentDate: s.currentDate,
    setDate: s.setDate,
  }));

  const [year, setYear] = useState<number>(currentDate.year);

  const containerWidthVariant = useBreakpointValue({
    xl: '980px',
    lg: '800px',
    base: '100%',
  });

  const columnsVariant = useBreakpointValue({
    xl: 4,
    lg: 3,
    md: 2,
    base: 1,
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
        selectedDate={currentDate}
        onSelectDate={handleSelectedDate}
      />
    );
  }

  return (
    <Flex flexDirection="column" w={containerWidthVariant as string}>
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
