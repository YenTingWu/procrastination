import { getThisMonthDateInfo } from '../getThisMonthDateInfo';

const july2021DateInfo = [
  { year: 2021, month: 5, date: 27 },
  { year: 2021, month: 5, date: 28 },
  { year: 2021, month: 5, date: 29 },
  { year: 2021, month: 5, date: 30 },
  { year: 2021, month: 6, date: 1, isCurrentMonth: true },
  { year: 2021, month: 6, date: 2, isCurrentMonth: true },
  { year: 2021, month: 6, date: 3, isCurrentMonth: true },
  { year: 2021, month: 6, date: 4, isCurrentMonth: true },
  { year: 2021, month: 6, date: 5, isCurrentMonth: true },
  { year: 2021, month: 6, date: 6, isCurrentMonth: true },
  { year: 2021, month: 6, date: 7, isCurrentMonth: true },
  { year: 2021, month: 6, date: 8, isCurrentMonth: true },
  { year: 2021, month: 6, date: 9, isCurrentMonth: true },
  { year: 2021, month: 6, date: 10, isCurrentMonth: true },
  { year: 2021, month: 6, date: 11, isCurrentMonth: true },
  { year: 2021, month: 6, date: 12, isCurrentMonth: true },
  { year: 2021, month: 6, date: 13, isCurrentMonth: true },
  { year: 2021, month: 6, date: 14, isCurrentMonth: true },
  { year: 2021, month: 6, date: 15, isCurrentMonth: true },
  { year: 2021, month: 6, date: 16, isCurrentMonth: true },
  { year: 2021, month: 6, date: 17, isCurrentMonth: true },
  { year: 2021, month: 6, date: 18, isCurrentMonth: true },
  { year: 2021, month: 6, date: 19, isCurrentMonth: true },
  { year: 2021, month: 6, date: 20, isCurrentMonth: true },
  { year: 2021, month: 6, date: 21, isCurrentMonth: true },
  { year: 2021, month: 6, date: 22, isCurrentMonth: true },
  { year: 2021, month: 6, date: 23, isCurrentMonth: true },
  { year: 2021, month: 6, date: 24, isCurrentMonth: true },
  { year: 2021, month: 6, date: 25, isCurrentMonth: true },
  { year: 2021, month: 6, date: 26, isCurrentMonth: true },
  { year: 2021, month: 6, date: 27, isCurrentMonth: true },
  { year: 2021, month: 6, date: 28, isCurrentMonth: true },
  { year: 2021, month: 6, date: 29, isCurrentMonth: true },
  { year: 2021, month: 6, date: 30, isCurrentMonth: true },
  { year: 2021, month: 6, date: 31, isCurrentMonth: true },
  { year: 2021, month: 7, date: 1 },
  { year: 2021, month: 7, date: 2 },
  { year: 2021, month: 7, date: 3 },
  { year: 2021, month: 7, date: 4 },
  { year: 2021, month: 7, date: 5 },
  { year: 2021, month: 7, date: 6 },
  { year: 2021, month: 7, date: 7 },
];

describe('getThisMonthDateInfo Function', () => {
  test('pass July, 2021 should return july2021DateInfo', () => {
    expect(getThisMonthDateInfo({ year: 2021, month: 6 })).toEqual(
      july2021DateInfo
    );
  });
});
