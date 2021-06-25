import { Event } from '@types';

export function reorderList(
  list: Array<Event>,
  fromIndex: number,
  toIndex: number
) {
  const [removedItem] = list.splice(fromIndex, 1);
  list.splice(toIndex, 0, removedItem);
  return list;
}
