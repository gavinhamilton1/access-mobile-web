import React from 'react';
import { Icon, IconProps } from './Icon';

export const Check: React.FC<Omit<IconProps, 'children'>> = (props) => (
  <Icon {...props}>
    <path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z" />
  </Icon>
);

