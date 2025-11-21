import React from 'react';
import { Icon, IconProps } from './Icon';

export const ArrowUp: React.FC<Omit<IconProps, 'children'>> = (props) => (
  <Icon {...props}>
    <path d="M452-244v-400L282-477l-42-43 241-241 241 241-42 42-168-168v402h-60Z" />
  </Icon>
);
