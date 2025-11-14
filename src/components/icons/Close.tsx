import React from 'react';
import { Icon, IconProps } from './Icon';

export const Close: React.FC<Omit<IconProps, 'children'>> = (props) => (
  <Icon {...props}>
    <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
  </Icon>
);
