import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AppDefaultLayoutDesktop } from '../../Layout/AppDefaultLayoutDesktop';

test('should render correctly', () => {
  render(
    <AppDefaultLayoutDesktop children={<div>This is a test element</div>} />
  );
  const testElement = screen.getByText(/This is a test element/i);
  expect(testElement).toBeInTheDocument();
  expect(testElement).toBeVisible();
});
