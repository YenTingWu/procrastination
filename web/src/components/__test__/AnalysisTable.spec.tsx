import { render, screen } from './test-utils';
import { completedEvents } from './__mock__/events';
import { AnalysisTable } from '../Analysis/AnalysisTable';

const ROW_TEST_ID = 'table-row';

test('should render correctly', () => {
  render(<AnalysisTable completedEvents={completedEvents} />);

  const tableNode = screen.getByRole('table');

  expect(tableNode).toBeInTheDocument();
  expect(tableNode).toBeVisible();
});

test("render row's number correctly", () => {
  const { rerender } = render(
    <AnalysisTable completedEvents={completedEvents} />
  );

  expect(screen.getAllByTestId(ROW_TEST_ID)).toHaveLength(1);
  completedEvents.push(completedEvents[0]);

  rerender(<AnalysisTable completedEvents={completedEvents} />);
  expect(screen.getAllByTestId(ROW_TEST_ID)).toHaveLength(2);
});
