import React, { useMemo } from 'react';
import { Flex, SimpleGrid, Text } from '@chakra-ui/react';

import { WEEKDAYS, MONTHS, DateInfoType } from '@types';
import { getThisMonthDateInfo } from '../../lib/getThisMonthDateInfo';
import { DateContainer } from './DateContainer';

type MonthInfo = {
  month: number;
  year: number;
};

interface UncontrolledMonthlyDatePickerProps {
  monthInfo: MonthInfo;
  currentDate: DateInfoType;
  onSelectDate: (d: DateInfoType) => void;
}

/**
 * ## UncontrolledMonthlyDatePicker
 * @params props - {{ year, month }}
 * @returns React.FC
 */

export const UncontrolledMonthlyDatePicker: React.FC<UncontrolledMonthlyDatePickerProps> = ({
  monthInfo,
  currentDate,
  onSelectDate,
}) => {
  const { year, month } = monthInfo;

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
    () => getThisMonthDateInfo({ year, month }),
    [year, month]
  );

  const handleDateContainerClick = (d: DateInfoType) => onSelectDate(d);
  return (
    <Flex
      maxWidth="270px"
      w="100%"
      direction="column"
      alignItems="center"
      boxShadow="1px 3px 8px 3px rgba(0, 0, 0, 0.25)"
      borderRadius="10px"
    >
      <Text mt="2" fontSize="16px" fontWeight="extrabold">
        {MONTHS[month]}, {year}
      </Text>
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
