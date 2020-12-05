import React from 'react';
import * as Fade from './Animation/Fade';

interface WrapperProps {
  className?: string;
}

export const Main: React.FC<WrapperProps> = ({ children, className }) => (
  <Fade.InDown>
    <main id="site-main" className={className}>{children}</main>
  </Fade.InDown>
);
