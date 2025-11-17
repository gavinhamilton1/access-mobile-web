import React from 'react';
import { Icon, IconProps } from './Icon';

export const ChevronDown: React.FC<Omit<IconProps, 'children'>> = (props) => (
  <Icon {...props} viewBox="0 0 48 48">
    <path d="M3.8,15.3l2.85-2.8,17.15,17.15,17.15-17.15,2.85,2.8-20,20L3.8,15.3Z" />
  </Icon>
);

