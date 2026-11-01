export type NavLink = { label: string; href: string };

export type Settings = {
  brandName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  accent: string;
  accent2: string;
  footerNote: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  x: string;
};

export type Intro = {
  enabled: boolean;
  oncePerSession: boolean;
  word: string;
  subtext: string;
  duration: number; // seconds
};

export type Hero = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  highlight: string;
  subtitle: string;
  image: string;
  ctaPrimary: string;
  ctaSecondary: string;
  badge: string;
  variant: string; // "sun" | "cells" | "eclipse" | "bill" | "stories"
};

export type Statement = { text: string; image: string };

export type About = {
  title: string;
  highlight: string;
  intro: string;
  image: string;
  mission: string;
  values: { title: string; description: string }[];
  team: { name: string; role: string; photo: string }[];
};

export type Stat = { value: number; suffix: string; label: string; decimals?: number };

export type Service = {
  id: string;
  title: string;
  short: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
};

export type Step = { title: string; description: string; duration: string };

export type Project = {
  id: string;
  title: string;
  location: string;
  capacity: string;
  category: string;
  year: string;
  image: string;
  savings: string;
};

export type Package = {
  id: string;
  name: string;
  capacity: string;
  price: string;
  priceNote: string;
  ideal: string;
  features: string[];
  featured: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating: number;
};

export type Faq = { q: string; a: string };

export type CalculatorConfig = {
  tariff: number; // ₹ per unit
  unitsPerKw: number; // units generated per kW per month
  costPerKw: number; // ₹
  subsidyCap: number; // ₹ max subsidy
  subsidyPerKw: number; // ₹ per kW (up to cap)
  co2PerUnit: number; // kg per unit
  panelWattage: number; // W per panel
};

export type Sections = {
  marquee: boolean;
  statement: boolean;
  services: boolean;
  calculator: boolean;
  process: boolean;
  projects: boolean;
  packages: boolean;
  testimonials: boolean;
  faq: boolean;
  blog: boolean;
  cta: boolean;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  category: string;
  author: string;
  readTime: string;
  date: string;
  published: boolean;
};

export const LEAD_STAGES = [
  "New",
  "Contacted",
  "Site Survey",
  "Proposal",
  "Won",
  "Lost",
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];

export type LeadNote = { id: string; text: string; at: string };

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  propertyType: string;
  monthlyBill: number;
  systemSize: string;
  message: string;
  source: string;
  stage: LeadStage;
  value: number;
  priority: "Low" | "Medium" | "High";
  followUp: string;
  createdAt: string;
  notes: LeadNote[];
};

export type Content = {
  settings: Settings;
  intro: Intro;
  nav: NavLink[];
  hero: Hero;
  statement: Statement;
  about: About;
  partners: string[];
  stats: Stat[];
  services: Service[];
  process: Step[];
  projects: Project[];
  packages: Package[];
  testimonials: Testimonial[];
  faqs: Faq[];
  calculator: CalculatorConfig;
  sections: Sections;
};

export type DB = Content & { posts: Post[]; leads: Lead[] };

export type ContentKey = keyof Content;
