import { EventStatus } from '@types';

export function getNewTimeStamp(
  timestamp: (string | Date)[],
  toStatus: EventStatus
) {
  const now = new Date();
  const length = {
    [EventStatus.CREATED]: 0,
    [EventStatus.PROCESSING]: 1,
    [EventStatus.WORKING]: 2,
    [EventStatus.COMPLETED]: 3,
  };
  let newTimestamp = [];
  for (let i = 0; i < length[toStatus]; i++) {
    const newItem =
      i !== length[toStatus] - 1 && timestamp[i] ? timestamp[i] : now;
    newTimestamp.push(newItem);
  }
  return newTimestamp;
}
