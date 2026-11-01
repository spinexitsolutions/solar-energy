import type { ContentKey } from "./types";

export type FieldType = "text" | "textarea" | "image" | "number" | "toggle" | "color" | "tags" | "select" | "icon" | "list";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  options?: string[];
  span?: 1 | 2;
  // for type "list"
  fields?: Field[];
  blank?: Record<string, unknown>;
  itemTitle?: string;
};

export type SectionSchema =
  | { kind: "object"; key: ContentKey; title: string; description: string; fields: Field[] }
  | {
      kind: "list";
      key: ContentKey;
      title: string;
      description: string;
      itemTitle: string; // field shown as item heading
      itemSubtitle?: string;
      fields: Field[];
      blank: Record<string, unknown>;
      primitive?: boolean; // list of plain strings
    };

export const ICON_OPTIONS = ["house", "factory", "battery-charging", "plug-zap", "shield-check", "sprout", "sun", "zap", "leaf", "wrench", "building", "car", "gauge"];

export const CMS: SectionSchema[] = [
  {
    kind: "object",
    key: "hero",
    title: "Hero",
    description: "The first thing visitors see — headline, image and calls to action.",
    fields: [
      {
        key: "variant",
        label: "Hero design",
        type: "select",
        options: ["sun", "cells", "eclipse", "bill", "stories"],
        help: "sun = Drag the Sun · cells = Solar Cells · eclipse = Eclipse · bill = The Bill · stories = Project Stories",
        span: 2,
      },
      { key: "badge", label: "Announcement badge", type: "text", span: 2 },
      { key: "titleLine1", label: "Title line 1", type: "text" },
      { key: "titleLine2", label: "Title line 2 (muted)", type: "text" },
      { key: "highlight", label: "Highlighted words (serif, gradient)", type: "text", span: 2 },
      { key: "subtitle", label: "Subtitle", type: "textarea", span: 2 },
      { key: "ctaPrimary", label: "Primary button", type: "text" },
      { key: "ctaSecondary", label: "Secondary button", type: "text" },
      { key: "eyebrow", label: "Eyebrow / SEO keywords", type: "text", span: 2 },
      { key: "image", label: "Hero image", type: "image", span: 2 },
    ],
  },
  {
    kind: "object",
    key: "intro",
    title: "Intro animation",
    description: "The cinematic sunrise loader shown when the website opens.",
    fields: [
      { key: "enabled", label: "Show intro animation", type: "toggle" },
      { key: "oncePerSession", label: "Only once per visit", type: "toggle" },
      { key: "word", label: "Wordmark", type: "text" },
      { key: "duration", label: "Duration (seconds)", type: "number", help: "2 – 5 seconds works best" },
      { key: "subtext", label: "Tagline", type: "text", span: 2 },
    ],
  },
  {
    kind: "object",
    key: "sections",
    title: "Homepage sections",
    description: "Switch homepage sections on or off instantly.",
    fields: [
      { key: "marquee", label: "Partner marquee", type: "toggle" },
      { key: "statement", label: "Scroll statement", type: "toggle" },
      { key: "services", label: "Solutions (stacking cards)", type: "toggle" },
      { key: "calculator", label: "Savings calculator", type: "toggle" },
      { key: "process", label: "How it works", type: "toggle" },
      { key: "projects", label: "Projects (horizontal scroll)", type: "toggle" },
      { key: "packages", label: "Pricing packages", type: "toggle" },
      { key: "testimonials", label: "Testimonials", type: "toggle" },
      { key: "faq", label: "FAQ", type: "toggle" },
      { key: "blog", label: "Journal preview", type: "toggle" },
      { key: "cta", label: "Final call-to-action", type: "toggle" },
    ],
  },
  {
    kind: "list",
    key: "nav",
    title: "Navigation",
    description: "Links in the floating navbar island and footer.",
    itemTitle: "label",
    itemSubtitle: "href",
    fields: [
      { key: "label", label: "Label", type: "text" },
      { key: "href", label: "Link (e.g. /projects)", type: "text" },
    ],
    blank: { label: "New link", href: "/" },
  },
  {
    kind: "object",
    key: "statement",
    title: "Scroll statement",
    description: "The big word-by-word reveal on a dark background.",
    fields: [
      { key: "text", label: "Statement", type: "textarea", span: 2 },
      { key: "image", label: "Background texture", type: "image", span: 2 },
    ],
  },
  {
    kind: "list",
    key: "stats",
    title: "Stats",
    description: "Animated counters.",
    itemTitle: "label",
    fields: [
      { key: "value", label: "Number", type: "number" },
      { key: "suffix", label: "Suffix (e.g. +, MW)", type: "text" },
      { key: "label", label: "Label", type: "text" },
      { key: "decimals", label: "Decimals", type: "number" },
    ],
    blank: { value: 100, suffix: "+", label: "New stat", decimals: 0 },
  },
  {
    kind: "list",
    key: "services",
    title: "Services",
    description: "Solutions shown as stacking cards and on /services.",
    itemTitle: "title",
    itemSubtitle: "short",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "id", label: "Anchor ID", type: "text" },
      { key: "short", label: "Short line", type: "text", span: 2 },
      { key: "description", label: "Description", type: "textarea", span: 2 },
      { key: "icon", label: "Icon", type: "icon" },
      { key: "features", label: "Feature bullets", type: "tags", span: 2 },
      { key: "image", label: "Image", type: "image", span: 2 },
    ],
    blank: { id: "new-service", title: "New service", short: "", description: "", icon: "sun", features: [], image: "" },
  },
  {
    kind: "list",
    key: "process",
    title: "Process steps",
    description: "The sunrise timeline in “How it works”.",
    itemTitle: "title",
    itemSubtitle: "duration",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "duration", label: "When", type: "text" },
      { key: "description", label: "Description", type: "textarea", span: 2 },
    ],
    blank: { title: "New step", duration: "Day 1", description: "" },
  },
  {
    kind: "list",
    key: "projects",
    title: "Projects",
    description: "Portfolio shown in the horizontal gallery and /projects.",
    itemTitle: "title",
    itemSubtitle: "location",
    fields: [
      { key: "title", label: "Project name", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "capacity", label: "Capacity", type: "text" },
      { key: "category", label: "Category", type: "select", options: ["Residential", "Housing Society", "Commercial", "Industrial", "Hybrid", "Solar Farm"] },
      { key: "savings", label: "Savings line", type: "text" },
      { key: "year", label: "Year", type: "text" },
      { key: "image", label: "Image", type: "image", span: 2 },
    ],
    blank: { title: "New project", location: "", capacity: "", category: "Residential", savings: "", year: String(new Date().getFullYear()), image: "" },
  },
  {
    kind: "list",
    key: "packages",
    title: "Pricing packages",
    description: "Plans in the pricing section.",
    itemTitle: "name",
    itemSubtitle: "price",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "capacity", label: "Capacity", type: "text" },
      { key: "price", label: "Price", type: "text" },
      { key: "priceNote", label: "Price note", type: "text" },
      { key: "ideal", label: "Ideal for", type: "text", span: 2 },
      { key: "features", label: "Included", type: "tags", span: 2 },
      { key: "featured", label: "Highlight as most chosen", type: "toggle" },
    ],
    blank: { name: "New plan", capacity: "", price: "", priceNote: "", ideal: "", features: [], featured: false },
  },
  {
    kind: "list",
    key: "testimonials",
    title: "Testimonials",
    description: "Customer stories carousel.",
    itemTitle: "name",
    itemSubtitle: "role",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "role", label: "Role / city", type: "text" },
      { key: "quote", label: "Quote", type: "textarea", span: 2 },
      { key: "rating", label: "Rating (1-5)", type: "number" },
      { key: "avatar", label: "Photo", type: "image", span: 2 },
    ],
    blank: { name: "Customer", role: "", quote: "", rating: 5, avatar: "" },
  },
  {
    kind: "list",
    key: "faqs",
    title: "FAQ",
    description: "Frequently asked questions.",
    itemTitle: "q",
    fields: [
      { key: "q", label: "Question", type: "text", span: 2 },
      { key: "a", label: "Answer", type: "textarea", span: 2 },
    ],
    blank: { q: "New question?", a: "" },
  },
  {
    kind: "list",
    key: "partners",
    title: "Partners",
    description: "Brand names in the scrolling marquee.",
    itemTitle: "value",
    primitive: true,
    fields: [{ key: "value", label: "Brand name", type: "text", span: 2 }],
    blank: { value: "Brand" },
  },
  {
    kind: "object",
    key: "about",
    title: "About page",
    description: "Story, mission, values and leadership team.",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "highlight", label: "Highlight", type: "text" },
      { key: "intro", label: "Intro", type: "textarea", span: 2 },
      { key: "mission", label: "Mission statement", type: "textarea", span: 2 },
      { key: "image", label: "Header image", type: "image", span: 2 },
      {
        key: "values",
        label: "Values",
        type: "list",
        span: 2,
        itemTitle: "title",
        blank: { title: "New value", description: "" },
        fields: [
          { key: "title", label: "Title", type: "text", span: 2 },
          { key: "description", label: "Description", type: "textarea", span: 2 },
        ],
      },
      {
        key: "team",
        label: "Team",
        type: "list",
        span: 2,
        itemTitle: "name",
        blank: { name: "Team member", role: "", photo: "" },
        fields: [
          { key: "name", label: "Name", type: "text" },
          { key: "role", label: "Role", type: "text" },
          { key: "photo", label: "Photo", type: "image", span: 2 },
        ],
      },
    ],
  },
  {
    kind: "object",
    key: "calculator",
    title: "Calculator",
    description: "Assumptions behind the savings calculator.",
    fields: [
      { key: "tariff", label: "Tariff (₹ / unit)", type: "number" },
      { key: "unitsPerKw", label: "Units per kW per month", type: "number" },
      { key: "costPerKw", label: "System cost (₹ / kW)", type: "number" },
      { key: "panelWattage", label: "Panel wattage (W)", type: "number" },
      { key: "subsidyPerKw", label: "Subsidy (₹ / kW, first 2 kW)", type: "number" },
      { key: "subsidyCap", label: "Max subsidy (₹)", type: "number" },
      { key: "co2PerUnit", label: "CO₂ per unit (kg)", type: "number" },
    ],
  },
];
