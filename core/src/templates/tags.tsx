import { graphql } from 'gatsby';
import React from 'react';
import { FluidObject } from 'gatsby-image';

import { css } from '@emotion/core';

import { Footer } from '../components/Footer';
import { Main } from '../components/Main';
import SiteNav, { SiteNavMain } from '../components/header/SiteNav';
import { PostCard } from '../components/PostCard';
import { Wrapper } from '../components/Wrapper';
import IndexLayout from '../layouts';
import {
  inner,
  outer,
  PostFeed,
  SiteDescription,
  SiteHeader,
  SiteHeaderContent,
  SiteMain,
  SiteTitle,
  SiteArchiveHeader,
  ResponsiveHeaderBackground,
} from '../styles/shared';
import { PageContext } from './post';
import { Helmet } from 'react-helmet';
import config from '../website-config';

interface TagTemplateProps {
  location: Location;
  pageContext: {
    tag: string;
  };
  data: {
    allTagYaml: {
      edges: Array<{
        node: {
          id: string;
          description: string;
          image?: {
            childImageSharp: {
              fluid: FluidObject;
            };
          };
        };
      }>;
    };
    allMarkdownRemark: {
      totalCount: number;
      edges: Array<{
        node: PageContext;
      }>;
    };
  };
}

const Tags = ({ pageContext, data, location }: TagTemplateProps) => {
  const tag = pageContext.tag ? pageContext.tag : '';
  const PageTitle = `${tag} - ${config.title}`;
  const { edges, totalCount } = data.allMarkdownRemark;
  const tagData = data.allTagYaml.edges.find(n => n.node.id.toLowerCase() === tag.toLowerCase());

  return (
    <IndexLayout>
      <Helmet>
        <html lang={config.lang} />
        <title>{PageTitle}</title>
        <meta name="description" content={tagData?.node ? tagData.node.description : ''} />
        <meta property="og:site_name" content={config.title} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={PageTitle} />
        <meta property="og:url" content={config.siteUrl + location.pathname} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PageTitle} />
        <meta name="twitter:url" content={config.siteUrl + location.pathname} />
        {config.twitter && (
          <meta
            name="twitter:site"
            content={`@${config.twitter.split('https://twitter.com/')[1]}`}
          />
        )}
      </Helmet>
      <Wrapper>
        <header className="site-archive-header" css={[SiteHeader, SiteArchiveHeader]}>
          <div css={[outer, SiteNavMain]}>
            <div css={inner}>
              <SiteNav isHome={false} />
            </div>
          </div>
        </header>
        <Main css={[SiteMain, outer]}>
          <div css={[inner, TagsMain]}>
            <ResponsiveHeaderBackground
              css={[outer]}
              backgroundImage={tagData?.node?.image?.childImageSharp?.fluid?.src}
              className="site-header-background"
            >
              <SiteHeaderContent css={inner} className="site-header-content">
                <SiteTitle className="site-title">{tag}</SiteTitle>
                <SiteDescription className="site-description">
                  {tagData?.node.description}
                </SiteDescription>
                <SiteDescription className="site-description">
                  {`タグを含む記事 : ${totalCount} 件`}
                </SiteDescription>
              </SiteHeaderContent>
            </ResponsiveHeaderBackground>
            <div css={[PostFeed]}>
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

export default Tags;

const TagsMain = css`
  border-radius: 10px;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.12), 0 5px 30px 0 rgba(0, 0, 0, 0.22);
  padding: 30px;
  margin: 100px 0px;
`;

export const pageQuery = graphql`
  query($tag: String) {
    allTagYaml {
      edges {
        node {
          id
          description
          image {
            childImageSharp {
              fluid(maxWidth: 3720) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] }, draft: { ne: true } } }
    ) {
      totalCount
      edges {
        node {
          excerpt
          frontmatter {
            title
            excerpt
            tags
            date
            image {
              childImageSharp {
                fluid(maxWidth: 1240) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          fields {
            layout
            slug
          }
        }
      }
    }
  }
`;
