import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { Button } from '../components/interaction/Button/Button';
import { ButtonProps } from '../components/interaction/Button/Button.types';

export default {
  title: 'interaction/Button',
  component: Button,
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const button = Template.bind({});
button.args = {
  children: 'Default',
  disabled: false,
};

export const buttonWithIcon = Template.bind({});
buttonWithIcon.args = {
  children: 'Default',
  disabled: false,
  icon: <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1"><polygon fill-rule="nonzero" points="3.722656 13.449219 9.464844 7.707031 3.722656 1.964844 5.480469 0.207031 12.980469 7.707031 5.480469 15.207031" /></svg>,
};
