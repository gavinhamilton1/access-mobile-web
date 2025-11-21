import React from 'react';

export interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
  viewBox?: string;
  children: React.ReactNode;
}

/**
 * Base icon component that handles sizing and coloring
 */
export const Icon: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className,
  viewBox = '0 -960 960 960',
  children,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill={color}
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        width: size,
        height: size,
      }}
    >
      {children}
    </svg>
  );
};

