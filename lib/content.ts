export const projects = [
  { title: "Prominent", logo: "/projects/prominent.png", plate: "light" as const },
  { title: "Lucky 13 Fitness", logo: "/projects/lucky13-fitness.png", plate: "light" as const },
  { title: "Brancourts", logo: "/projects/brancourts.png", plate: "light" as const },
  { title: "RMA Sport", logo: "/projects/rma-sport.png", plate: "light" as const },
  { title: "Blue Diamond Solutions", logo: "/projects/solutions-blue-diamond.webp", plate: "dark" as const },
  { title: "Clinical Assessor", logo: "/projects/clinical-assessor.png", plate: "light" as const },
  { title: "Team Kids", logo: "/projects/team-kids.png", plate: "light" as const },
  { title: "Dek Designs", logo: "/projects/dek-designs.png", plate: "light" as const },
];

export const jobs = [
  {
    dates: "May 2026 — Present",
    company: "The Web Guys NZ",
    place: "Parnell, Auckland",
    role: "Junior Website Developer",
    note: "Hired from internship. WordPress builds, custom functionality, third-party integrations, and cross-browser QA before launch.",
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
    note: "Built and maintained 40+ WordPress sites. Integrated CRM tools, payment gateways and plugins. Cut load times by up to 30% with caching, image optimisation and minification.",
  },
];

export const education = [
  { school: "Auckland Institute of Studies", cred: "Postgraduate Diploma in Information Technology", when: "2025 — 2026 · Auckland" },
  { school: "Foundation University", cred: "Bachelor of Science in Information Technology", when: "2015 — 2020 · Dumaguete" },
];

export const milestones = [
  { title: "Delivery at Scale", text: "40+ WordPress websites for different businesses — CRM tools, payment gateways and third-party plugins included.", year: "2021" },
  { title: "Performance Work", text: "Cut load times by up to 30% with image optimisation, caching and code minification.", year: "2023" },
  { title: "Hired in Auckland", text: "Converted from internship to Junior Website Developer at The Web Guys NZ, Parnell.", year: "2026" },
];

export const stats = [
  { value: 40, suffix: "+", label: "WordPress Sites" },
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 30, suffix: "%", label: "Faster Load Times" },
  { value: 8, suffix: "", label: "Featured Brands" },
];

export const skillGroups = {
  WordPress: ["WordPress", "PHP", "WooCommerce", "Elementor", "ACF", "MySQL", "Caching", "CRM Integrations", "Payment Gateways"],
  "Front-end": ["HTML", "CSS", "JavaScript", "React", "Next.js", "TypeScript", "Git", "QA Testing"],
  Design: ["Figma", "Photoshop"],
};

export const navItems = ["About", "Work", "Experience", "Skills", "Contact"] as const;
