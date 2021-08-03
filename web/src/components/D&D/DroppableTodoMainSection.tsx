import React, {
  useState,
  useEffect,
  useReducer,
  Reducer,
  useCallback,
  createContext,
} from 'react';
import { Flex, Grid } from '@chakra-ui/layout';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { DroppableList, ModalController } from '@components/D&D/DroppableList';
import { DeleteButton, CreateButton } from '@components/IconButton';
import { reorderList } from './lib/reorderList';
import { getNewTimeStamp } from './lib/getNewTimestamp';
import type { QueryClient } from 'react-query';
import { Event, EventStatus } from '@types';
import {
  useTodoModifyMutation,
  useTodoUpdateMutation,
} from '@globalStore/server/useTodoMutation';
import { useTypeSafeBreakpointValue } from '@hooks/useTypeSafeBreakpointValue';
import { useTokenStore } from '@globalStore/client/useTokenStore';

type ScreenMode = 'delete' | 'duplicate' | 'base';
interface ModeContext {
  screenMode: ScreenMode;
}

export const ModeContextStore = createContext<ModeContext>({} as ModeContext);

type UpdatableField = {
  name: string;
  description: string;
  expectedDuration: number;
  duration: number;
  status: EventStatus;
  timestamp: (Date | string)[];
};

type DragAndDropState = {
  [EventStatus.CREATED]: Array<Event>;
  [EventStatus.PROCESSING]: Array<Event>;
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
    }
  | {
      type: 'setTargetList';
      payload: Partial<DragAndDropState>;
    }
  | {
      type: 'addSecondToWorkingTodo';
      payload: string;
    };

function getInitialList(status: EventStatus, todoList: Array<Event>) {
  return todoList.filter((todo) => todo.status === status);
}

function getStatusList(
  status: EventStatus,
  state: DragAndDropState
): Array<Event> {
  if (status === EventStatus.CREATED) return [...state[EventStatus.CREATED]];
  if (status === EventStatus.PROCESSING)
    return [...state[EventStatus.PROCESSING]];
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
      let [removedItem] = fromList.splice(fromIndex, 1);
      removedItem.timestamp = getNewTimeStamp(removedItem.timestamp, toId);
      removedItem.status = toId;
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
        [EventStatus.CREATED]: getInitialList(EventStatus.CREATED, newList),
        [EventStatus.PROCESSING]: getInitialList(
          EventStatus.PROCESSING,
          newList
        ),
        [EventStatus.WORKING]: getInitialList(EventStatus.WORKING, newList),
        [EventStatus.COMPLETED]: getInitialList(EventStatus.COMPLETED, newList),
      };

    case 'setTargetList':
      const isInStatusEnum = Object.keys(action.payload).some(
        (status) => status in [EventStatus]
      );
      if (!isInStatusEnum) throw new Error();

      return {
        ...state,
        ...action.payload,
      };
    case 'addSecondToWorkingTodo':
      const workingList = getStatusList(EventStatus.WORKING, state);
      const list = workingList.map((todo) => {
        if (todo.uuid === action.payload) {
          return {
            ...todo,
            duration: todo.duration + 1,
          };
        }
        return todo;
      });

      return {
        ...state,
        [EventStatus.WORKING]: list,
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
  calendarUid: string;
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
  calendarUid,
}) => {
  const [isSwitchingStatus, setSwitchingStatus] = useState<boolean>(false);
  const [screenMode, setScreenMode] = useState<ScreenMode>('base');
  const {
    mutate: todoModifyMutate,
    isError: isTodoModifyError,
  } = useTodoModifyMutation(queryClient);
  const { mutate: todoUpdateMutate } = useTodoUpdateMutation(queryClient);
  const token = useTokenStore((s) => s.accessToken);

  // Media Query
  const containerPaddingLeft = useTypeSafeBreakpointValue({
    default: '10',
    xl: '20',
  });
  const gridGap = useTypeSafeBreakpointValue({
    default: 5,
    lg: 7,
    xl: 10,
  });

  const [droppableListState, droppableListDispatch] = useReducer(
    dragAndDropControllerReducer,
    {
      [EventStatus.CREATED]: getInitialList(EventStatus.CREATED, todoList),
      [EventStatus.PROCESSING]: getInitialList(
        EventStatus.PROCESSING,
        todoList
      ),
      [EventStatus.WORKING]: getInitialList(EventStatus.WORKING, todoList),
      [EventStatus.COMPLETED]: getInitialList(EventStatus.COMPLETED, todoList),
    }
  );

  async function updateTodo() {
    const updatedTodoList = Object.keys(EventStatus).reduce((acc, cur) => {
      return acc.concat(droppableListState[cur as EventStatus]);
    }, [] as Array<Event>);

    await todoUpdateMutate({
      data: { calendarUid, updatedTodoList },
      token,
    });
  }

  const toggleDeleteMode = useCallback(() => {
    setScreenMode((mode) => {
      if (mode === 'delete') return 'base';
      return 'delete';
    });
  }, []);

  const handleCountSecond = useCallback(
    (uuid: string) =>
      droppableListDispatch({ type: 'addSecondToWorkingTodo', payload: uuid }),
    []
  );

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
      const { uuid, duration, timestamp } = fromList[fromIndex];

      //const timestamp

      let updatedStore: Partial<UpdatableField> = {
        status: toStatus as EventStatus,
        timestamp: getNewTimeStamp(timestamp, toStatus as EventStatus),
      };

      if (fromStatus === EventStatus.WORKING) {
        updatedStore.duration = duration;
      }

      try {
        await todoModifyMutate({
          todoInfo: { uid: uuid, updatedStore },
          token,
        });
        setSwitchingStatus(true);
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
    [droppableListDispatch, todoModifyMutate, droppableListState]
  );

  /**
   * If the todoList mutation is caused by switching item's status,
   * client side is not going to reset data.
   *
   * The reason is because I would like to control the UI with the reducer state
   * instead of the server data
   */

  useEffect(() => {
    if (!isSwitchingStatus || isTodoModifyError) {
      droppableListDispatch({
        type: 'reset',
        payload: todoList,
      });
    }
    setSwitchingStatus(false);
  }, [todoList, isTodoModifyError]);

  useEffect(() => {
    window.onbeforeunload = confirmExit;

    async function confirmExit() {
      await updateTodo();
      return 'confirmExit';
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, [droppableListState]);

  return (
    <ModeContextStore.Provider value={{ screenMode }}>
      <Flex flex="1 0 0" maxW="calc(100% - 3.5rem)" alignItems="center">
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
              isDeleteMode={screenMode === 'delete'}
              onClick={toggleDeleteMode}
              style={{ size: 'md', mt: '4' }}
            />
          </Flex>
        </Flex>
        <Flex
          flex="12 1 0"
          overflowX="scroll"
          pt="10"
          pb="10"
          pl={containerPaddingLeft}
          pr="10"
        >
          <DragDropContext onDragEnd={handleDragEnd}>
            <Grid templateColumns="repeat(4, 1fr)" gap={gridGap}>
              {Object.values(EventStatus).map((id) => (
                <DroppableList
                  key={id}
                  list={droppableListState[id]}
                  droppableId={id}
                  onCountSecond={handleCountSecond}
                  modalControllers={modalControllers}
                />
              ))}
            </Grid>
          </DragDropContext>
        </Flex>
      </Flex>
    </ModeContextStore.Provider>
  );
};
