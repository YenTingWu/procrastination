import React, {
  useState,
  useEffect,
  useReducer,
  Reducer,
  useCallback,
  createContext,
} from 'react';
import { Flex, Grid } from '@chakra-ui/react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { DroppableList, ModalController } from '@components/D&D/DroppableList';
import { DeleteButton, CreateButton } from '@components/IconButton';
import { reorderList } from './lib/reorderList';
import type { QueryClient } from 'react-query';
import { Event, EventStatus } from '@types';
import { useTodoUpdateMutation } from '@globalStore/server/useTodoMutation';
import { useTokenStore } from '@globalStore/client/useTokenStore';

interface DeleteModeContext {
  isDeleteMode: boolean;
}

export const DeleteModeContextStore = createContext<DeleteModeContext>(
  {} as DeleteModeContext
);

type DragAndDropState = {
  [EventStatus.CREATED]: Array<Event>;
  [EventStatus.WORKING]: Array<Event>;
  [EventStatus.COMPLETED]: Array<Event>;
};

type DragAndDropAction =
  | {
      type: 'switchStatus';
      payload: {
        fromId: EventStatus;
        fromIndex: number;
        toId: EventStatus;
        toIndex: number;
      };
    }
  | {
      type: 'sortList';
      payload: { sortKey: string };
    }
  | {
      type: 'reset';
      payload: Array<Event>;
    };

function getStatusList(
  status: EventStatus,
  state: DragAndDropState
): Array<Event> {
  if (status === EventStatus.CREATED) return [...state[EventStatus.CREATED]];
  if (status === EventStatus.WORKING) return [...state[EventStatus.WORKING]];
  if (status === EventStatus.COMPLETED)
    return [...state[EventStatus.COMPLETED]];
  throw new Error();
}

const dragAndDropControllerReducer: Reducer<
  DragAndDropState,
  DragAndDropAction
> = (state, action) => {
  switch (action.type) {
    case 'switchStatus':
      const { toId, toIndex, fromId, fromIndex } = action.payload;

      if (toId === fromId) {
        const newList = reorderList(
          getStatusList(toId, state),
          fromIndex,
          toIndex
        );

        return {
          ...state,
          [toId]: newList,
        };
      }
      let fromList = getStatusList(fromId, state);
      let toList = getStatusList(toId, state);
      const [removedItem] = fromList.splice(fromIndex, 1);
      toList.splice(toIndex, 0, removedItem);

      return {
        ...state,
        [fromId]: fromList,
        [toId]: toList,
      };
    case 'reset':
      const newList = action.payload;
      if (newList == null) return { ...state };

      return {
        [EventStatus.CREATED]: newList.filter(
          ({ status }) => status === EventStatus.CREATED
        ),
        [EventStatus.WORKING]: newList.filter(
          ({ status }) => status === EventStatus.WORKING
        ),
        [EventStatus.COMPLETED]: newList.filter(
          ({ status }) => status === EventStatus.COMPLETED
        ),
      };

    // TODO:
    case 'sortList':
      return {
        ...state,
      };

    default:
      throw new Error();
  }
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

interface DroppableTodoMainSectionProps {
  todoList: Array<Event>;
  queryClient: QueryClient;
  modalControllers: ModalController;
}

/**
 *
 * @param param0 {{{ todoList }}}
 * @returns JSX.Element
 */

export const DroppableTodoMainSection: React.FC<DroppableTodoMainSectionProps> = ({
  todoList,
  queryClient,
  modalControllers,
}) => {
  const [isSwitchStatus, setSwitchStatus] = useState<boolean>(false);
  const [isDeleteMode, setDeleteMode] = useState<boolean>(false);
  const {
    mutate: todoUpdateMutate,
    isError: isTodoUpdateError,
  } = useTodoUpdateMutation(queryClient);
  const token = useTokenStore((s) => s.accessToken);

  const [droppableListState, droppableListDispatch] = useReducer(
    dragAndDropControllerReducer,
    {
      [EventStatus.CREATED]: todoList.filter(
        ({ status }) => status === EventStatus.CREATED
      ),
      [EventStatus.WORKING]: todoList.filter(
        ({ status }) => status === EventStatus.WORKING
      ),
      [EventStatus.COMPLETED]: todoList.filter(
        ({ status }) => status === EventStatus.COMPLETED
      ),
    }
  );

  /**
   * If the todoList mutation is caused by switching item's status,
   * client side is not going to reset data.
   *
   * The reason is because I would like to control the UI with the reducer state
   * instead of the server data
   */

  useEffect(() => {
    if (!isSwitchStatus || isTodoUpdateError) {
      droppableListDispatch({
        type: 'reset',
        payload: todoList,
      });
    }
    setSwitchStatus(false);
  }, [todoList, isTodoUpdateError]);

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      if (!result.destination) return;

      const { droppableId: fromStatus, index: fromIndex } = result.source;
      const { droppableId: toStatus, index: toIndex } = result.destination;

      // Server Store
      const fromList = getStatusList(
        fromStatus as EventStatus,
        droppableListState
      );
      const { uuid } = fromList[fromIndex];
      let updatedStore = {
        status: toStatus as EventStatus,
      };

      try {
        await todoUpdateMutate({
          todoInfo: { uid: uuid, updatedStore },
          token,
        });
        setSwitchStatus(true);
      } catch {}

      // Client Store
      droppableListDispatch({
        type: 'switchStatus',
        payload: {
          fromId: fromStatus as EventStatus,
          toId: toStatus as EventStatus,
          toIndex,
          fromIndex,
        },
      });
    },
    [droppableListDispatch, todoUpdateMutate, droppableListState]
  );

  const toggleDeleteMode = useCallback(() => setDeleteMode((s) => !s), []);

  return (
    <DeleteModeContextStore.Provider value={{ isDeleteMode }}>
      <Flex flex="1 1 0" alignItems="center">
        <Flex
          flex="1"
          justifyContent="flex-end"
          alignSelf="stretch"
          alignItems="center"
        >
          <Flex
            h="80%"
            w="4rem"
            borderRadius="10px"
            bg="blackAlpha.800"
            flexDir="column"
            alignItems="center"
            pt="4"
            pb="4"
          >
            <CreateButton
              onClick={modalControllers.onManipulateTodoModalOpen}
              style={{ size: 'md' }}
            />
            <DeleteButton
              isDeleteMode={isDeleteMode}
              onClick={toggleDeleteMode}
              style={{ size: 'md', mt: '4' }}
            />
          </Flex>
        </Flex>
        <Flex flex="12 1 0" pl="20">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Grid templateColumns="repeat(3, 1fr)" gap={10}>
              {Object.values(EventStatus).map((id) => (
                <DroppableList
                  key={id}
                  list={droppableListState[id]}
                  droppableId={id}
                  modalControllers={modalControllers}
                />
              ))}
            </Grid>
          </DragDropContext>
        </Flex>
      </Flex>
    </DeleteModeContextStore.Provider>
  );
};

/**
 * 1. implement Delete functionality
 * 2. pending list ( duration > 0 and status === WORKING)
 * 3.
 */
