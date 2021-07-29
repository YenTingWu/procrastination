import { render, fireEvent } from '../test-utils';
import {
  FormLabelInputUI,
  FormLabelTextareaUI,
} from '../../Form/FormLabelInputUI';

describe('FormLabelInputUI', () => {
  const name = 'form label input';
  const label = 'label';
  const htmlFor = 'test';
  const handleChange = jest.fn();

  test('should render correctly', () => {
    const { getByLabelText } = render(
      <FormLabelInputUI
        name={name}
        label={label}
        htmlFor={htmlFor}
        value={''}
        onChange={handleChange}
      />
    );
    const inputNode = getByLabelText(new RegExp(label, 'i'));

    expect(inputNode).toBeInTheDocument();
    expect(inputNode).toBeVisible();
  });

  test('onChange', () => {
    const { getByLabelText } = render(
      <FormLabelInputUI
        name={name}
        label={label}
        htmlFor={htmlFor}
        value={''}
        onChange={handleChange}
      />
    );

    fireEvent.change(getByLabelText(new RegExp(label, 'i')), {
      target: { value: 'adfasdfasd' },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('value change', () => {
    const initialValue = 'initialValue';
    const newValue = 're-render';

    const { rerender, getByLabelText } = render(
      <FormLabelInputUI
        name={name}
        label={label}
        htmlFor={htmlFor}
        value={initialValue}
        onChange={handleChange}
      />
    );
    const input = getByLabelText(new RegExp(label, 'i'));
    expect(input).toHaveValue(initialValue);

    rerender(
      <FormLabelInputUI
        name={name}
        label={label}
        htmlFor={htmlFor}
        value={newValue}
        onChange={handleChange}
      />
    );

    expect(input).toHaveValue(newValue);
  });
});

describe('FormLabelTextareaUI', () => {
  const name = 'form label textarea';
  const label = 'label';
  const htmlFor = 'test';
  const handleChange = jest.fn();

  test('should render correctly', () => {
    const { getByLabelText } = render(
      <FormLabelTextareaUI
        name={name}
        label={label}
        htmlFor={htmlFor}
        value={''}
        onChange={handleChange}
      />
    );
    const textareaNode = getByLabelText(new RegExp(label, 'i'));

    expect(textareaNode).toBeInTheDocument();
    expect(textareaNode).toBeVisible();
  });

  test('onChange', () => {
    const { getByLabelText } = render(
      <FormLabelTextareaUI
        name={name}
        label={label}
        htmlFor={htmlFor}
        value={''}
        onChange={handleChange}
      />
    );

    fireEvent.change(getByLabelText(new RegExp(label, 'i')), {
      target: { value: 'adfasdfasd' },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('value change', () => {
    const initialValue = 'initialValue';
    const newValue = 're-render';

    const { rerender, getByLabelText } = render(
      <FormLabelTextareaUI
        name={name}
        label={label}
        htmlFor={htmlFor}
        value={initialValue}
        onChange={handleChange}
      />
    );
    const textarea = getByLabelText(new RegExp(label, 'i'));
    expect(textarea).toHaveValue(initialValue);

    rerender(
      <FormLabelTextareaUI
        name={name}
        label={label}
        htmlFor={htmlFor}
        value={newValue}
        onChange={handleChange}
      />
    );

    expect(textarea).toHaveValue(newValue);
  });
});
