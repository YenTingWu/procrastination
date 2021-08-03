import React, { useMemo, useContext, useEffect } from 'react';
import { Flex, Heading, Text, Box } from '@chakra-ui/layout';
import { DeleteIcon } from '@chakra-ui/icons';
import { DraggableProvided } from 'react-beautiful-dnd';
import { Event, EventStatus } from '@types';
import { ModeContextStore } from '@components/D&D/DroppableTodoMainSection';
import { getTimeObject } from '@hooks/useTimeCounter';
import { replaceSecWithFormattedHoursAndMins } from './lib/replaceSecWithFormattedHoursAndMins';
import { getCombinedStyle } from './lib/getCombinedStyle';
import { getTwoDigit } from './lib/getTwoDigit';

export type ModalController = {
  onManipulateTodoModalOpen: (uuid?: string) => void;
  onDeleteConfirmModalOpen: (id: string) => void;
};

interface VirtualListItemProps {
  provided: DraggableProvided;
  todo: Event;
  style: React.CSSProperties;
  isDragging: boolean;
  modalControllers: ModalController;
  onCountSecond: (uuid: string) => void;
}

/**
 * ## Item
 * @param props {{{ provided, name, style, isDragging }
 * @returns JSX.Element
 */

export const DroppableVirtualizedListItem = ({
  provided,
  style,
  todo: { expectedDuration, name, description, uuid, status, duration },
  isDragging,
  modalControllers: { onDeleteConfirmModalOpen, onManipulateTodoModalOpen },
  onCountSecond,
}: VirtualListItemProps) => {
  const { screenMode } = useContext(ModeContextStore);
  const time = getTimeObject(duration);
  const isWorkingStatus = useMemo(() => status === EventStatus.WORKING, [
    status,
  ]);

  const formattedExpectedDuration = useMemo(
    () => replaceSecWithFormattedHoursAndMins(expectedDuration),
    [expectedDuration]
  );

  const handleConfirmModalOpen = (e: React.MouseEvent<HTMLOrSVGElement>) => {
    e.preventDefault();
    onDeleteConfirmModalOpen(uuid);
  };

  const handleManipulateTodoModalOpen = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    onManipulateTodoModalOpen(uuid);
  };

  useEffect(() => {
    if (isWorkingStatus) {
      const timer = setInterval(() => onCountSecond(uuid), 1000);
      return () => clearInterval(timer);
    }
  }, []);

  return (
    <Flex
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getCombinedStyle({ provided, style, isDragging })}
      _hover={{
        cursor: 'pointer',
      }}
      onClick={
        screenMode === 'delete' ? () => {} : handleManipulateTodoModalOpen
      }
    >
      <Box
        flex="8 1 0"
        sx={{
          '*::selection': {
            bg: 'none',
          },
        }}
      >
        <Flex>
          <Heading as="h6" noOfLines={1} fontSize="sm">
            {name}
          </Heading>
        </Flex>
        <Flex mt=".1rem">
          <Text lineHeight="1.225" fontSize="x-small" color="blue.400">
            {formattedExpectedDuration}
          </Text>
          <Text
            lineHeight="1.225"
            ml={2}
            fontSize="x-small"
            fontWeight={isWorkingStatus ? 'extrabold' : 'base'}
            color={isWorkingStatus ? 'white' : 'purple.400'}
            bg={isWorkingStatus ? 'gray.500' : 'white'}
            pl={isWorkingStatus ? 1 : 0}
            pr={isWorkingStatus ? 1 : 0}
          >
            {`${getTwoDigit(time.hours)}:${getTwoDigit(
              time.mins
            )}:${getTwoDigit(time.secs)}`}
          </Text>
        </Flex>
        <Text
          mt=".1rem"
          color="gray.500"
          lineHeight="1.225"
          noOfLines={[1, 1, 1, 1, 2]}
          fontSize="x-small"
        >
          {description}
        </Text>
      </Box>
      {screenMode === 'delete' && (
        <Flex
          flex="1 0 0"
          maxW="10%"
          justifyContent="center"
          alignItems="center"
          _hover={{
            cursor: 'pointer',
          }}
        >
          <DeleteIcon color="red.500" onClick={handleConfirmModalOpen} />
        </Flex>
      )}
    </Flex>
  );
};
