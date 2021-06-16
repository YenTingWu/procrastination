/**
 * ## getYearObject
 * @param d Date
 * @returns {{{ year: number, month: number, date: number }
 */

export function getYearObject(d: Date) {
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    date: d.getDate(),
  };
}
