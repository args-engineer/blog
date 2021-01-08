import { GatsbyConfig } from 'gatsby';
import { resolve } from 'path';
import config from '../website-config';

import('dotenv').then(module =>
  module.config({
    path: `.env.${process.env.NODE_ENV}`,
  }),
);

const gatsbyConfig: GatsbyConfig = {
  siteMetadata: {
    title: config.title,
    description: config.description,
    siteUrl: config.siteUrl,
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: [process.env.GATSBY_GA_TRACKING_ID],
        pluginConfig: {
          head: true,
          respectDNT: true,
          exclude: ['/preview/**'],
        },
      },
    },
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        quality: 100,
        stripMetadata: true,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: resolve(__dirname, '../content'),
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1rem',
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          'gatsby-remark-abbr',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 2000,
              quality: 100,
              wrapperStyle: `
                  border-radius: 10px;
                  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3), 1px 5px 10px 0 rgba(0, 0, 0, 0.7);
                  overflow: hidden;
                `,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              rel: 'noopener noreferrer',
            },
          },
        ],
      },
    },
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: config.siteUrl,
      },
    },
    'gatsby-plugin-emotion',
    'gatsby-plugin-typescript',
    'gatsby-transformer-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-yaml',
    'gatsby-plugin-feed',
    {
      resolve: 'gatsby-plugin-postcss',
      options: {
        postCssPlugins: [require('postcss-color-function'), require('cssnano')()],
      },
    },
    'gatsby-plugin-catch-links',
  ],
};

export default gatsbyConfig;
