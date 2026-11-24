export type Project = {
  title: string
  slug: string
  logo: string
  plate: "light" | "dark"
  color: string
  alt: string
  summary: string
  role: string
  tech: string[]
  result: string
  featured?: boolean
};

export const projects: Project[] = [
  {
    title: "Prominent",
    slug: "prominent",
    logo: "/projects/prominent.png",
    plate: "light",
    color: "#1F6B3A",
    alt: "Prominent logo on a light plate — WPBakery WordPress site",
    summary: "WPBakery WordPress site for Prominent, with Gravity Forms, Yoast SEO and WP Rocket caching.",
    role: "WordPress developer",
    tech: ["WordPress", "WPBakery", "Gravity Forms", "WP Rocket"],
    result: "WordPress site with forms, SEO and caching on LiteSpeed.",
    featured: true,
  },
  {
    title: "Lucky 13 Fitness",
    slug: "lucky-13-fitness",
    logo: "/projects/lucky13-fitness.png",
    plate: "light",
    color: "#2E7D32",
    alt: "Lucky 13 Fitness logo on a light plate — Divi WordPress gym site",
    summary: "Divi WordPress site for Lucky 13 Fitness, with Rank Math SEO and a layout that works on phones.",
    role: "WordPress developer",
    tech: ["WordPress", "Divi", "Rank Math", "PHP"],
    result: "Fitness site on Divi with Rank Math in production.",
    featured: true,
  },
  {
    title: "Brancourts",
    slug: "brancourts",
    logo: "/projects/brancourts.png",
    plate: "light",
    color: "#1B3A6B",
    alt: "Brancourts logo on a light plate — Kinsta WordPress site",
    summary: "WordPress site for Brancourts, hosted on Kinsta with Cloudflare.",
    role: "WordPress developer",
    tech: ["WordPress", "Kinsta", "PHP", "MySQL"],
    result: "Production WordPress site running on Kinsta.",
    featured: true,
  },
  {
    title: "RMA Sport",
    slug: "rma-sport",
    logo: "/projects/rma-sport.png",
    plate: "light",
    color: "#C8102E",
    alt: "RMA Sport logo on a light plate — WPBakery sports WordPress site",
    summary: "WPBakery WordPress site for RMA Sport, with Gravity Forms, WP Rocket and PayU payments.",
    role: "WordPress developer",
    tech: ["WordPress", "WPBakery", "Gravity Forms", "PayU"],
    result: "Sports site with forms, caching and PayU checkout.",
  },
  {
    title: "Blue Diamond Solutions",
    slug: "blue-diamond-solutions",
    logo: "/projects/solutions-blue-diamond.webp",
    plate: "dark",
    color: "#3D7CFF",
    alt: "Blue Diamond Solutions logo on a dark plate — WordPress and BigCommerce site",
    summary: "WordPress site for Blue Diamond Solutions, connected to BigCommerce and HubSpot.",
    role: "WordPress developer",
    tech: ["WordPress", "BigCommerce", "HubSpot", "PHP"],
    result: "Machinery site with ecommerce and HubSpot in production.",
  },
  {
    title: "Clinical Assessor",
    slug: "clinical-assessor",
    logo: "/projects/clinical-assessor.png",
    plate: "light",
    color: "#2B6B8A",
    alt: "Clinical Assessor logo on a light plate — WPBakery healthcare WordPress site",
    summary: "WPBakery WordPress site for Clinical Assessor, with Gravity Forms, Yoast SEO and Google Maps.",
    role: "WordPress developer",
    tech: ["WordPress", "WPBakery", "Gravity Forms", "Google Maps"],
    result: "Clinical services site with enquiry forms and maps.",
  },
  {
    title: "Team Kids",
    slug: "team-kids",
    logo: "/projects/team-kids.png",
    plate: "light",
    color: "#1A1A1A",
    alt: "Team Kids logo on a light plate — WPBakery education WordPress site",
    summary: "WPBakery WordPress site for Team Kids, with Freshworks CRM and Yoast SEO.",
    role: "WordPress developer",
    tech: ["WordPress", "WPBakery", "Freshworks CRM", "Yoast SEO"],
    result: "Education site with CRM and SEO in production.",
  },
  {
    title: "Dek Designs",
    slug: "dek-designs",
    logo: "/projects/dek-designs.png",
    plate: "light",
    color: "#16325C",
    alt: "Dek Designs logo on a light plate — WordPress studio site with Ecwid and Stripe",
    summary: "WordPress site for Dek Designs with Ecwid ecommerce, Stripe payments and GSAP motion.",
    role: "WordPress developer",
    tech: ["WordPress", "Ecwid", "Stripe", "GSAP"],
    result: "Design-studio site with shop, payments and motion.",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const jobs = [
  {
    dates: "May 2026 — Present",
    company: "The Web Guys NZ",
    place: "Parnell, Auckland",
    role: "Junior Website Developer",
    note: "WordPress builds, custom functionality, third-party integrations, and cross-browser QA before launch.",
  },
  {
    dates: "Early 2026",
    company: "The Web Guys NZ",
    place: "Parnell, Auckland",
    role: "Website Developer Intern",
    note: "Internship on live client work — WordPress builds, custom functionality, third-party integrations, and cross-browser QA.",
  },
  {
    dates: "Oct 2025 — Feb 2026",
    company: "Revibe Digital",
    place: "Taupo · Remote",
    role: "Contract Website Developer",
    note: "Part-time WordPress customisation for client sites, focused on responsiveness and performance.",
  },
  {
    dates: "Jul 2021 — Apr 2025",
    company: "Sites at Scale",
    place: "Dumaguete, Philippines",
    role: "Website Technician / Developer",
    note: "Built and maintained 60+ WordPress sites. Integrated CRM tools, payment gateways and plugins. Cut load times by up to 30% with caching, image optimisation and minification.",
  },
];

export const education = [
  { school: "Auckland Institute of Studies", cred: "Postgraduate Diploma in Information Technology", when: "2025 — 2026 · Auckland" },
  { school: "Foundation University", cred: "Bachelor of Science in Information Technology", when: "2015 — 2020 · Dumaguete" },
];

export const milestones = [
  { title: "Delivery at Scale", text: "60+ WordPress websites for different businesses — CRM tools, payment gateways and third-party plugins included.", year: "2021" },
  { title: "Performance Work", text: "Cut load times by up to 30% with image optimisation, caching and code minification.", year: "2023" },
  { title: "Hired in Auckland", text: "Junior Developer at The Web Guys NZ, Parnell.", year: "2026" },
];

export const stats = [
  { value: 60, suffix: "+", label: "WordPress Sites" },
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 8, suffix: "", label: "Featured Brands" },
];

export const proofStatements = [
  { kicker: "01", line: "60+ WordPress sites shipped from brief to launch." },
  { kicker: "02", line: "Load times cut by up to 30% on production sites." },
  { kicker: "03", line: "Junior Developer at The Web Guys NZ." },
];

export const skillGroups = {
  WordPress: ["WordPress", "PHP", "WooCommerce", "Elementor", "ACF", "MySQL", "Caching", "CRM Integrations", "Payment Gateways"],
  "Front-end": ["HTML", "CSS", "JavaScript", "React", "Next.js", "TypeScript", "Git", "QA Testing"],
  Design: ["Figma", "Photoshop"],
};

export const navItems = ["About", "Work", "Experience", "Skills", "Contact"] as const;

export const EMAIL = "mahusaycada98@gmail.com";
export const PHONE = "+64278907055";
export const PHONE_LABEL = "+64 27 890 7055";
export const LINKEDIN = "https://www.linkedin.com/in/christian-ada/";
export const BEHANCE = "https://www.behance.net/christian-ada";

export const services = [
  {
    num: "01",
    title: "WordPress builds",
    text: "Custom sites from brief to launch — the same work behind 60+ live websites for different businesses.",
  },
  {
    num: "02",
    title: "Integrations",
    text: "CRM tools, payment gateways, and third-party plugins wired in so the site actually runs the business.",
  },
  {
    num: "03",
    title: "Performance",
    text: "Caching, image optimisation and minification. Load times cut by up to 30% on production sites.",
  },
  {
    num: "04",
    title: "QA before launch",
    text: "Cross-browser and device checks so what you approve is what ships — the same process used at The Web Guys NZ.",
  },
];

export const processSteps = [
  { num: "01", title: "Brief", text: "We map the business, pages, and integrations before a line of theme code." },
  { num: "02", title: "Build", text: "WordPress, custom functionality, CRM and payments, then performance work." },
  { num: "03", title: "Launch", text: "QA across browsers and devices, then handoff." },
];

export const faqs = [
  {
    q: "Are you open to roles in Auckland?",
    a: "Yes. Open to WordPress and web development roles in Auckland, currently Junior Website Developer at The Web Guys NZ in Parnell.",
  },
  {
    q: "Do you take freelance builds?",
    a: "Yes. Happy to talk about freelance WordPress and web builds for small businesses, alongside full-time roles.",
  },
  {
    q: "What do you actually ship?",
    a: "WordPress sites with custom functionality, CRM and payment integrations, caching and image optimisation, and QA before launch. 60+ sites shipped; load times cut by up to 30%.",
  },
  {
    q: "Where are you based?",
    a: "Sandringham, Auckland. NZ time. Phone and email are on this page.",
  },
];
