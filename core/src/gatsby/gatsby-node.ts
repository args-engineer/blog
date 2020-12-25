/* eslint-disable @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-var-requires */
import path from 'path';
import _ from 'lodash';
import { GatsbyNode } from 'gatsby';
import { FluidObject } from 'gatsby-image';
import { createFilePath } from 'gatsby-source-filesystem';
import config from '../website-config';

interface Frontmatter {
  permalink: string;
  layout: string;
  primaryTag: string;
}

interface Result {
  allMarkdownRemark: {
    edges: Array<{
      node: {
        excerpt: string;
        fields: {
          slug: string;
          layout: string;
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
      };
    }>;
  };
}

export const onCreateNode: GatsbyNode['onCreateNode'] = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  // eslint-disable-next-line default-case
  switch (node.internal.type) {
    case 'MarkdownRemark': {
      const { permalink, layout, primaryTag }: Frontmatter = node.frontmatter as Frontmatter;

      createNodeField({
        node,
        name: 'slug',
        value: permalink || createFilePath({ node, getNode })?.replace('.md', '') || '',
      });

      createNodeField({
        node,
        name: 'layout',
        value: layout || '',
      });

      createNodeField({
        node,
        name: 'primaryTag',
        value: primaryTag || '',
      });
    }
  }
};

export const createPages: GatsbyNode['createPages'] = async ({
  graphql,
  actions: { createPage },
}) => {
  const result = await graphql<Result>(`
    {
      allMarkdownRemark(
        limit: 2000
        sort: { fields: [frontmatter___date], order: ASC }
        filter: { frontmatter: { draft: { ne: true } } }
      ) {
        edges {
          node {
            excerpt
            frontmatter {
              title
              tags
              date
              draft
              excerpt
              image {
                childImageSharp {
                  fluid(maxWidth: 3720) {
                    aspectRatio
                    base64
                    sizes
                    src
                    srcSet
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
  `);

  if (result.errors || !result.data) {
    console.error(result.errors);
    throw new Error(result.errors);
  }

  // Create paginated index
  const posts = result.data.allMarkdownRemark.edges;
  const postsPerPage = 1000;
  const numPages = Math.ceil(posts.length / postsPerPage);

  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? '/' : `/${i + 1}`,
      component: path.resolve('./src/templates/index.tsx'),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        logo: config.logo,
        header: config.coverImage,
        numPages,
        currentPage: i + 1,
      },
    });
  });

  posts.forEach(({ node }, index) => {
    const { slug, layout } = node.fields;
    const prev = index === 0 ? null : posts[index - 1].node;
    const next = index === posts.length - 1 ? null : posts[index + 1].node;

    createPage({
      path: slug,
      component: path.resolve(`./src/templates/${layout || 'post'}.tsx`),
      context: {
        slug,
        prev,
        next,
        primaryTag: node.frontmatter.tags ? node.frontmatter.tags[0] : '',
      },
    });
  });

  // Create tag pages
  const tagTemplate = path.resolve('./src/templates/tags.tsx');
  const tags = _.uniq(
    _.flatten(
      result.data.allMarkdownRemark.edges.map(edge => {
        return _.castArray(_.get(edge, 'node.frontmatter.tags', []));
      }),
    ),
  );
  tags.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag)}/`,
      component: tagTemplate,
      context: {
        tag,
      },
    });
  });
};

// DevTool Build設定(開発時のみ)
export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({ stage, actions }) => {
  if (stage === 'develop' || stage === 'develop-html') {
    actions.setWebpackConfig({
      devtool: 'eval-source-map', // build - slow / rebuild - fast / original source
    });
  }
};
