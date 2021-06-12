export function createDailyTimeRangeArray() {
  let arr: string[] = [];

  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 4; j++) {
      let min = j * 15;
      arr.push(
        `${i >= 10 ? `${i}` : `0${i}`}:${min >= 10 ? `${min}` : `0${min}`}`
      );
    }
  }
  return arr;
}
