import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { LogoButton, LogoButtonProps } from '@components/AuthForm/LogoButton';
import { GoogleIcon } from '@components/Icon';

export default {
  title: 'Auth/LogoButton',
  component: LogoButton,
  argTypes: {},
} as Meta;

const Template: Story<LogoButtonProps> = (args) => <LogoButton {...args} />;

export const GoogleButton = Template.bind({});

GoogleButton.args = {
  title: 'Sign In With Google',
  logo: <GoogleIcon />,
  onClick: () => console.log('HI'),
};
