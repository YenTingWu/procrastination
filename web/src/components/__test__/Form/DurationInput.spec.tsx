import React from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { render, waitFor } from '../test-utils';
import userEvent from '@testing-library/user-event';
import { DurationInput } from '../../Form/DurationInput';
import { setTimeout } from 'timers';

type DurationObject = {
  hours: number;
  mins: number;
};

type FormState = {
  duration: DurationObject;
};

interface FormikContainerProps {
  onSubmit: (values: FormState) => void;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const durationHoursTestId = 'duration-hours-input';
const durationMinsTestId = 'duration-mins-input';

const DURATION = {
  hours: 1,
  mins: 3,
};

const FormikContainer: React.FC<FormikContainerProps> = ({ onSubmit }) => {
  const handleSubmit = async (values: FormState) => {
    await sleep(500);
    onSubmit(values);
  };

  return (
    <Formik
      initialValues={{
        duration: DURATION,
      }}
      validationSchema={yup.object({
        duration: yup.object({
          hours: yup.number().min(0).required(),
          mins: yup.number().min(0).max(60).required(),
        }),
      })}
      onSubmit={handleSubmit}
    >
      {(props) => {
        return (
          <Form>
            <DurationInput
              name={'duration'}
              label={'duration'}
              value={props.values.duration}
            />
            <button type="submit">submit</button>
          </Form>
        );
      }}
    </Formik>
  );
};

test('should render correctly', () => {
  const handleSubmit = jest.fn();
  const { getByTestId } = render(<FormikContainer onSubmit={handleSubmit} />);

  const hoursInput = getByTestId(durationHoursTestId);
  const minsInput = getByTestId(durationMinsTestId);

  expect(hoursInput).toBeInTheDocument();
  expect(minsInput).toBeInTheDocument();
  expect(hoursInput).toBeVisible();
  expect(minsInput).toBeVisible();

  expect((hoursInput as HTMLInputElement).value).toBe('' + DURATION.hours);
  expect((minsInput as HTMLInputElement).value).toBe('' + DURATION.mins);
});

test('submitting a basic formik form', async () => {
  const handleSubmit = jest.fn();
  const newDuration = {
    hours: 11,
    mins: 2,
  };

  const { getByTestId, getByRole } = render(
    <FormikContainer onSubmit={handleSubmit} />
  );
  const hoursInput = getByTestId(durationHoursTestId);
  const minsInput = getByTestId(durationMinsTestId);
  const button = getByRole('button');

  // Test submitting initial value
  userEvent.click(button);

  await waitFor(() =>
    expect(handleSubmit).toHaveBeenCalledWith({
      duration: DURATION,
    })
  );

  // Test changing values and then submitting values
  (hoursInput as HTMLInputElement).setSelectionRange(0, 1);
  (minsInput as HTMLInputElement).setSelectionRange(0, 1);

  userEvent.type(hoursInput, '{backspace}' + newDuration.hours);
  userEvent.type(minsInput, '{backspace}' + newDuration.mins);
  userEvent.click(button);

  await waitFor(() =>
    expect(handleSubmit).toHaveBeenCalledWith({
      duration: newDuration,
    })
  );

  expect(handleSubmit).toHaveBeenCalledTimes(2);
});
