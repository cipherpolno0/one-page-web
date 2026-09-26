export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content: string;
  featured?: boolean;
};

export type DocumentItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  fileUrl: string;
  fileSize: string;
};

export type NavigationItem = {
  href: string;
  label: string;
};

export type SiteBrand = {
  name: string;
  tagline: string;
  mark: string;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  notice: string;
  callToAction: NavigationItem;
};
