import { DomainType } from '../index';
import differenceInCalendarDays from 'date-fns/fp/differenceInCalendarDays';
import startOfDay from 'date-fns/fp/startOfDay';
import addDays from 'date-fns/fp/addDays';

export function getValues(domain: DomainType, step: number = 1) {
  const [min, max] = domain;

  if (typeof min === 'number' && typeof max === 'number') {
    let rangeArray: number[] = [];
    for (let i = min; i < max + 1; i += step) rangeArray.push(i);
    return rangeArray;
  }

  if (min instanceof Date && max instanceof Date) {
    const days = differenceInCalendarDays(min)(max);
    let rangeArray: Date[] = [];
    for (let i = 0; i < days + 1; i++) {
      rangeArray.push(startOfDay(addDays(i)(min)));
    }
    return rangeArray;
  }

  throw new Error('inappropriate type');
}
