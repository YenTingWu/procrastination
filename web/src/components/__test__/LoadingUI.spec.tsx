import { render, screen } from './test-utils';
import { LoadingUI } from '../LoadingUI';

test('should render correctly', () => {
  render(<LoadingUI />);

  expect(screen.getByText('Loading!!!!!!!!')).toBeInTheDocument();
  expect(screen.getByText('Loading!!!!!!!!')).toBeVisible();
});
