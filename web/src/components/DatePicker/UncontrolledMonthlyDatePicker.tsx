import React, { useMemo, useCallback } from 'react';
import { Flex, SimpleGrid, Text, Box, FlexProps } from '@chakra-ui/layout';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { WEEKDAYS, MONTHS, DateInfoType } from '@types';
import { getThisMonthDateInfo } from '../../lib/getThisMonthDateInfo';
import { DateContainer } from './DateContainer';

type MonthInfo = {
  month: number;
  year: number;
};

interface UncontrolledMonthlyDatePickerProps extends FlexProps {
  monthInfo: MonthInfo;
  selectedDate: DateInfoType;
  onSelectDate: (d: DateInfoType) => void;
  onAddMonth?: () => void;
  onMinusMonth?: () => void;
}

/**
 * ## UncontrolledMonthlyDatePicker
 * @param {{{ monthInfo, currentDate, onSelectDate, onAddMonth?, onMinusMonth?}
 * @returns React.FC
 */

export const UncontrolledMonthlyDatePicker: React.FC<UncontrolledMonthlyDatePickerProps> = ({
  monthInfo,
  selectedDate,
  onSelectDate,
  onAddMonth,
  onMinusMonth,
  flex,
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
          _selection={{ background: 'none' }}
          _hover={{ cursor: 'default' }}
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

  const monthSection =
    onAddMonth && onMinusMonth ? (
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
          onClick={onMinusMonth}
        />
        <Text ml="2" mr="2" fontSize="16px" fontWeight="extrabold">
          {MONTHS[month]}, {year}
        </Text>
        <ChevronRightIcon
          w="20px"
          h="20px"
          _hover={{
            cursor: 'pointer',
          }}
          onClick={onAddMonth}
        />
      </Flex>
    ) : (
      <Text mt="2" fontSize="16px">
        {MONTHS[month]}
      </Text>
    );

  const handleDateContainerClick = useCallback(
    (d: DateInfoType) => {
      onSelectDate(d);
    },
    [onSelectDate]
  );
  return (
    <Flex
      ml="auto"
      mr="auto"
      maxWidth="270px"
      w="100%"
      direction="column"
      alignItems="center"
      flex={flex || 'auto'}
    >
      {monthSection}
      <SimpleGrid pb="2" pt="2" w="100%" columns={7} rowGap="1.5">
        {weekdays}
        {datesForThisMonthCalendar.map((d) => (
          <DateContainer
            key={`${d.year}_${d.month}_${d.date}`}
            containerDateInfo={d}
            currentDate={selectedDate}
            sm={true}
            onClick={handleDateContainerClick}
          />
        ))}
      </SimpleGrid>
    </Flex>
  );
};
