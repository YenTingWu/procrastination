import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import {
  ControlledMonthlyDatePicker,
  ControlledMonthlyDatePickerProps,
} from '@components/DatePicker/ControlledMonthlyDatePicker';

export default {
  title: 'DatePicker/ControlledMonthlyDatePicker',
  component: ControlledMonthlyDatePicker,
  argTypes: {},
} as Meta;

export const Template: Story<ControlledMonthlyDatePickerProps> = (...arg) => (
  <ControlledMonthlyDatePicker {...arg} />
);
