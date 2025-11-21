import React from 'react';
import { Icon, IconProps } from './Icon';

export const StarBlank: React.FC<Omit<IconProps, 'children'>> = (props) => (
  <Icon {...props}>
    <path d="m323-245 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178Zm-90 125 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-355Z" />
  </Icon>
);
