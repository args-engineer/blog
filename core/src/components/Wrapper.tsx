import React from 'react';
import styled from '@emotion/styled';
import { ScrollToTop } from '../components/Animation/ScrollToTop';

interface WrapperProps {
  className?: string;
}

export const Wrapper: React.FC<WrapperProps> = ({ children, className }) => (
  <StyledWrapper className={className}>
    {children}
    <ScrollToTop />
  </StyledWrapper>
);

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;
