import React from 'react';
import { Icon, IconProps } from './Icon';

export const ArrowBack: React.FC<Omit<IconProps, 'children'>> = (props) => (
  <Icon {...props}>
    <path d="M655-80 255-480l400-400 56 57-343 343 343 343-56 57Z" />
  </Icon>
);
