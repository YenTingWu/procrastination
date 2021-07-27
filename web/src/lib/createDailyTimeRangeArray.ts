/**
 * Create a timestamp for every 15 mins
 * @returns string[]
 */

export function createDailyTimeRangeArray() {
  let arr: string[] = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minStep = 0; minStep < 4; minStep++) {
      let min = minStep * 15;
      arr.push(
        `${hour >= 10 ? `${hour}` : `0${hour}`}:${
          min >= 10 ? `${min}` : `0${min}`
        }`
      );
    }
  }
  return arr;
}
