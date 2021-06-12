import React from 'react';
import format from 'date-fns/fp/format';
import {
  Box,
  Flex,
  Heading,
  VStack,
  Text,
  BackgroundProps,
} from '@chakra-ui/react';
import { Schedule } from '@types';

interface StackItemProps {
  title: string;
  percentage: number;
  onClick: () => void;
  startTime: Date;
  bg?: BackgroundProps['bg'];
}

const StackItem: React.FC<StackItemProps> = ({
  percentage,
  onClick,
  startTime,
  title,
  bg,
}) => {
  return (
    <Flex
      flex={percentage}
      w="100%"
      h="40px"
      bg={bg || 'gray.100'}
      position="relative"
      justifyContent="center"
      alignItems="center"
      onClick={onClick}
      _hover={{
        cursor: 'pointer',
      }}
    >
      <Box position="absolute" left={'-3.5rem'} top={-3}>
        <Text fontSize="md" fontWeight="extrabold">
          {format('HH:mm', startTime)}
        </Text>
      </Box>
      <Text fontSize="md" fontWeight="extrabold">
        {title}
      </Text>
    </Flex>
  );
};

interface DailyScheduleShowcaseProps {
  schedules: Schedule[];
  onSelectEvent: (id: string) => void;
}

/**
 * ## DailyScheduleShowcase
 * @param {{{ schedules, onSelectEvent }
 * @returns React.FC
 */

export const DailyScheduleShowcase: React.FC<DailyScheduleShowcaseProps> = ({
  schedules,
  onSelectEvent,
}) => {
  return (
    <Flex flex="1 1 0" justifyContent="center" alignItems="center">
      <Flex
        minH="85%"
        minW="50%"
        borderRadius="4"
        p="1.5rem 2rem"
        flexDir="column"
        alignItems="center"
        boxShadow="1px 1px 5px 3px rgba(100, 100, 100, .25)"
      >
        <Heading fontSize="5xl" letterSpacing=".25rem">
          Today Schedule
        </Heading>
        <VStack mt="8" position="relative" w="80%" minH="60vh" spacing="0">
          {schedules.map(
            ({ name, isFree, expectedDuration, startTime, uuid }) => {
              const percentage = expectedDuration / (24 * 60 * 60);

              const handleClick = uuid
                ? () => onSelectEvent(uuid)
                : // TODO:
                  console.log;
              if (isFree) {
                return (
                  <StackItem
                    key={startTime.getTime()}
                    startTime={startTime}
                    percentage={percentage}
                    onClick={handleClick}
                    title="free"
                    bg="gray.100"
                  />
                );
              }
              return (
                <StackItem
                  key={startTime.getTime()}
                  startTime={startTime}
                  percentage={percentage}
                  onClick={handleClick}
                  title={name || ''}
                  bg="red.200"
                />
              );
            }
          )}
          <Box position="absolute" left={'-3.5rem'} bottom={-3}>
            <Text fontSize="md" fontWeight="extrabold">
              24:00
            </Text>
          </Box>
        </VStack>
      </Flex>
    </Flex>
  );
};
