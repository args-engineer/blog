import React, { useEffect, useState } from 'react';
import { css } from '@emotion/core';

export const ScrollToTop: React.FC = () => {
  const [isTop, setIsTop] = useState<boolean>(true);

  const onScroll = (): void => {
    if (getTop() >= 100) {
      setIsTop(false);
    } else {
      setIsTop(true);
    }
  };

  useEffect(() => {
    document.addEventListener('scroll', onScroll);
    return (): void => document.removeEventListener('scroll', onScroll);
  });

  return <div css={[ScrollToTopStyles, isTop ? HideScrollToTop : '']} onClick={scroll} />;
};

const getTop = (): number =>
  Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);

const scroll = (): void => {
  typeof window !== 'undefined' &&
    window.scroll({
      top: 0, // 最上部へスクロール
      behavior: 'smooth',
    });
};

const ScrollToTopStyles = css`
  background-image: url(${require('../../content/img/scroll-to-top.png')});
  cursor: pointer;
  position: fixed;
  right: 5%;
  bottom: 5%;
  min-width: 48px;
  min-height: 48px;
  z-index: 100;
  transition: opacity 1s, visibility 1s, transform 0.5s;
  -webkit-transition: opacity 1s, visibility 1s, -webkit-transform 0.5s;
  opacity: 0.5;
  visibility: visible;

  /* PCのみ */
  @media (min-width: 795px) and (min-height: 795px) {
    :hover {
      transform: scale(1.3);
      -webkit-transform: scale(1.3);
    }
  }
`;

const HideScrollToTop = css`
  z-index: 0;
  opacity: 0;
  visibility: hidden;
`;
