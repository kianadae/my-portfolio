import { EMAIL, LINKEDIN, PHONE } from "@/lib/content";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Christian Ada",
    jobTitle: "Junior Website Developer",
    description:
      "WordPress developer with 5+ years’ experience. Currently Junior Website Developer at The Web Guys NZ. 40+ sites, CRM and payment integrations, and performance work that has cut load times by up to 30%.",
    email: EMAIL,
    telephone: PHONE,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Auckland",
      addressRegion: "Auckland",
      addressCountry: "NZ",
    },
    worksFor: {
      "@type": "Organization",
      name: "The Web Guys NZ",
    },
    sameAs: [LINKEDIN, "https://www.behance.net/christian-ada"],
    knowsAbout: ["WordPress", "PHP", "WooCommerce", "JavaScript", "React", "Next.js", "Performance", "QA"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
