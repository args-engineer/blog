import { format } from 'date-fns';
import { navigate } from 'gatsby';
import Img from 'gatsby-image';
import _ from 'lodash';
import { lighten } from 'polished';
import React from 'react';

import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { colors } from '../styles/colors';
import { PageContext } from '../templates/post';

export interface PostCardProps {
  post: PageContext;
  large?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, large = false }) => {
  const datetime = format(new Date(post.frontmatter.date), 'yyyy-MM-dd');

  return (
    <article
      className={`post-card ${post.frontmatter.image ? '' : 'no-image'} ${
        large ? 'post-card-large' : ''
      }`}
      css={[PostCardStyles, large && PostCardLarge]}
      onClick={() => navigate(post.fields.slug)}
    >
      {large && <NewArticles>New</NewArticles>}
      {post.frontmatter.image && (
        <PostCardImage className="post-card-image">
          {post.frontmatter?.image?.childImageSharp?.fluid && (
            <Img
              alt={`${post.frontmatter.title} cover image`}
              css={PostImage}
              fluid={post.frontmatter.image.childImageSharp.fluid}
            />
          )}
        </PostCardImage>
      )}
      <PostCardContent className="post-card-content">
        <PostCardHeader className="post-card-header">
          {post.frontmatter.tags && (
            <div style={{ display: 'flex' }}>
              {post.frontmatter.tags.map(tag => (
                <PostCardPrimaryTag>{tag}</PostCardPrimaryTag>
              ))}
            </div>
          )}
          <PostCardTitle className="post-card-title">{post.frontmatter.title}</PostCardTitle>
        </PostCardHeader>
        <PostCardExcerpt className="post-card-excerpt">
          <p>{post.frontmatter.excerpt || post.excerpt}</p>
        </PostCardExcerpt>
        <PostCardMeta className="post-card-meta">
          <PostCardBylineContent className="post-card-byline-content">
            <span className="post-card-byline-date">
              <time dateTime={datetime}>{datetime}</time>{' '}
            </span>
          </PostCardBylineContent>
        </PostCardMeta>
      </PostCardContent>
    </article>
  );
};

const PostCardStyles = css`
  position: relative;
  flex: 1 1 301px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0 2px 40px;
  padding: 30px 20px 40px;
  min-height: 220px;
  background-size: cover;
  border-radius: 10px;
  cursor: pointer;
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
`;

const PostCardLarge = css`
  @media (min-width: 795px) {
    flex: 1 1 100%;
    flex-direction: row;
    padding-bottom: 40px;
    min-height: 280px;
    border-top: 0;

    :not(.no-image) .post-card-header {
      margin-top: 0;
    }

    .post-card-image {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 10px;
      padding: 1%;
    }

    .post-card-content {
      flex: 0 1 600px;
      justify-content: center;
      z-index: 2;
      margin: 20px 30px 40px;
      padding: 1%;
      border-radius: 5px;

      @media (prefers-color-scheme: dark) {
        box-shadow: 5px 0 3px 0 rgba(0, 0, 0, 0.3), 5px 15px 15px 0 rgba(0, 0, 0, 0.7);
        background: rgba(25, 27, 31, 0.8);
      }
    }

    .post-card-title {
      margin-top: 0;
      font-size: 3.2rem;
    }

    .post-card-excerpt p {
      margin-bottom: 1.5em;
      font-size: 1.8rem;
      line-height: 1.5em;
    }
  }
`;

const NewArticles = styled.div`
  background: rgba(5, 45, 115, 0.95);
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3), 1px 5px 10px 0 rgba(0, 0, 0, 0.7);
  padding: 2px 35px;
  position: fixed;
  margin: 5px 0 0 10px;
  z-index: 3;
`;

const PostImage = css`
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3), 1px 5px 10px 0 rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  height: 100%;
`;

const PostCardImage = styled.div`
  width: auto;
  height: 200px;
  background-size: cover;
`;

const PostCardContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const PostCardPrimaryTag = styled.div`
  margin: 0 0 0.2em;
  /* color: var(--blue); */
  color: ${colors.blue};
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.2px;
  display: flex;
  align-items: center;
  background-color: #25282e;
  padding: 1px 4px;
  border-radius: 4px;
  margin-bottom: 4px;
  margin-right: 4px;
`;

const PostCardTitle = styled.h2`
  margin: 0 0 0.4em;
  line-height: 1.15em;
  transition: color 0.2s ease-in-out;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.85);
  }
`;

const PostCardExcerpt = styled.section`
  font-family: 'Noto Serif JP', Georgia, serif;
  padding-left: 10px;

  @media (prefers-color-scheme: dark) {
    /* color: color(var(--midgrey) l(+10%)); */
    color: ${lighten('0.1', colors.midgrey)} !important;
  }
`;

const PostCardMeta = styled.footer`
  margin: auto 0 0 auto;
`;

const PostCardBylineContent = styled.div`
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  margin: 4px 0 0 10px;
  /* color: color(var(--midgrey) l(+10%)); */
  color: ${lighten('0.1', colors.midgrey)};
  font-size: 1.2rem;
  line-height: 1.4em;
  font-weight: 400;
  letter-spacing: 0.2px;

  span {
    margin: 0;
  }

  a {
    /* color: color(var(--darkgrey) l(+20%)); */
    color: ${lighten('0.2', colors.darkgrey)};
    font-weight: 600;
  }

  @media (prefers-color-scheme: dark) {
    a {
      color: rgba(255, 255, 255, 0.75);
    }
  }
`;

const PostCardHeader = styled.header`
  margin: 15px 0 0;
`;

export const StaticAvatar = css`
  display: block;
  overflow: hidden;
  margin: 0 0 0 -6px;
  width: 34px;
  height: 34px;
  border: #fff 2px solid;
  border-radius: 100%;

  @media (prefers-color-scheme: dark) {
    /* border-color: color(var(--darkgrey) l(+2%)); */
    border-color: ${lighten('0.02', colors.darkgrey)};
  }
`;
