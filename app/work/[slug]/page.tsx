import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/work/CaseStudy";
import { featuredProjects, getProjectBySlug } from "@/lib/content";

export function generateStaticParams() {
  return featuredProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project?.caseStudy) return { title: "Work — Christian Ada" };
  return {
    title: `${project.title} — Christian Ada`,
    description: project.summary,
  };
}

export default async function WorkCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project?.caseStudy) notFound();
  return <CaseStudy project={project} />;
}
