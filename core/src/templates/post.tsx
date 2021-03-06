import { format } from 'date-fns';
import { graphql, Link } from 'gatsby';
import Img, { FluidObject } from 'gatsby-image';
import * as _ from 'lodash';
import { lighten, setLightness } from 'polished';
import React from 'react';
import { Helmet } from 'react-helmet';

import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { Footer } from '../components/Footer';
import { Main } from '../components/Main';
import SiteNav, { SiteNavMain } from '../components/header/SiteNav';
import PostContent from '../components/PostContent';
import { ReadNext } from '../components/ReadNext';
import { Wrapper } from '../components/Wrapper';
import IndexLayout from '../layouts';
import { colors } from '../styles/colors';
import { inner, outer, SiteMain } from '../styles/shared';
import config from '../website-config';

interface PageTemplateProps {
  location: Location;
  data: {
    logo: {
      childImageSharp: {
        fixed: any;
      };
    };
    markdownRemark: {
      html: string;
      htmlAst: any;
      excerpt: string;
      frontmatter: {
        title: string;
        date: string;
        userDate: string;
        image: {
          childImageSharp: {
            fluid: any;
          };
        };
        excerpt: string;
        tags: string[];
      };
    };
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
  };
  pageContext: {
    prev: PageContext;
    next: PageContext;
  };
}

export interface PageContext {
  excerpt: string;
  fields: {
    slug: string;
  };
  frontmatter: {
    image: {
      childImageSharp: {
        fluid: FluidObject;
      };
    };
    excerpt: string;
    title: string;
    date: string;
    draft?: boolean;
    tags: string[];
  };
}

const PageTemplate = ({ data, pageContext, location }: PageTemplateProps) => {
  const post = data.markdownRemark;
  let width = '';
  let height = '';
  if (post.frontmatter.image?.childImageSharp) {
    width = post.frontmatter.image.childImageSharp.fluid.sizes.split(', ')[1].split('px')[0];
    height = String(Number(width) / post.frontmatter.image.childImageSharp.fluid.aspectRatio);
  }

  const postTitle = `${post.frontmatter.title} - ${config.title}`;
  const datetime = format(new Date(post.frontmatter.date), 'yyyy-MM-dd');

  return (
    <IndexLayout className="post-template">
      <Helmet>
        <html lang={config.lang} />
        <title>{postTitle}</title>

        <meta name="description" content={post.frontmatter.excerpt || post.excerpt} />
        <meta property="og:site_name" content={config.title} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={postTitle} />
        <meta property="og:description" content={post.frontmatter.excerpt || post.excerpt} />
        <meta property="og:url" content={config.siteUrl + location.pathname} />
        {post.frontmatter.image?.childImageSharp && (
          <meta
            property="og:image"
            content={`${config.siteUrl}${post.frontmatter.image.childImageSharp.fluid.src}`}
          />
        )}
        <meta property="article:published_time" content={post.frontmatter.date} />
        {post.frontmatter.tags && (
          <meta property="article:tag" content={post.frontmatter.tags[0]} />
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={postTitle} />
        <meta name="twitter:description" content={post.frontmatter.excerpt || post.excerpt} />
        <meta name="twitter:url" content={config.siteUrl + location.pathname} />
        {post.frontmatter.image?.childImageSharp && (
          <meta
            name="twitter:image"
            content={`${config.siteUrl}${post.frontmatter.image.childImageSharp.fluid.src}`}
          />
        )}
        {config.twitter && (
          <meta
            name="twitter:site"
            content={`@${config.twitter.split('https://twitter.com/')[1]}`}
          />
        )}
        {config.twitter && (
          <meta
            name="twitter:creator"
            content={`@${config.twitter.split('https://twitter.com/')[1]}`}
          />
        )}
        {width && <meta property="og:image:width" content={width} />}
        {height && <meta property="og:image:height" content={height} />}
      </Helmet>
      <Wrapper css={PostTemplate}>
        <header className="site-header">
          <div css={[outer, SiteNavMain]}>
            <div css={inner}>
              <SiteNav isPost post={post.frontmatter} />
            </div>
          </div>
        </header>
        <Main className="site-main" css={[SiteMain, outer]}>
          <div css={inner}>
            <article css={[PostFull, !post.frontmatter.image && NoImage]}>
              <PostFullHeader className="post-full-header">
                <PostFullTags className="post-full-tags">
                  {post.frontmatter.tags?.length > 0 && (
                    <div style={{ display: 'flex' }}>
                      {post.frontmatter.tags.map(tag => (
                        <PostLinkTags to={`/tags/${_.kebabCase(tag)}/`}>{tag}</PostLinkTags>
                      ))}
                    </div>
                  )}
                </PostFullTags>
                <PostFullTitle className="post-full-title">{post.frontmatter.title}</PostFullTitle>
                <PostFullCustomExcerpt className="post-full-custom-excerpt">
                  {post.frontmatter.excerpt}
                </PostFullCustomExcerpt>
                <PostFullByline className="post-full-byline">
                  <section className="post-full-byline-content">
                    <section className="post-full-byline-meta">
                      <div className="byline-meta-content">
                        <time className="byline-meta-date" dateTime={datetime}>
                          {datetime}
                        </time>
                      </div>
                    </section>
                  </section>
                </PostFullByline>
              </PostFullHeader>

              {post.frontmatter.image?.childImageSharp && (
                <PostFullImage>
                  <Img fluid={post.frontmatter.image.childImageSharp.fluid} alt={postTitle} />
                </PostFullImage>
              )}
              <PostContent htmlAst={post.htmlAst} />
            </article>
          </div>
        </Main>

        <ReadNext
          currentPageSlug={location.pathname}
          tags={post.frontmatter.tags}
          relatedPosts={data.relatedPosts}
          pageContext={pageContext}
        />

        <Footer />
      </Wrapper>
    </IndexLayout>
  );
};

const PostTemplate = css`
  .site-main {
    background: ${colors.lightgrey};
    padding-bottom: 4vw;
  }

  @media (prefers-color-scheme: dark) {
    .site-main {
      /* background: var(--darkmode); */
      background: ${colors.darkmode};
    }
  }
`;

export const PostFull = css`
  border-radius: 10px;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.12), 0 5px 30px 0 rgba(0, 0, 0, 0.22);
  padding: 20px;
  position: relative;
  margin: 100px 0 0 0;
  z-index: 50;
`;

export const NoImage = css`
  .post-full-content {
    padding-top: 0;
  }

  .post-full-content:before,
  .post-full-content:after {
    display: none;
  }
`;

export const PostFullHeader = styled.header`
  position: relative;
  margin: 0 auto;
  padding: 50px 0px 50px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
`;

const PostFullTags = styled.section`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /* color: var(--midgrey); */
  color: ${colors.midgrey};
  font-size: 1.3rem;
  line-height: 1.4em;
  font-weight: 600;
`;

const PostLinkTags = styled(props => <Link {...props} />)`
  display: flex;
  align-items: center;
  color: ${lighten('0.1' ,colors.darkgrey)};
  background-color: ${lighten('0.22' ,colors.midgrey)};
  padding: 1px 4px;
  border-radius: 4px;
  margin-bottom: 4px;
  margin-right: 4px;

  @media (prefers-color-scheme: dark) {
    color: ${colors.blue};
    background-color: #25282e;
  }
`;

const PostFullCustomExcerpt = styled.p`
  margin: 20px 0 0;
  color: var(--midgrey);
  font-family: 'Noto Serif JP', Georgia, serif;
  font-size: 2.3rem;
  line-height: 1.4em;
  font-weight: 300;

  @media (max-width: 500px) {
    font-size: 1.9rem;
    line-height: 1.5em;
  }

  @media (prefers-color-scheme: dark) {
    /* color: color(var(--midgrey) l(+10%)); */
    color: ${lighten('0.1', colors.midgrey)};
  }
`;

const PostFullByline = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 35px 0 0;
  padding-top: 15px;
  /* border-top: 1px solid color(var(--lightgrey) l(+10%)); */
  border-top: 1px solid ${lighten('0.1', colors.lightgrey)};

  .post-full-byline-content {
    flex-grow: 1;
    display: flex;
    align-items: flex-start;
  }

  .post-full-byline-content {
    justify-content: flex-start;
    padding: 0 12px 0 0;
  }

  .post-full-byline-meta {
    margin: 2px 0 0;
    /* color: color(var(--midgrey) l(+10%)); */
    color: ${lighten('0.1', colors.darkgrey)};
    font-size: 1.2rem;
    line-height: 1.2em;
    letter-spacing: 0.2px;
  }

  .post-full-byline-meta h4 {
    margin: 0 0 3px;
    font-size: 1.3rem;
    line-height: 1.4em;
    font-weight: 500;
  }

  .post-full-byline-meta h4 a {
    /* color: color(var(--darkgrey) l(+10%)); */
    color: ${lighten('0.1', colors.darkgrey)};
  }

  .post-full-byline-meta h4 a:hover {
    /* color: var(--darkgrey); */
    color: ${colors.darkgrey};
  }

  .post-full-byline-meta .bull {
    display: inline-block;
    margin: 0 4px;
    opacity: 0.6;
  }

  @media (prefers-color-scheme: dark) {
    /* border-top-color: color(var(--darkmode) l(+15%)); */
    border-top-color: ${lighten('0.15', colors.darkmode)};

    .post-full-byline-meta {
      color: ${lighten('0.1', colors.midgrey)};
    }

    .post-full-byline-meta h4 a {
      color: rgba(255, 255, 255, 0.75);
    }

    .post-full-byline-meta h4 a:hover {
      color: #fff;
    }
  }
`;

export const PostFullTitle = styled.h1`
  margin: 0 0 0.2em;
  color: ${setLightness('0.05', colors.darkgrey)};
  @media (max-width: 500px) {
    margin-top: 0.2em;
  }

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const PostFullImage = styled.figure`
  margin: 25px 0 50px;
  max-height: 600px;
  background: ${colors.lightgrey} center center;
  background-size: cover;
  border-radius: 10px;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3), 1px 5px 10px 0 rgba(0, 0, 0, 0.7);
  overflow: hidden;

  @media (max-width: 1170px) {
    border-radius: 0;
    img {
      max-width: 1170px;
    }
  }

  @media (max-width: 800px) {
    max-height: 400px;
  }
  @media (max-width: 500px) {
    margin: 0 0 4vw;
    max-height: 350px;
  }
`;

export const query = graphql`
  query($slug: String, $primaryTag: String) {
    logo: file(relativePath: { eq: "img/logo.png" }) {
      childImageSharp {
        fixed {
          ...GatsbyImageSharpFixed
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      htmlAst
      excerpt
      frontmatter {
        title
        userDate: date(formatString: "D MMMM YYYY")
        date
        tags
        excerpt
        image {
          childImageSharp {
            fluid(maxWidth: 3720) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
    relatedPosts: allMarkdownRemark(
      filter: { frontmatter: { tags: { in: [$primaryTag] }, draft: { ne: true } } }
      limit: 5
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
      edges {
        node {
          id
          excerpt
          frontmatter {
            title
            date
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;

export default PageTemplate;
