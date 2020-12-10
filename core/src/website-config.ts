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
  aboutPageTitle: string;
}

const config: WebsiteConfig = {
  title: 'Args.Engineer',
  description: 'Portfolio site by Args.Engineer',
  coverImage: 'img/blog-cover.png',
  logo: 'img/logo.png',
  lang: 'ja',
  siteUrl: 'https://args-engineer.com/',
  twitter: 'https://twitter.com/ArgsEngineer',
  github: 'https://github.com/args-engineer/blog',
  googleSiteVerification: 'GoogleCode',
  aboutPageTitle: '当サイトについて'
};

export default config;
