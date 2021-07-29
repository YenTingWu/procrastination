import { render, screen } from '../test-utils';
import { AppDefaultLayoutDesktop } from '../../Layout/AppDefaultLayoutDesktop';

test('should render correctly', () => {
  render(
    <AppDefaultLayoutDesktop children={<div>This is a test element</div>} />
  );
  const testElement = screen.getByText(/This is a test element/i);
  expect(testElement).toBeInTheDocument();
  expect(testElement).toBeVisible();
});
