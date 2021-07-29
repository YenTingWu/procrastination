import format from 'date-fns/fp/format';
import addDays from 'date-fns/fp/addDays';
import { render, screen, fireEvent } from '../test-utils';
import { BidirectionalSlider } from '../../Slider/BidirectionalSlider';

const MIN_TEST_ID = 'slider-left-value';
const MAX_TEST_ID = 'slider-right-value';

const getFormatDate = (date: Date) => format('PP')(date);

test('should work with number domain correctly', () => {
  // test if render correctly
  const handleChange = jest.fn();
  const numberDomain: [number, number] = [0, 100];

  render(<BidirectionalSlider domain={numberDomain} onChange={handleChange} />);

  const minNode = screen.getByTestId(MIN_TEST_ID);
  const maxNode = screen.getByTestId(MAX_TEST_ID);

  const boundaries = screen.getAllByRole('slider');

  expect(minNode).toHaveTextContent('0');
  expect(maxNode).toHaveTextContent('100');

  // test if slider works
  fireEvent.change(boundaries[0], { target: { value: 5 } });
  fireEvent.change(boundaries[1], { target: { value: 50 } });

  expect(minNode).toHaveTextContent('5');
  expect(maxNode).toHaveTextContent('50');

  // One for first render, and other two calls are called by jest
  expect(handleChange).toHaveBeenCalledTimes(3);
});

test('should work with date domain correctly', () => {
  const range = 100;
  const startDate = new Date(2021, 6, 28);
  const endDate = new Date(2021, 6, 28 + range);
  const dateDomain: [Date, Date] = [startDate, endDate];
  const handleChange = jest.fn();

  // test if render correctly
  render(<BidirectionalSlider domain={dateDomain} onChange={handleChange} />);

  expect(screen.getByTestId(MIN_TEST_ID)).toHaveTextContent(
    getFormatDate(startDate)
  );
  expect(screen.getByTestId(MAX_TEST_ID)).toHaveTextContent(
    getFormatDate(endDate)
  );

  // test if slider works
  const boundaries = screen.getAllByRole('slider');

  fireEvent.change(boundaries[0], { target: { value: 1 } });
  fireEvent.change(boundaries[1], { target: { value: 99 } });

  expect(screen.getByTestId(MIN_TEST_ID)).toHaveTextContent(
    getFormatDate(addDays(1)(startDate))
  );
  expect(screen.getByTestId(MAX_TEST_ID)).toHaveTextContent(
    getFormatDate(addDays(-1)(endDate))
  );

  // One for first render, and other two calls are called by jest
  expect(handleChange).toHaveBeenCalledTimes(3);
});
