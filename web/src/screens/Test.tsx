import React, { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import memorize from 'memoize-one';
import { FixedSizeList, FixedSizeListProps, areEqual } from 'react-window/';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { useQueryClient } from 'react-query';
import { AppDefaultLayoutDesktop } from '@components/Layout/AppDefaultLayoutDesktop';
import { NavigationSideBar } from '@components/NavigationSideBar';
import { LoadingUI } from '@components/LoadingUI';
import { User } from '@types';

// const createItemDate = memorize((items,))

function returnArray(num: number) {
  return Array(1000)
    .fill(true)
    .map((_, i) => ({
      k: num * 1000 + i,
      label: Math.random().toString(36).substr(2),
    }));
}

const list = returnArray(1);
const list2 = returnArray(2);

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
};

function getStyle({ provided, style, isDragging }: any) {
  // If you don't want any spacing between your items
  // then you could just return this.
  // I do a little bit of magic to have some nice visual space
  // between the row items
  const combined = {
    ...style,
    ...provided.draggableProps.style,
  };

  //   const marginBottom = 8;
  const withSpacing = {
    ...combined,
    height: isDragging ? combined.height : combined.height,
  };
  return withSpacing;
}

const Item = ({ provided, label, style, isDragging }: any) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getStyle({ provided, style, isDragging })}
    >
      <h4>{label}</h4>
    </div>
  );
};

const Row = React.memo(({ data, index, style }: any) => {
  const label = data[index].label;
  const k = data[index].k;

  return (
    <Draggable
      key={`${label}_${index}`}
      draggableId={`${label}_${index}`}
      index={index}
    >
      {(provided, snapshot) => (
        <Item label={k} style={style} provided={provided} />
      )}
    </Draggable>
  );
}, areEqual);

export function Test() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>('currentUser');
  const [data, setData] = useState(list);
  const [data2, setData2] = useState(list2);

  if (!user) {
    return <LoadingUI />;
  }

  const { avatar, displayName } = user;
  const handleDragEnd = (result: DropResult) => {
    console.log(result);
    if (!result.destination) return;

    const { droppableId: fromId, index: fromIndex } = result.source;
    const { droppableId: toId, index: toIndex } = result.destination;

    if (fromId === toId) {
      const [state, set] =
        fromId === 'droppable-1'
          ? [[...data], setData]
          : [[...data2], setData2];

      const [removedItem] = state.splice(fromIndex, 1);
      state.splice(toIndex, 0, removedItem);

      set(state);
      return;
    } else {
      let fromArr: Array<any>;
      let toArr: Array<any>;

      if (fromId === 'droppable-1') {
        fromArr = [[...data], setData];
        toArr = [[...data2], setData2];
      } else {
        fromArr = [[...data2], setData2];
        toArr = [[...data], setData];
      }

      const [fromState, setFrom] = fromArr;
      const [toState, setTo] = toArr;

      const [removedItem] = fromState.splice(fromIndex, 1);
      toState.splice(toIndex, 0, removedItem);

      setFrom(fromState);
      setTo(toState);
    }
  };

  return (
    <AppDefaultLayoutDesktop>
      <NavigationSideBar avatar={avatar || ''} placeholder={displayName} />
      Test Page
      <DragDropContext onDragEnd={handleDragEnd}>
        <Flex flex="1">
          <Flex border="1px solid black" flex="1">
            <Droppable
              droppableId="droppable-1"
              type="PERSON"
              mode="virtual"
              renderClone={(provided, snapshot, rubric) => (
                <Flex
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  bg="gray.300"
                >
                  <h4>{data[rubric.source.index].k}</h4>
                </Flex>
              )}
            >
              {(provided, snapshot) => (
                <FixedSizeList
                  height={500}
                  width={300}
                  itemCount={data.length}
                  itemData={data}
                  itemSize={35}
                  outerRef={provided.innerRef}
                >
                  {Row}
                </FixedSizeList>
              )}
            </Droppable>
          </Flex>
          <Droppable
            droppableId="droppable-2"
            type="PERSON"
            mode="virtual"
            renderClone={(provided, snapshot, rubric) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <h4>{data2[rubric.source.index].k}</h4>
              </div>
            )}
          >
            {(provided, snapshot) => (
              <FixedSizeList
                height={500}
                width={300}
                itemCount={data2.length}
                itemData={data2}
                itemSize={35}
                outerRef={provided.innerRef}
              >
                {Row}
              </FixedSizeList>
            )}
          </Droppable>
        </Flex>
      </DragDropContext>
    </AppDefaultLayoutDesktop>
  );
}
