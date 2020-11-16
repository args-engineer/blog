/* eslint-disable @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-var-requires */
const path = require('path');
const _ = require('lodash');

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  // eslint-disable-next-line default-case
  switch (node.internal.type) {
    case 'MarkdownRemark': {
      const { permalink, layout, primaryTag } = node.frontmatter;
      const { relativePath } = getNode(node.parent);

      let slug = permalink;

      if (!slug) {
        slug = `/${relativePath.replace('.md', '')}/`;
      }

      createNodeField({
        node,
        name: 'slug',
        value: slug || '',
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

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
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

  if (result.errors) {
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
exports.onCreateWebpackConfig = ({ stage, actions }) => {
  if (stage === 'develop' || stage === 'develop-html') {
    actions.setWebpackConfig({
      devtool: 'eval-source-map' // build - slow / rebuild - fast / original source
    });
  }
};
