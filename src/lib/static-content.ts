// Shared view-model types for the case study, blog and career pages.
export interface ContentBlock {
  h: string;
  p?: string;
  list?: string[];
  figures?: { src: string; alt: string; caption?: string }[];
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string; // ISO string from WordPress
  summary: string;
  image?: string;
  wpContent: string;
}

export interface Career {
  slug: string;
  title: string;
  dept: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  summary: string;
  date: string;
}

export interface CaseMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  client: string;
  industry: string;
  title: string;
  summary: string;
  services: string[];
  year: number;
  duration: string;
  team: string;
  image?: string;
  metrics: CaseMetric[];
  body: ContentBlock[];
}
