import React from 'react';
import { Flex } from '@chakra-ui/react';
import { DateInfoType, MonthlyCalendarDateInfoType } from '@types';

interface DateContainerProps {
  containerDateInfo: MonthlyCalendarDateInfoType;
  currentDate: DateInfoType;
  onClick: (d: DateInfoType) => void;
  sm?: boolean;
}

/**
 * ## DateContainer
 * @param - {containerDateInfo, currentDate}
 * @returns React.FC
 */

export const DateContainer: React.FC<DateContainerProps> = ({
  containerDateInfo,
  currentDate,
  onClick,
  sm,
}) => {
  const { year, month, date, isCurrentMonth } = containerDateInfo;

  const selected =
    year === currentDate.year &&
    month === currentDate.month &&
    date === currentDate.date;

  const handleClick = () => onClick({ year, month, date } as DateInfoType);

  return (
    <Flex
      as="span"
      justifyContent="center"
      alignItems="center"
      borderRadius="2"
      color={isCurrentMonth ? (selected ? 'white' : '#333333') : '#bbbbbb'}
      bg={isCurrentMonth && selected ? 'red.400' : 'white'}
      _hover={{
        cursor: 'pointer',
        background: selected ? 'inherent' : 'gray.200',
      }}
      _selection={{
        background: 'none',
      }}
      onClick={handleClick}
    >
      <Flex
        fontSize="12px"
        h={sm ? '10px' : 'auto'}
        w={sm ? '10px' : 'auto'}
        mt={sm ? '1' : 'auto'}
        mb={sm ? '1' : 'auto'}
        fontWeight="light"
        justifyContent="center"
        alignItems="center"
      >
        {containerDateInfo.date}
      </Flex>
    </Flex>
  );
};
