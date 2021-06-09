import React, { useMemo } from 'react';
import { Flex, SimpleGrid, Text, Box } from '@chakra-ui/react';

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
 * @params props - {{ monthInfo, currentDate, onSelectDate }}
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
        <Box
          key={d}
          textAlign="center"
          as="span"
          color="gray.500"
          fontSize="0.525rem"
        >
          {d}
        </Box>
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
      ml="auto"
      mr="auto"
      maxWidth="270px"
      w="100%"
      direction="column"
      alignItems="center"
    >
      <Text mt="2" fontSize="16px">
        {MONTHS[month]}
      </Text>
      <SimpleGrid pb="2" pt="2" w="100%" columns={7} rowGap="1.5">
        {weekdays}
        {datesForThisMonthCalendar.map((d) => (
          <DateContainer
            key={`${d.year}_${d.month}_${d.date}`}
            containerDateInfo={d}
            currentDate={currentDate}
            sm={true}
            onClick={handleDateContainerClick}
          />
        ))}
      </SimpleGrid>
    </Flex>
  );
};
