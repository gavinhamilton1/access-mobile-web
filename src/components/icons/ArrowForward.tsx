import React from 'react';
import { Icon, IconProps } from './Icon';

export const ArrowForward: React.FC<Omit<IconProps, 'children'>> = (props) => (
  <Icon {...props}>
    <path d="m304-82-56-57 343-343-343-343 56-57 400 400L304-82Z" />
  </Icon>
);
