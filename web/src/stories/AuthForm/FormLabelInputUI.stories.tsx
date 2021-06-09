import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import {
  FormLabelInputUIProps,
  FormLabelInputUI,
} from '@components/AuthForm/FormLabelInputUI';

export default {
  title: 'Auth/FormLabelInputUI',
  component: FormLabelInputUI,
  argTypes: {
    onChange: {
      action: 'change',
    },
  },
} as Meta;

export const Template: Story<FormLabelInputUIProps> = (args) => (
  <FormLabelInputUI {...args} />
);

export const EmailInput = Template.bind({});
EmailInput.args = {
  name: 'email',
  label: 'email',
};
