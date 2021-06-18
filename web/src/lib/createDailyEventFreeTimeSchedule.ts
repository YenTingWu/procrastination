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
  const end = endOfDay(n);

  do {
    // If the startTime is over today, then break the loop
    if (compareAsc(start, end) === 1) break;

    const event = events[i];

    // If no event exist anymore, push an empty item and break the loop
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

    /**
     * If the event's startTime is equal to startOfDay,
     *  push the event into schedules directly.
     *  No need to push any other empty event
     */

    if (compareAsc(start, currentEventStartTime) === 0) {
      schedules.push(event);
      start = currentEventEndTime;

      i++;
      continue;
    }

    /**
     * If the startOfDay is small than event startTime,
     * which means that the duration of the event cross at least two days.
     *
     * In this case, change the event startTime to startOfDay,
     * meanwhile modify the expectedDuration.
     */

    if (compareAsc(start, currentEventStartTime) === 1) {
      event.startTime = start;
      event.expectedDuration = differenceInSeconds(currentEventEndTime, start);
      schedules.push(event);
      start = currentEventEndTime;

      i++;
      continue;
    }

    /**
     * Use empty event to occupy the time which has no event
     */

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
  } while (i <= events.length);

  return schedules;
}
