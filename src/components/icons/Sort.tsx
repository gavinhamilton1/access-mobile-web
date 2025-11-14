import React from 'react';
import { Icon, IconProps } from './Icon';

export const Sort: React.FC<Omit<IconProps, 'children'>> = (props) => (
  <Icon {...props}>
    <path d="M120-240v-60h240v60H120Zm0-210v-60h480v60H120Zm0-210v-60h720v60H120Z" />
  </Icon>
);
