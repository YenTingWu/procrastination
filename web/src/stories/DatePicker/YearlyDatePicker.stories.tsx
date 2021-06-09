import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import {
  YearlyDatePicker,
  YearlyDatePickerProps,
} from '@components/DatePicker/YearlyDatePicker';

export default {
  title: 'DatePicker/YearlyDatePicker',
  component: YearlyDatePicker,
  argTypes: {},
} as Meta;

export const Template: Story<YearlyDatePickerProps> = (...arg) => (
  <YearlyDatePicker {...arg} />
);
