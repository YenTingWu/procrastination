import hoursToSeconds from 'date-fns/fp/hoursToSeconds';

/**
 * ## formatSecond
 * @param sec
 * @returns string
 */

export function replaceSecWithFormattedHoursAndMins(sec: number) {
  const secondsForAnHour = hoursToSeconds(1);
  const isInt = (n: number) => n % 1 === 0;

  if (sec >= secondsForAnHour) {
    const hours = sec / secondsForAnHour;
    return isInt(hours) ? `${hours} hrs` : `${hours.toFixed(2)} hrs`;
  }
  return `${secondsForAnHour / 60} mins`;
}
