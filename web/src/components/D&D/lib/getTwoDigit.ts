export function getTwoDigit(num: number) {
  return num >= 10 ? `${num}` : `0${num}`;
}
