export interface WebsiteConfig {
  title: string;
  description: string;
  coverImage?: string;
  logo: string;
  lang: string;
  siteUrl: string;
  twitter?: string;
  github?: string;
  googleSiteVerification?: string;
}

const config: WebsiteConfig = {
  title: 'Portfolio',
  description: 'Portfolio site by Args.Engineer',
  coverImage: 'img/blog-cover.png',
  logo: 'img/logo.png',
  lang: 'ja',
  siteUrl: 'https://xxxx.com',
  twitter: 'https://twitter.com/ArgsEngineer',
  github: 'https://github.com',
  googleSiteVerification: 'GoogleCode',
};

export default config;
