import { Link } from 'gatsby';
import React from 'react';
import { css } from '@emotion/core';

import { colors } from '../styles/colors';
import { outer, inner } from '../styles/shared';
import config from '../website-config';

export const Footer: React.FC = () => {
  return (
    <footer css={[outer, SiteFooter]}>
      <div css={[inner, SiteFooterContent]}>
        <section className="copyright" css={Copyright}>
          <Link to="/">{config.title}</Link> &copy; {new Date().getFullYear()}{' '}
          <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
            {' '}
            | RSS
          </a>
          {config.twitter && (
            <a href={config.twitter} target="_blank" rel="noopener noreferrer">
              {' '}
              | Twitter
            </a>
          )}
          {config.github && (
            <a href={config.github} target="_blank" rel="noopener noreferrer">
              {' '}
              | GitHub
            </a>
          )}
        </section>
      </div>
    </footer>
  );
};

const SiteFooter = css`
  position: relative;
  padding-top: 20px;
  padding-bottom: 60px;
  color: ${colors.darkgrey};
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (prefers-color-scheme: dark) {
    color: #fff;
    background: ${colors.darkmode};
  }
`;

const SiteFooterContent = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  color: rgba(21, 23, 26, 0.7);
  font-size: 1.3rem;
  a {
    color: rgba(21, 23, 26, 0.7);
  }
  a:hover {
    color: rgba(21, 23, 26, 1);
    text-decoration: none;
  }
  @media (max-width: 650px) {
    flex-direction: column;
  }

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.7);

    a {
      color: rgba(255, 255, 255, 0.7);
    }
    a:hover {
      color: rgba(255, 255, 255, 1);
      text-decoration: none;
    }
  }
`;

const Copyright = css`
  margin-left: auto;
  margin-right: auto;
`;
