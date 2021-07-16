import differenceInCalendarDays from 'date-fns/fp/differenceInCalendarDays';
import { DomainType } from '../index';

export function getIndices(domain: DomainType): [number, number] {
  const [min, max] = domain;

  if (typeof min === 'number' && typeof max === 'number') return [min, max];
  if (min instanceof Date && max instanceof Date)
    return [0, differenceInCalendarDays(min)(max)];

  throw new Error('inappropriate type');
}
