import compareAsc from 'date-fns/compareAsc';
import startOfDay from 'date-fns/fp/startOfDay';
import endOfDay from 'date-fns/fp/endOfDay';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import { Schedule } from '@types';

type event = {
  startTime: Date;
  endTime: Date;
  isFree: boolean;
  name: string;
  duration: number;
  expectedDuration: number;
  description: string;
  isProcrastination: boolean;
};

/**
 * ## createDailyEventFreeTimeSchedules
 * create a schedule with free period times and events in the target day
 * @param events
 * @param date It's an optional param, you can either pass the target date or just use the default value, which is today
 * @returns schedule[]
 */

// 0 -------- 8             16 --- 20     22 --- 24
//            8 ----------- 16     20 --- 22

export function createDailyEventFreeTimeSchedules(
  events: event[],
  date?: Date
) {
  let i = 0;
  let schedules: Schedule[] = [];
  const n = date || Date.now();
  let start = startOfDay(n);
  let end = endOfDay(n);

  do {
    const event = events[i];

    if (event == null) {
      const occupationForEmptyTime = {
        startTime: start,
        endTime: end,
        isFree: true,
        expectedDuration: differenceInSeconds(end, start),
      };
      schedules.push(occupationForEmptyTime);
      break;
    }

    const {
      startTime: currentEventStartTime,
      endTime: currentEventEndTime,
    } = event;

    if (compareAsc(start, currentEventStartTime) === 0) {
      schedules.push(event);
      start = currentEventEndTime;

      i++;
      continue;
    }

    const occupationForEmptyTime = {
      startTime: start,
      endTime: currentEventStartTime,
      isFree: true,
      expectedDuration: differenceInSeconds(currentEventStartTime, start),
    };

    schedules.push(occupationForEmptyTime);
    schedules.push(event);

    start = currentEventEndTime;

    i++;
  } while (i >= events.length);

  return schedules;
}
