import type { Metadata } from "next";
import PlaygroundPage from "@/components/playground/PlaygroundPage";

export const metadata: Metadata = {
  title: "Playgrounds — Christian Ada",
  description: "Interactive motion studies: scramble type, magnetic field, kinetic letters, a 3D brand orbit, and a cursor lens.",
};

export default function Page() {
  return <PlaygroundPage />;
}
