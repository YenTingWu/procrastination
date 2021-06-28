import React, { useMemo, useContext } from 'react';
import { Flex, Heading, Text, Box } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { FixedSizeList, areEqual } from 'react-window';
import { Droppable, Draggable, DraggableProvided } from 'react-beautiful-dnd';
import hoursToSeconds from 'date-fns/fp/hoursToSeconds';
import { Event } from '@types';
import { getCombinedStyle } from './lib/getCombinedStyle';
import ListStyle from './DroppableList.style.module.css';
import { DeleteModeContextStore } from './DroppableTodoMainSection';
import memorize from 'memoize-one';

export type ModalController = {
  onManipulateTodoModalOpen: (uuid?: string) => void;
  onConfirmModalOpen: (id: string) => void;
};

/**
 * ## formatSecond
 * @param sec
 * @returns string
 */

function formatSecond(sec: number) {
  const secondsForAnHour = hoursToSeconds(1);
  const isInt = (n: number) => n % 1 === 0;

  if (sec >= secondsForAnHour) {
    const hours = sec / secondsForAnHour;
    return isInt(hours) ? `${hours} hrs` : `${hours.toFixed(2)} hrs`;
  }
  return `${secondsForAnHour / 60} mins`;
}

interface VirtualListItemProps {
  provided: DraggableProvided;
  info: {
    name: string;
    description: string;
    expectedDuration: number;
    uuid: string;
  };
  style: React.CSSProperties;
  isDragging: boolean;
  modalControllers: ModalController;
}

/**
 * ## Item
 * @param props {{{ provided, name, style, isDragging }
 * @returns JSX.Element
 */

const VirtualListItem = ({
  provided,
  style,
  info: { name, description, expectedDuration, uuid },
  isDragging,
  modalControllers: { onConfirmModalOpen, onManipulateTodoModalOpen },
}: VirtualListItemProps) => {
  const { isDeleteMode } = useContext(DeleteModeContextStore);
  const formattedExpectedDuration = useMemo(
    () => formatSecond(expectedDuration),
    [expectedDuration]
  );

  const handleConfirmModalOpen = (e: React.MouseEvent<HTMLOrSVGElement>) => {
    e.preventDefault();
    onConfirmModalOpen(uuid);
  };

  const handleManipulateTodoModalOpen = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    onManipulateTodoModalOpen(uuid);
  };

  return (
    <Flex
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getCombinedStyle({ provided, style, isDragging })}
      _hover={{
        cursor: 'pointer',
      }}
      onClick={isDeleteMode ? () => {} : handleManipulateTodoModalOpen}
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
        </Flex>
        <Text
          mt=".1rem"
          color="gray.500"
          lineHeight="1.225"
          noOfLines={[1, 2]}
          fontSize="x-small"
        >
          {description}
        </Text>
      </Box>
      {isDeleteMode && (
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

type DataType = {
  list: Event[];
  modalControllers: ModalController;
};

interface VirtualListRowProps {
  data: DataType;
  index: number;
  style: React.CSSProperties;
}

/**
 * ## VirtualListRow
 * This component is a listItem with a draggable shield outside
 * @param props {{{ data, index, style }}}
 * @return JSX.Element
 */

const VirtualListRow = React.memo(
  ({ data: { list, modalControllers }, index, style }: VirtualListRowProps) => {
    const { name, description, expectedDuration, uuid } = list[index];

    return (
      <Draggable
        key={`${name}_${index}`}
        draggableId={`${name}_${index}`}
        index={index}
      >
        {(provided, snapshot) => (
          <VirtualListItem
            info={{
              name,
              description,
              expectedDuration,
              uuid,
            }}
            style={style}
            provided={provided}
            isDragging={snapshot.isDragging}
            modalControllers={modalControllers}
          />
        )}
      </Draggable>
    );
  },
  areEqual
);

/*
 #     #                     #####
 ##   ##   ##   # #    #    #     #  ####  #    # #####   ####  #    # ###### #    # #####
 # # # #  #  #  # ##   #    #       #    # ##  ## #    # #    # ##   # #      ##   #   #
 #  #  # #    # # # #  #    #       #    # # ## # #    # #    # # #  # #####  # #  #   #
 #     # ###### # #  # #    #       #    # #    # #####  #    # #  # # #      #  # #   #
 #     # #    # # #   ##    #     # #    # #    # #      #    # #   ## #      #   ##   #
 #     # #    # # #    #     #####   ####  #    # #       ####  #    # ###### #    #   #
*/

// This helper function memoizes incoming props,
// To avoid causing unnecessary re-renders pure Row components.

const createItemData = memorize(
  (list: Array<Event>, modalControllers: ModalController) => ({
    list,
    modalControllers,
  })
);

interface DroppableListProps {
  droppableId: string;
  list: Array<Event>;
  modalControllers: ModalController;
}

/**
 * ## DroppableList
 * @param props {{{ droppableId, data }}}
 * @returns JSX.Element
 */

export const DroppableList: React.FC<DroppableListProps> = ({
  droppableId,
  list,
  modalControllers,
}) => {
  const itemData = createItemData(list, modalControllers);

  return (
    <Droppable
      droppableId={droppableId}
      type="PERSON"
      mode="virtual"
      renderClone={(provided, _snapshot, rubric) => {
        const { name, description, expectedDuration } = list[
          rubric.source.index
        ];
        const formattedExpectedDuration = useMemo(
          () => formatSecond(expectedDuration),
          [expectedDuration]
        );
        return (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            bg="gray.100"
            borderWidth="3px"
            borderColor="purple.500"
            borderRadius={2}
            padding="2px 5px"
          >
            <Flex>
              <Heading as="h6" fontSize="sm" noOfLines={1}>
                {name}
              </Heading>
            </Flex>
            <Flex mt=".1rem">
              <Text lineHeight="1.225" fontSize="x-small" color="blue.500">
                {formattedExpectedDuration}
              </Text>
            </Flex>
            <Text
              mt=".1rem"
              color="gray.500"
              lineHeight="1.225"
              noOfLines={[1, 2]}
              fontSize="x-small"
            >
              {description}
            </Text>
          </Box>
        );
      }}
    >
      {(provided, snapshot) => (
        <Flex
          flexDir="column"
          alignItems="center"
          padding=".75rem"
          borderRadius="4"
          boxShadow="1px 1px 5px 3px rgba(100, 100, 100, .4)"
        >
          <Heading
            as="h2"
            _hover={{ cursor: 'default' }}
            _selection={{ bg: 'none' }}
            letterSpacing=".3rem"
          >
            {droppableId}
          </Heading>
          <Flex
            borderRadius={4}
            mt="5"
            p="4px 2px"
            bg={snapshot.isDraggingOver ? 'purple.50' : 'white'}
          >
            <FixedSizeList
              height={400}
              width={300}
              className={ListStyle['task-left']}
              itemCount={list.length}
              itemData={itemData}
              itemSize={80}
              outerRef={provided.innerRef}
            >
              {VirtualListRow}
            </FixedSizeList>
          </Flex>
        </Flex>
      )}
    </Droppable>
  );
};
