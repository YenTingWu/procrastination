import {
  getSplitHoursMinutes,
  compareFormatHoursMinutes,
} from '../compareFormatHoursMinutes';

/**
 * * ## getSplitHoursMinutes
 * The time param should be the format of HH:mm
 * HH has to be between 00 - 23
 * mm has to be between 00 - 59
 */

describe('getSplitHoursMinutes Function', () => {
  const nonNumberString = 'sdfhadfkjahsdkf';
  const incorrectHourFormat = '30:50';
  const incorrectMinsFormat = '20:80';
  const correctFormat = '15:34';
  const correctFormatOutput = { hours: 15, mins: 34 };

  test('pass non-number string should return false', () => {
    expect(getSplitHoursMinutes(nonNumberString)).toBeFalsy();
  });
  test('pass non-hour format should return false', () => {
    expect(getSplitHoursMinutes(incorrectHourFormat)).toBeFalsy();
  });
  test('pass non-minute format should return false', () => {
    expect(getSplitHoursMinutes(incorrectMinsFormat)).toBeFalsy();
  });
  test('should return correct object', () => {
    expect(getSplitHoursMinutes(correctFormat)).toEqual(correctFormatOutput);
  });
});

/**
 * ## compareFormatTime
 * | number (left > right => 1 | left < right => -1 | left === right => 0)
 */

describe('compareFormatHoursMinutes Function', () => {
  const greaterValue = '15:30';
  const smallerValue = '13:22';
  test('left value is greater than right value', () => {
    expect(compareFormatHoursMinutes(greaterValue, smallerValue)).toBe(1);
  });
  test('right value is greater than left value', () => {
    expect(compareFormatHoursMinutes(smallerValue, greaterValue)).toBe(-1);
  });
  test('right value is equal to left value', () => {
    expect(compareFormatHoursMinutes(smallerValue, smallerValue)).toBe(0);
  });
});
