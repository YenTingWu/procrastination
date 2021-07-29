import { render, fireEvent } from '../test-utils';
import { LogoButton } from '../../Form/LogoButton';
import { GoogleIcon } from '../../Icon';

describe('Logo Button', () => {
  const title = 'test logo button';

  const handleClick = jest.fn();

  test('should render correctly', () => {
    const { getByText, getByTestId } = render(
      <LogoButton title={title} logo={<GoogleIcon />} onClick={handleClick} />
    );

    const iconNode = getByTestId('google-icon');
    const buttonNode = getByText(new RegExp(title, 'i'));

    expect(iconNode).toBeInTheDocument();
    expect(iconNode).toBeVisible();

    expect(buttonNode).toBeInTheDocument();
    expect(buttonNode).toBeVisible();
  });

  test('onClick', () => {
    const { getByText } = render(
      <LogoButton title={title} logo={<GoogleIcon />} onClick={handleClick} />
    );
    const buttonNode = getByText(new RegExp(title, 'i'));
    fireEvent.click(buttonNode);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
