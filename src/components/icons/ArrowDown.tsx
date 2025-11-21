import React from 'react';
import { Icon, IconProps } from './Icon';

export const ArrowDown: React.FC<Omit<IconProps, 'children'>> = (props) => (
  <Icon {...props}>
    <path d="M479-240 238-481l42-43 170 167v-400h60v402l168-168 42 42-241 241Z" />
  </Icon>
);
