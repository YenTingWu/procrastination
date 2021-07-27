import { getFormatNumber } from '../getFormatNumber';

describe('getFormatNumber Function', () => {
  const number = 123456789;
  const format = '123,456,789';
  test('should return format number xxx,xxx,xxx', () => {
    expect(getFormatNumber(number)).toBe(format);
  });
});
