import React from 'react';
import { Icon, IconProps } from './Icon';

export const SortUp: React.FC<Omit<IconProps, 'children'>> = (props) => (
  <Icon {...props} viewBox="0 0 48 48">
    <path d="M6,36v-3h9.7v3H6ZM6,25.5v-3h19.4v3H6ZM6,15v-3h29.1v3H6Z" />
    <path d="M33.1,36.2v-13.3l-5.6,5.5-1.4-1.4,8-8,8,8-1.4,1.4-5.6-5.6v13.3h-2Z" />
  </Icon>
);
