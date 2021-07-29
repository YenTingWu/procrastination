import React from 'react';
import * as yup from 'yup';
import format from 'date-fns/fp/format';
import { Form, Formik } from 'formik';
import { render, fireEvent } from '../test-utils';
import { DateTimePickerInput } from '../../Form/DateTimePickerInput';

type FormState = {
  startTime: Date;
};

interface FormikContainerProps {
  onSubmit: (values: FormState) => void | Promise<void>;
}

const LABEL = 'Test Time';
const testTime = new Date();
const formattedDate = format('MMM dd, yyyy HH:mm', testTime);

const FormikContainer: React.FC<FormikContainerProps> = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{
        startTime: testTime,
      }}
      validationSchema={yup.object({
        endTime: yup.date(),
      })}
      onSubmit={onSubmit}
    >
      <Form>
        <DateTimePickerInput fieldKey="startTime" label={LABEL} />
      </Form>
    </Formik>
  );
};

test('should render correctly', () => {
  const handleSubmit = jest.fn();
  const { getByLabelText } = render(
    <FormikContainer onSubmit={handleSubmit} />
  );
  const inputNode = getByLabelText(LABEL);

  expect(inputNode).toBeInTheDocument();
  expect(inputNode).toBeVisible();
  expect((inputNode as HTMLInputElement).value).toBe(formattedDate);
});

// test('drop down', () => {
//   const mainContainerId = 'main-date-picker-input-container';
//   //   const datePickerContainerId = 'monthly-date-picker-container';
//   const handleSubmit = jest.fn();
//   const { getByTestId } = render(<FormikContainer onSubmit={handleSubmit} />);

//   const mainContainerNode = getByTestId(mainContainerId);

//   expect(mainContainerNode).toBeInTheDocument();

//   fireEvent.click(mainContainerNode);
// });
