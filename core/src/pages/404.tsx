import { graphql, navigate } from 'gatsby';
import React from 'react';

import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { Footer } from '../components/Footer';
import { Main } from '../components/Main';
import SiteNav, { SiteNavMain } from '../components/header/SiteNav';
import { PostCard } from '../components/PostCard';
import { Wrapper } from '../components/Wrapper';
import IndexLayout from '../layouts';
import { colors } from '../styles/colors';
import { inner, outer, PostFeed, SiteHeader } from '../styles/shared';
import { PageContext } from '../templates/post';

interface NotFoundTemplateProps {
  data: {
    allMarkdownRemark: {
      totalCount: number;
      edges: Array<{
        node: PageContext;
      }>;
    };
  };
}

const NotFoundPage: React.FC<NotFoundTemplateProps> = props => {
  const { edges } = props.data.allMarkdownRemark;

  return (
    <IndexLayout>
      <Wrapper>
        <header css={[SiteHeader, outer]}>
          <div css={[outer, SiteNavMain]}>
            <div css={inner}>
              <SiteNav isHome={false} />
            </div>
          </div>
        </header>
        <Main css={[outer, ErrorContent]} className="error-content">
          <div css={[inner]}>
            <section css={ErrorSection} onClick={() => navigate('/')}>
              <ErrorCode>404 Page Not Found</ErrorCode>
              <ErrorDescription>お探しのページは見つかりませんでした。</ErrorDescription>
              <ErrorDescription>
                アクセスしようとしたページは削除されたかURLが変更された可能性があります。
              </ErrorDescription>
            </section>

            <div css={PostFeed} className="post-feed">
              {edges.map(({ node }) => (
                <PostCard key={node.fields.slug} post={node} />
              ))}
            </div>
          </div>
        </Main>
        <Footer />
      </Wrapper>
    </IndexLayout>
  );
};

export const pageQuery = graphql`
  query {
    allMarkdownRemark(limit: 3, sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          frontmatter {
            title
            date
            tags
            image {
              childImageSharp {
                fluid(maxWidth: 3720) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          excerpt
          fields {
            layout
            slug
          }
        }
      }
    }
  }
`;

const ErrorSection = css`
  border-radius: 10px;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.12), 0 5px 30px 0 rgba(0, 0, 0, 0.22);
  cursor: pointer;
  margin-bottom: 30px;
  padding-bottom: 30px;
  text-align: center;
  -webkit-transition: transform 0.7s;
  transition: transform 0.7s;

  /* PCのみ */
  @media (min-width: 795px) and (min-height: 795px) {
    :hover {
      -webkit-transform: translateY(-3%);
      transform: translateY(-3%);
    }
`;

const ErrorContent = css`
  padding: 8vw 4vw 4vw;

  @media (max-width: 800px) {
    padding-top: 24vw;
  }

  @media (max-width: 500px) {
    padding-top: 28vw;
  }
`;

const ErrorCode = styled.h1`
  margin: 0;
  /* color: var(--lightgrey); */
  color: ${colors.lightgrey};
  font-size: 3vw;
  line-height: 1em;
  padding: 30px;
  opacity: 0.75;

  @media (max-width: 800px) {
    font-size: 11.2rem;
  }
`;

const ErrorDescription = styled.p`
  margin: 0;
  /* color: var(--midgrey); */
  color: ${colors.midgrey};
  font-size: 2rem;
  line-height: 1.3em;
  font-weight: 400;

  @media (max-width: 800px) {
    margin: 5px 0 0 0;
    font-size: 1.8rem;
  }
`;

export default NotFoundPage;
