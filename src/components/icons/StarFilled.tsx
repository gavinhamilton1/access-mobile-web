import React from 'react';
import { Icon, IconProps } from './Icon';

export const StarFilled: React.FC<Omit<IconProps, 'children'>> = (props) => (
  <Icon {...props} viewBox="0 0 48 48">
    <path d="M11.7,42l3.3-14.1-10.9-9.5,14.4-1.3,5.6-13.3,5.6,13.3,14.4,1.3-10.9,9.5,3.3,14.1-12.4-7.5-12.4,7.5Z" />
  </Icon>
);
