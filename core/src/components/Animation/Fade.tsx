import React from 'react'
import styled from '@emotion/styled'
import InViewMonitor from 'react-inview-monitor'

interface FadeProps {
  className?: string;
  delay?: number | undefined;
  margin?: string;
}

export const InUp: React.FC<FadeProps> = ({ children, delay, margin = '-20%' }) => (
  <InViewMonitor childPropsInView={{ isActive: true }} intoViewMargin={margin}>
    <FadeInUp isActive={false} delay={delay}>{children}</FadeInUp>
  </InViewMonitor>
)

export const InDown: React.FC<FadeProps> = ({ children, delay, margin = '-20%' }) => (
  <InViewMonitor childPropsInView={{ isActive: true }} intoViewMargin={margin}>
    <FadeInDown isActive={false} delay={delay}>{children}</FadeInDown>
  </InViewMonitor>
)

export const InLeft: React.FC<FadeProps> = ({ children, delay, margin = '-20%' }) => (
  <InViewMonitor childPropsInView={{ isActive: true }} intoViewMargin={margin}>
    <FadeInLeft isActive={false} delay={delay}>{children}</FadeInLeft>
  </InViewMonitor>
)

export const InRight: React.FC<FadeProps> = ({ children, delay, margin = '-20%' }) => (
  <InViewMonitor childPropsInView={{ isActive: true }} intoViewMargin={margin}>
    <FadeInRight isActive={false} delay={delay}>{children}</FadeInRight>
  </InViewMonitor>
)

const FadeIn = styled.div<{isActive: boolean; delay: number | undefined}>`
  opacity: 0;
  transition: opacity 1s ease, transform 1s ease;
  ${({ isActive }) => isActive && `opacity: 1;`}
  ${({ delay }) => delay && `transition-delay: ${delay}ms;`}
`;

const FadeInUp = styled(FadeIn)`
  transform: translateY(30px);
  ${({ isActive }) => isActive && `transform: translateY(0px);`}
`;

const FadeInDown = styled(FadeIn)`
  transform: translateY(-30px);
  ${({ isActive }) => isActive && `transform: translateY(0px);`}
`;

const FadeInLeft = styled(FadeIn)`
  transform: translateX(-30px);
  ${({ isActive }) => isActive && `transform: translateX(0px);`}
`;

const FadeInRight = styled(FadeIn)`
  transform: translateX(30px);
  ${({ isActive }) => isActive && `transform: translateX(0px);`}
`;
