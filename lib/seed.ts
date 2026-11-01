import type { DB, Lead, LeadStage } from "./types";

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMG = {
  fieldClouds: u("1509391366360-2e959784a276"),
  blueSky: u("1508514177221-188b1cf16e9d"),
  grassClose: u("1497440001374-f26997328c1b"),
  wiring: u("1559302504-64aae6ca6b6d"),
  roofSunset: u("1613665813446-82a78c468a1d", 2400),
  commercialRoof: u("1611365892117-00ac5ef43c90"),
  installer: u("1624397640148-949b1732bb0a"),
  bright: u("1545209463-e2825498edbf"),
  windSunset: u("1466611653911-95081537e5b7"),
  forest: u("1592833159155-c62df1b65634"),
  powerLines: u("1473341304170-971dccb5ac1e"),
  verticalPanel: u("1626793369994-a904d2462888"),
  evCharge: u("1593941707882-a5bba14938c7"),
  fieldGreen: u("1558449028-b53a39d100fc"),
  closeUp: u("1521618755572-156ae0cdd74d"),
  aerialFarm: u("1497435334941-8c899ee9e8e9", 2400),
  industrial: u("1513828583688-c52646db42da"),
  villa: u("1564501049412-61c2a3083791"),
  modernHome: u("1600585154340-be6161a56a0c"),
  engineer: u("1581092160562-40aa08e78837"),
  texture: u("1625301840055-7c1b7198cfc0", 2400),
  p1: u("1507003211169-0a1dd7228f2d", 300),
  p2: u("1494790108377-be9c29b29330", 300),
  p3: u("1500648767791-00dcc994a43e", 300),
  p4: u("1438761681033-6461ffad8d80", 300),
  p5: u("1506794778202-cad84cf45f1d", 300),
};

const daysAgo = (n: number, h = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(h, 15, 0, 0);
  return d.toISOString();
};

const lead = (
  i: number,
  name: string,
  city: string,
  propertyType: string,
  monthlyBill: number,
  stage: LeadStage,
  value: number,
  source: string,
  ago: number,
  priority: Lead["priority"] = "Medium",
  notes: string[] = []
): Lead => ({
  id: `L-${1000 + i}`,
  name,
  email: `${name.split(" ")[0].toLowerCase()}@example.com`,
  phone: `+91 98${String(10000000 + i * 7919).slice(0, 8)}`,
  city,
  propertyType,
  monthlyBill,
  systemSize: `${Math.max(2, Math.round(monthlyBill / 950))} kW`,
  message:
    "Interested in rooftop solar. Please share a quote and subsidy details.",
  source,
  stage,
  value,
  priority,
  followUp: daysAgo(-((i % 5) + 1)).slice(0, 10),
  createdAt: daysAgo(ago, 9 + (i % 8)),
  notes: notes.map((text, k) => ({
    id: `N-${i}-${k}`,
    text,
    at: daysAgo(Math.max(0, ago - k - 1)),
  })),
});

export const seed: DB = {
  settings: {
    brandName: "Lumora",
    tagline: "Power, beautifully made.",
    phone: "+91 98765 43210",
    whatsapp: "919876543210",
    email: "hello@lumora.solar",
    address: "4th Floor, Sunrise Tower, Baner, Pune 411045",
    hours: "Mon – Sat · 9:00 – 19:00",
    accent: "#ff7a1a",
    accent2: "#ffc23d",
    footerNote:
      "MNRE-empanelled vendor · PM Surya Ghar registered · ISO 9001:2015",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
    x: "https://x.com",
  },
  intro: {
    enabled: true,
    oncePerSession: false,
    word: "Lumora",
    subtext: "Harvesting tomorrow's sunlight",
    duration: 2.8,
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Solutions", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Savings", href: "/calculator" },
    { label: "Journal", href: "/blog" },
    { label: "About", href: "/about" },
  ],
  hero: {
    eyebrow: "Rooftop solar · Batteries · EV charging",
    titleLine1: "Your roof,",
    titleLine2: "now a",
    highlight: "power plant.",
    subtitle:
      "Premium solar systems designed, installed and monitored end-to-end. Cut your electricity bill by up to 90% — with subsidy paperwork handled for you.",
    image: IMG.roofSunset,
    ctaPrimary: "Get free site survey",
    ctaSecondary: "Calculate savings",
    badge: "Up to ₹78,000 subsidy under PM Surya Ghar",
    variant: "sun",
  },
  statement: {
    text: "Every hour, the sun delivers more energy to Earth than humanity uses in a year. We simply help your home keep some of it.",
    image: IMG.texture,
  },
  about: {
    title: "We build power plants",
    highlight: "that look like design.",
    intro:
      "Lumora was founded in 2016 by two IIT engineers who believed going solar should feel as effortless as buying a phone. Today we're a 180-person team designing, installing and caring for systems across 40+ cities.",
    image: IMG.engineer,
    mission:
      "Put a clean, beautiful power plant on every Indian rooftop — and make the switch so simple it feels obvious.",
    values: [
      { title: "Obsessive engineering", description: "Every system is modelled in 3D with shadow analysis before a single panel is ordered." },
      { title: "Radical transparency", description: "Itemised quotes, real generation data and no fine print. Ever." },
      { title: "Lifetime ownership", description: "We monitor every system we install, for its entire 25-year life." },
      { title: "Craft in the details", description: "Concealed cabling, marine-grade structures and installations you're proud to show off." },
    ],
    team: [
      { name: "Aarav Kulkarni", role: "Co-founder & CEO", photo: IMG.p1 },
      { name: "Riya Shah", role: "Co-founder & CTO", photo: IMG.p2 },
      { name: "Dev Menon", role: "Head of Engineering", photo: IMG.p5 },
      { name: "Sara Thomas", role: "Customer Experience", photo: IMG.p4 },
    ],
  },
  partners: [
    "Waaree",
    "Adani Solar",
    "Tata Power",
    "Luminous",
    "Enphase",
    "SMA",
    "Huawei FusionSolar",
    "Vikram Solar",
    "Growatt",
  ],
  stats: [
    { value: 4200, suffix: "+", label: "Rooftops powered" },
    { value: 38, suffix: " MW", label: "Capacity installed" },
    { value: 62, suffix: "K t", label: "CO₂ offset every year" },
    { value: 4.9, suffix: "★", label: "Average customer rating", decimals: 1 },
  ],
  services: [
    {
      id: "residential",
      title: "Residential Rooftop",
      short: "On-grid systems for homes & villas.",
      description:
        "Net-metered rooftop systems that turn your terrace into a silent power plant. Designed with 3D shadow analysis and tier-1 panels.",
      image: IMG.modernHome,
      icon: "house",
      features: [
        "1 kW – 20 kW systems",
        "Subsidy & net-metering handled",
        "25-year performance warranty",
      ],
    },
    {
      id: "commercial",
      title: "Commercial & Industrial",
      short: "Cut operating costs at scale.",
      description:
        "From offices and hospitals to factories and warehouses — high-yield systems with accelerated depreciation benefits and OPEX/CAPEX models.",
      image: IMG.commercialRoof,
      icon: "factory",
      features: [
        "50 kW – 5 MW projects",
        "CAPEX, OPEX & PPA models",
        "40% accelerated depreciation",
      ],
    },
    {
      id: "storage",
      title: "Battery Storage",
      short: "Keep the lights on after sunset.",
      description:
        "Lithium-ion hybrid systems that store surplus daytime energy and switch over in milliseconds during outages.",
      image: IMG.powerLines,
      icon: "battery-charging",
      features: [
        "5 – 30 kWh LiFePO₄ packs",
        "Zero-lag backup",
        "10-year battery warranty",
      ],
    },
    {
      id: "ev",
      title: "EV Charging",
      short: "Drive on sunshine.",
      description:
        "Smart 7.4 kW and 22 kW chargers that prioritise solar surplus — so your car charges for practically free.",
      image: IMG.evCharge,
      icon: "plug-zap",
      features: [
        "Solar-first smart charging",
        "App-based scheduling",
        "Society & fleet solutions",
      ],
    },
    {
      id: "amc",
      title: "Care & Monitoring",
      short: "Peak output, every single day.",
      description:
        "Robotic cleaning, thermal drone inspections and 24×7 remote monitoring that flags issues before you notice them.",
      image: IMG.installer,
      icon: "shield-check",
      features: [
        "Live generation app",
        "Quarterly health checks",
        "48-hour service SLA",
      ],
    },
    {
      id: "farm",
      title: "Solar Farms & Pumps",
      short: "Agri-solar and ground-mount plants.",
      description:
        "Ground-mounted utility plants and PM-KUSUM solar pumps for farmers — engineered for harsh terrain and decades of output.",
      image: IMG.aerialFarm,
      icon: "sprout",
      features: [
        "PM-KUSUM approved",
        "Single-axis tracker option",
        "Turnkey EPC delivery",
      ],
    },
  ],
  process: [
    {
      title: "Free consultation",
      description:
        "Share your electricity bill. We study your consumption and roof using satellite imagery.",
      duration: "Day 1",
    },
    {
      title: "Site survey & 3D design",
      description:
        "Engineers visit, measure and model your roof in 3D with shadow analysis for maximum yield.",
      duration: "Day 2 – 4",
    },
    {
      title: "Proposal & subsidy",
      description:
        "Transparent quote with ROI breakdown. We file the PM Surya Ghar subsidy & DISCOM approvals.",
      duration: "Day 5 – 10",
    },
    {
      title: "Installation",
      description:
        "Certified crew installs in 1–3 days with marine-grade structures and clean cable routing.",
      duration: "Day 12 – 15",
    },
    {
      title: "Net metering & go live",
      description:
        "Bi-directional meter installed, system commissioned and your monitoring app goes live.",
      duration: "Day 20 – 30",
    },
  ],
  projects: [
    {
      id: "p1",
      title: "Kalyani Villa",
      location: "Koregaon Park, Pune",
      capacity: "12 kW",
      category: "Residential",
      year: "2026",
      image: IMG.villa,
      savings: "₹1.6L / year",
    },
    {
      id: "p2",
      title: "Shree Textiles",
      location: "Bhiwandi, Maharashtra",
      capacity: "850 kW",
      category: "Industrial",
      year: "2025",
      image: IMG.commercialRoof,
      savings: "₹1.1Cr / year",
    },
    {
      id: "p3",
      title: "Green Acres Farm",
      location: "Nashik, Maharashtra",
      capacity: "2.4 MW",
      category: "Solar Farm",
      year: "2025",
      image: IMG.aerialFarm,
      savings: "3.5M units / year",
    },
    {
      id: "p4",
      title: "Orchid Heights Society",
      location: "Whitefield, Bengaluru",
      capacity: "120 kW",
      category: "Housing Society",
      year: "2026",
      image: IMG.fieldClouds,
      savings: "₹14L / year",
    },
    {
      id: "p5",
      title: "Mehta Residence",
      location: "Vadodara, Gujarat",
      capacity: "6 kW + 10 kWh",
      category: "Hybrid",
      year: "2026",
      image: IMG.modernHome,
      savings: "₹78K / year",
    },
    {
      id: "p6",
      title: "Apex Logistics Park",
      location: "Chakan, Pune",
      capacity: "1.2 MW",
      category: "Commercial",
      year: "2024",
      image: IMG.bright,
      savings: "₹1.5Cr / year",
    },
  ],
  packages: [
    {
      id: "k1",
      name: "Spark",
      capacity: "3 kW",
      price: "₹1,89,000",
      priceNote: "≈ ₹1,11,000 after subsidy",
      ideal: "2 BHK · bill up to ₹3,000",
      features: [
        "6 × 545W mono-PERC panels",
        "3 kW on-grid inverter",
        "Net-metering & subsidy filing",
        "5-year free maintenance",
      ],
      featured: false,
    },
    {
      id: "k2",
      name: "Radiance",
      capacity: "5 kW",
      price: "₹2,95,000",
      priceNote: "≈ ₹2,17,000 after subsidy",
      ideal: "3–4 BHK · bill up to ₹6,000",
      features: [
        "10 × 550W TOPCon bifacial panels",
        "5 kW smart inverter with Wi-Fi",
        "Live monitoring app",
        "Robotic cleaning add-on",
        "10-year free maintenance",
      ],
      featured: true,
    },
    {
      id: "k3",
      name: "Eclipse",
      capacity: "10 kW + Battery",
      price: "₹6,40,000",
      priceNote: "Hybrid with 10 kWh LiFePO₄",
      ideal: "Villas · bill ₹10,000+",
      features: [
        "18 × 575W TOPCon panels",
        "10 kW hybrid inverter",
        "10 kWh battery backup",
        "EV-charger ready",
        "Priority 24-hour service",
      ],
      featured: false,
    },
  ],
  testimonials: [
    {
      id: "t1",
      name: "Anjali Deshpande",
      role: "Homeowner, Pune",
      quote:
        "Our bill went from ₹7,400 to ₹380. The team handled everything — I just watched the meter run backwards on the app.",
      avatar: IMG.p2,
      rating: 5,
    },
    {
      id: "t2",
      name: "Rajiv Malhotra",
      role: "MD, Shree Textiles",
      quote:
        "850 kW commissioned in 41 days without a single hour of production downtime. Payback is tracking at under 3.5 years.",
      avatar: IMG.p1,
      rating: 5,
    },
    {
      id: "t3",
      name: "Neha Iyer",
      role: "Secretary, Orchid Heights",
      quote:
        "Common-area electricity is now virtually free for 240 families. Their society-meeting presentation sealed the deal.",
      avatar: IMG.p4,
      rating: 5,
    },
    {
      id: "t4",
      name: "Karan Mehta",
      role: "Homeowner, Vadodara",
      quote:
        "The hybrid battery means our power cuts simply don't exist anymore. Installation crew was spotless and on time.",
      avatar: IMG.p3,
      rating: 5,
    },
  ],
  faqs: [
    {
      q: "How much can I really save?",
      a: "Most homes save 70–90% on their electricity bill. A 5 kW system generates roughly 600 units a month — at ₹8/unit that is about ₹4,800 saved every month.",
    },
    {
      q: "What subsidy is available?",
      a: "Under PM Surya Ghar Muft Bijli Yojana, residential systems get ₹30,000/kW for the first 2 kW and ₹18,000 for the 3rd kW — up to ₹78,000. We file the entire application for you.",
    },
    {
      q: "What happens on cloudy days or at night?",
      a: "On-grid systems draw from the grid when solar output is low and export surplus during the day — net metering balances it out. Add a battery for true backup.",
    },
    {
      q: "How long does installation take?",
      a: "Physical installation takes 1–3 days. The full journey including approvals and net-meter installation typically completes in 3–4 weeks.",
    },
    {
      q: "Do you offer EMI or financing?",
      a: "Yes — 0% down payment plans with partner banks, EMIs from 12 to 84 months, and solar loans at 7% interest for eligible homeowners.",
    },
    {
      q: "What warranties do I get?",
      a: "25-year linear performance warranty on panels, 10 years on inverters, 10 years on batteries and a 5-year workmanship warranty from us.",
    },
  ],
  calculator: {
    tariff: 8,
    unitsPerKw: 120,
    costPerKw: 60000,
    subsidyCap: 78000,
    subsidyPerKw: 30000,
    co2PerUnit: 0.82,
    panelWattage: 550,
  },
  sections: {
    marquee: true,
    statement: true,
    services: true,
    calculator: true,
    process: true,
    projects: true,
    packages: true,
    testimonials: true,
    faq: true,
    blog: true,
    cta: true,
  },
  posts: [
    {
      id: "b1",
      slug: "pm-surya-ghar-subsidy-guide",
      title: "The complete guide to PM Surya Ghar subsidy in 2026",
      excerpt:
        "Eligibility, documents, timelines and the exact amount you can claim — explained in plain language.",
      cover: IMG.roofSunset,
      category: "Subsidy",
      author: "Team Lumora",
      readTime: "6 min",
      date: "2026-10-12",
      published: true,
      content: `PM Surya Ghar Muft Bijli Yojana is the largest rooftop solar programme in the world. Here's everything you need to know before applying.

## Who is eligible?

Any Indian household with a valid electricity connection and a roof suitable for solar panels can apply. The house must not have availed any other solar subsidy.

## How much subsidy will I get?

- ₹30,000 per kW for the first 2 kW
- ₹18,000 for the 3rd kW
- Maximum subsidy capped at ₹78,000

## Documents you need

- Latest electricity bill
- Aadhaar & PAN card
- Bank account details (cancelled cheque)
- Roof ownership proof

## How long does it take?

Once your system is installed and the net meter is commissioned, subsidy is credited directly to your bank account — typically within 30 days. Our team files and tracks the entire application for you.`,
    },
    {
      slug: "on-grid-vs-hybrid",
      id: "b2",
      title: "On-grid vs hybrid: which solar system fits your home?",
      excerpt:
        "Battery or no battery? We break down cost, savings and backup so you can choose with confidence.",
      cover: IMG.powerLines,
      category: "Guides",
      author: "Aarav Kulkarni",
      readTime: "5 min",
      date: "2026-09-28",
      published: true,
      content: `Choosing between an on-grid and a hybrid system comes down to one question: how often does your power go out?

## On-grid systems

The most affordable option. Your panels feed power to your home and export surplus to the grid through net metering. When the grid is down, the system shuts off for safety.

## Hybrid systems

A hybrid inverter plus a lithium battery stores surplus energy. During outages, your essentials keep running seamlessly.

## Our recommendation

- City homes with reliable grid → On-grid
- Frequent outages or work-from-home → Hybrid
- Planning an EV soon → Hybrid with EV-ready inverter`,
    },
    {
      id: "b3",
      slug: "solar-panel-cleaning",
      title: "Why clean panels produce up to 25% more power",
      excerpt:
        "Dust is the silent thief of solar output. Here's a simple maintenance routine that pays for itself.",
      cover: IMG.closeUp,
      category: "Maintenance",
      author: "Team Lumora",
      readTime: "4 min",
      date: "2026-09-04",
      published: true,
      content: `In dusty Indian cities, panels can lose 15–25% of their output within a month without cleaning.

## How often should you clean?

Every 2–3 weeks in dry months and once a month during monsoon is ideal.

## Do's and don'ts

- Clean early morning, before panels heat up
- Use soft water and a microfibre mop
- Never use detergents or high-pressure jets
- Avoid walking on panels

Our Care plans include robotic cleaning and remote performance alerts so you never lose a unit.`,
    },
    {
      id: "b4",
      slug: "solar-for-factories",
      title: "How factories are cutting power costs by 60% with solar",
      excerpt:
        "Accelerated depreciation, open access and PPAs — the playbook for industrial solar.",
      cover: IMG.industrial,
      category: "Commercial",
      author: "Riya Shah",
      readTime: "7 min",
      date: "2026-08-17",
      published: true,
      content: `Industrial tariffs in India often exceed ₹10 per unit. Solar generates power at under ₹3.5 per unit for 25 years.

## Three ways to go solar

- CAPEX: own the plant, claim 40% accelerated depreciation
- OPEX / RESCO: zero investment, pay per unit consumed
- Open access: buy solar power from an off-site plant

## The numbers

A 500 kW rooftop plant typically pays for itself in 3–4 years and delivers over ₹10 crore in savings across its life.`,
    },
  ],
  leads: [
    lead(1, "Aditya Rao", "Pune", "Independent House", 6200, "New", 295000, "Website", 0, "High"),
    lead(2, "Priya Nair", "Bengaluru", "Apartment", 3400, "New", 189000, "Calculator", 0),
    lead(3, "Sanjay Gupta", "Indore", "Factory", 185000, "Contacted", 4200000, "Referral", 1, "High", ["Called — wants OPEX model comparison."]),
    lead(4, "Meera Joshi", "Nashik", "Villa", 11200, "Site Survey", 640000, "Instagram", 2, "High", ["Survey booked for Saturday 11 AM.", "Roof is RCC, south facing — excellent."]),
    lead(5, "Farhan Sheikh", "Mumbai", "Housing Society", 48000, "Proposal", 2100000, "Website", 4, "Medium", ["Presenting at society AGM next week."]),
    lead(6, "Kavya Reddy", "Hyderabad", "Independent House", 5200, "Won", 295000, "Google Ads", 6, "Medium", ["Advance received. Installation scheduled."]),
    lead(7, "Rohit Verma", "Jaipur", "Commercial", 72000, "Contacted", 1500000, "Website", 3),
    lead(8, "Sneha Patil", "Pune", "Apartment", 2800, "Lost", 120000, "Calculator", 9, "Low", ["Society NOC not granted."]),
    lead(9, "Vikram Singh", "Lucknow", "Villa", 9800, "Proposal", 520000, "Referral", 5, "High"),
    lead(10, "Ishita Banerjee", "Kolkata", "Independent House", 4100, "Site Survey", 230000, "Instagram", 3),
    lead(11, "Arjun Menon", "Kochi", "Independent House", 3900, "Won", 215000, "Website", 12),
    lead(12, "Pooja Agarwal", "Ahmedabad", "Factory", 260000, "Won", 6800000, "Referral", 18, "High", ["PO signed. 600 kW."]),
    lead(13, "Nikhil Jain", "Surat", "Commercial", 54000, "New", 1100000, "Google Ads", 1),
    lead(14, "Tanvi Kulkarni", "Pune", "Villa", 8700, "Contacted", 470000, "Website", 2),
  ],
};
