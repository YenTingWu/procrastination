import { getYearObject } from '../getYearObject';

describe('getYearObject function', () => {
  test('July 31,2021', () => {
    expect(getYearObject(new Date(2021, 6, 31))).toEqual({
      year: 2021,
      month: 6,
      date: 31,
    });
  });
});
