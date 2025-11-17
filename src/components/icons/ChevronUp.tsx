import React from 'react';
import { Icon, IconProps } from './Icon';

export const ChevronUp: React.FC<Omit<IconProps, 'children'>> = (props) => (
  <Icon {...props} viewBox="0 0 48 48">
    <path d="M43.8,32.5l-2.85,2.8-17.15-17.15L6.65,35.3l-2.85-2.8L23.8,12.5l20,20Z" />
  </Icon>
);

