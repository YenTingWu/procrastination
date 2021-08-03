import React, { useState, useCallback, useEffect } from 'react';
import format from 'date-fns/fp/format';
import { BackgroundProps } from '@chakra-ui/react';
import { Fade } from '@chakra-ui/transition';
import { Box, Flex, Heading, VStack, Text } from '@chakra-ui/layout';
import { DeleteIcon } from '@chakra-ui/icons';
import { useTypeSafeBreakpointValue } from '@hooks/useTypeSafeBreakpointValue';
import { Schedule } from '@types';
import { DeleteButton } from '@components/IconButton';

interface StackItemProps {
  title: string;
  percentage: number;
  startTime: Date;
  isDeleteMode: boolean;
  onClick: () => void;
  onDeleteButtonClick: () => void;
  bg?: BackgroundProps['bg'];
}

const StackItem: React.FC<StackItemProps> = ({
  percentage,
  onClick,
  startTime,
  title,
  isDeleteMode,
  bg,
  onDeleteButtonClick,
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
      onClick={isDeleteMode ? () => {} : onClick}
      _hover={{
        cursor: isDeleteMode ? 'default' : 'pointer',
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
      {isDeleteMode && title !== 'free' && (
        <Flex
          position="absolute"
          right="2"
          _hover={{ cursor: 'pointer' }}
          onClick={onDeleteButtonClick}
        >
          <Fade in={isDeleteMode}>
            <DeleteIcon color="gray.500" />
          </Fade>
        </Flex>
      )}
    </Flex>
  );
};

/*
  #     #                     #####
  ##   ##   ##   # #    #    #     #  ####  #    # #####   ####  #    # ###### #    # #####
  # # # #  #  #  # ##   #    #       #    # ##  ## #    # #    # ##   # #      ##   #   #
  #  #  # #    # # # #  #    #       #    # # ## # #    # #    # # #  # #####  # #  #   #
  #     # ###### # #  # #    #       #    # #    # #####  #    # #  # # #      #  # #   #
  #     # #    # # #   ##    #     # #    # #    # #      #    # #   ## #      #   ##   #
  #     # #    # # #    #     #####   ####  #    # #       ####  #    # ###### #    #   #
*/

interface DailyScheduleShowcaseProps {
  schedules: Schedule[];
  onSelectEvent: (value: string | null) => void;
  onDeleteButtonClick: (uuid?: string) => void;
}

/**
 * ## DailyScheduleShowcase
 * @param {{{ schedules, onSelectEvent }}}
 * @returns React.FC
 */

export const DailyScheduleShowcase: React.FC<DailyScheduleShowcaseProps> = ({
  schedules,
  onSelectEvent,
  onDeleteButtonClick,
}) => {
  const [isDeleteMode, setDeleteMode] = useState<boolean>(false);
  const titleFontSize = useTypeSafeBreakpointValue({
    default: '2xl',
    lg: '4xl',
    xl: '5xl',
  });

  const toggleDeleteMode = useCallback(() => setDeleteMode((s) => !s), []);

  useEffect(() => {
    if (schedules.length) {
      setDeleteMode(false);
    }
  }, [schedules.length]);

  return (
    <Flex flex="1 1 0" justifyContent="center" alignItems="center">
      <Flex
        minH="85%"
        minW="50%"
        borderRadius="4"
        p="1.5rem 2rem"
        flexDir="column"
        alignItems="center"
        position="relative"
        boxShadow="1px 1px 5px 3px rgba(100, 100, 100, .25)"
      >
        <Flex>
          <Heading fontSize={titleFontSize} letterSpacing=".25rem">
            Today Schedule
          </Heading>
          <DeleteButton
            isDeleteMode={isDeleteMode}
            onClick={toggleDeleteMode}
            style={{
              position: 'absolute',
              right: '10',
              transform: `translateY(40%)`,
            }}
          />
        </Flex>
        <VStack
          mt="8"
          position="relative"
          w="80%"
          minH="60vh"
          borderRadius="10px"
          spacing="0"
        >
          {schedules.map(
            ({ name, isFree, expectedDuration, startTime, uuid }) => {
              const percentage = expectedDuration / (24 * 60 * 60);

              if (isFree || !uuid) {
                return (
                  <StackItem
                    key={startTime.getTime()}
                    startTime={startTime}
                    percentage={percentage}
                    onClick={() => onSelectEvent(null)}
                    title="free"
                    bg="gray.100"
                    isDeleteMode={isDeleteMode}
                    onDeleteButtonClick={() => {}}
                  />
                );
              }
              return (
                <StackItem
                  key={startTime.getTime()}
                  startTime={startTime}
                  percentage={percentage}
                  onClick={() => onSelectEvent(uuid)}
                  title={name || ''}
                  bg="red.200"
                  isDeleteMode={isDeleteMode}
                  onDeleteButtonClick={() => onDeleteButtonClick(uuid)}
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
