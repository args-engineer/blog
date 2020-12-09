import { Link, navigate } from 'gatsby';
import React from 'react';
import { lighten } from 'polished';
import styled from '@emotion/styled';
import * as _ from 'lodash';

import { colors } from '../styles/colors';
import { format } from 'date-fns';

export interface ReadNextProps {
  tags: string[];
  currentPageSlug: string;
  relatedPosts: {
    totalCount: number;
    edges: Array<{
      node: {
        frontmatter: {
          title: string;
          date: string;
        };
        fields: {
          slug: string;
        };
      };
    }>;
  };
}

export const ReadNextCard: React.FC<ReadNextProps> = props => {
  const relatedPosts = props.relatedPosts.edges
    .filter(post => post.node.fields.slug !== props.currentPageSlug)
    .slice(0, 4);

  return (
    <ReadNextCardArticle className="read-next-card">
      <header className="read-next-card-header">
        <ReadNextCardHeaderTitle>
          <span>タグ「</span>
          <Link to={`/tags/${_.kebabCase(props.tags[0])}/`}>{props.tags[0]}</Link>
          <span>」 を含む記事</span>
        </ReadNextCardHeaderTitle>
      </header>
      <ReadNextCardContent className="read-next-card-content">
        <ul>
          {relatedPosts.map(n => {
            const datetime = format(new Date(n.node.frontmatter.date), 'yyyy-MM-dd');
            return (
              <li key={n.node.frontmatter.title} onClick={() => navigate(n.node.fields.slug)}>
                <ReadNextCardMeta className="read-next-card-meta">
                  <p>
                    <time dateTime={datetime}>{datetime}</time>
                  </p>
                  <h4>{n.node.frontmatter.title}</h4>
                </ReadNextCardMeta>
              </li>
            );
          })}
        </ul>
      </ReadNextCardContent>
    </ReadNextCardArticle>
  );
};

const ReadNextCardArticle = styled.article`
  position: relative;
  flex: 0 1 326px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0 5px 40px;
  padding: 30px 20px 40px;
  /* background: linear-gradient(
    color(var(--darkgrey) l(+2%)),
    color(var(--darkgrey) l(-5%))
  ); */
  background: linear-gradient(
    ${lighten('0.02', colors.darkgrey)},
    ${lighten('-0.05', colors.darkgrey)}
  );
  border-radius: 10px;

  a {
    transition: all 0.2s ease-in-out;
  }

  a:hover {
    text-decoration: none;
  }

  box-shadow: 0 0 3px 0 rgba(0,0,0,.12), 0 5px 30px 0 rgba(0,0,0,.22);
  -webkit-transition: transform 0.7s;
  transition: transform 0.7s;

  @media (prefers-color-scheme: dark) {
    background: ${lighten('0.005', colors.darkmode)};
  }

  /* PCのみ */
  @media (min-width: 795px) and (min-height: 795px) {
    :hover {
      -webkit-transform: translateY(-3%);
      transform: translateY(-3%);
    }

  @media (max-width: 1170px) {
    flex: 1 1 261px;
    margin-bottom: 5vw;
  }

  @media (max-width: 650px) {
    flex: 1 1 auto;
    margin: 0 25px;
    padding: 0;
    background: none;
  }
`;

const ReadNextCardHeaderTitle = styled.h3`
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 2.0rem;
  line-height: 1em;
  font-weight: 300;
  letter-spacing: 0.4px;

  a {
    color: ${colors.blue};
    font-weight: 500;
    text-decoration: none;
    opacity: 0.8;
  }

  a:hover {
    opacity: 1;
  }
`;

const ReadNextCardContent = styled.div`
  font-size: 1.7rem;

  ul {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 0;
    padding: 20px 10px;
    cursor: pointer;
    -webkit-transition: opacity 0.7s;
    transition: opacity 0.7s;
    opacity: 0.8;
  }

  /* PCのみ */
  @media (min-width: 795px) and (min-height: 795px) {
    li:hover {
      opacity: 1;
    }

  li:last-of-type {
    padding-bottom: 5px;
    border: none;
  }

  h4 {
    margin: 0;
    font-size: 1.6rem;
    line-height: 1.35em;
    font-weight: 600;
    display: block;
    color: ${colors.blue};
  }
`;

const ReadNextCardMeta = styled.div`
  margin: 2px 0 0 10px;
  font-size: 1.2rem;
  line-height: 1.4em;
  font-weight: 400;

  p {
    margin: 0;
  }
`;
