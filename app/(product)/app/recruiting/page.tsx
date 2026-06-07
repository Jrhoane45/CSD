import type { Metadata } from "next";
import { RecruitingHub } from "@/components/app/RecruitingHub";

export const metadata: Metadata = {
  title: "Recruiting Hub",
  description: "A college-pathway roadmap — timeline, target schools, and recruiting advisers.",
};

export default function RecruitingPage() {
  return <RecruitingHub />;
}
