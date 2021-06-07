import React, { useState, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Flex, Text, SimpleGrid } from '@chakra-ui/react';
import { UncontrolledMonthlyDatePicker } from './UncontrolledMonthlyDatePicker';
import { useCurrentDate } from '@globalStore/useCurrentDate';
import { DateInfoType } from '@types';

export const YearlyDatePicker = () => {
  const { currentDate, setDate } = useCurrentDate((s) => ({
    currentDate: s.currentDate,
    setDate: s.setDate,
  }));

  const [year, setYear] = useState<number>(currentDate.year);

  const handleAddYear = useCallback(() => setYear((y) => y + 1), []);
  const handleMinusYear = useCallback(() => setYear((y) => y - 1), []);
  const handleSelectedDate = useCallback((d: DateInfoType) => setDate(d), []);

  let monthlyPicker: Array<JSX.Element> = [];

  for (let i = 0; i < 12; i++) {
    monthlyPicker.push(
      <UncontrolledMonthlyDatePicker
        monthInfo={{ year, month: i }}
        currentDate={currentDate}
        onSelectDate={handleSelectedDate}
      />
    );
  }

  return (
    <Flex flexDirection="column" w="900px">
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
      <SimpleGrid w="100%" columnGap="2" rowGap="3" columns={4} rows={3}>
        {monthlyPicker}
      </SimpleGrid>
    </Flex>
  );
};
