import { EMAIL, LINKEDIN, PHONE } from "@/lib/content";

export default function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Christian Ada",
    jobTitle: "Junior Website Developer",
    description:
      "WordPress developer with 5+ years’ experience. Currently Junior Website Developer at The Web Guys NZ. 60+ sites, CRM and payment integrations, and performance work that has cut load times by up to 30%.",
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

  const service = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Christian Ada — WordPress development",
    description:
      "WordPress builds, CRM and payment integrations, performance work and QA. Based in Auckland, New Zealand.",
    url: "https://christian-ada.vercel.app",
    email: EMAIL,
    telephone: PHONE,
    areaServed: {
      "@type": "City",
      name: "Auckland",
      containedInPlace: {
        "@type": "Country",
        name: "New Zealand",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Auckland",
      addressRegion: "Auckland",
      addressCountry: "NZ",
    },
    founder: {
      "@type": "Person",
      name: "Christian Ada",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
    </>
  );
}
