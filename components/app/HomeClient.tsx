"use client";

import { useProfile } from "@/lib/useProfile";
import { useRole } from "@/lib/useRole";
import { AthleteHome } from "@/components/app/AthleteHome";
import { StartHub } from "@/components/app/StartHub";

/**
 * The app landing. A signed-in family (Parent role with a profile) gets a
 * personalized dashboard; everyone else gets the "where to start" hub.
 */
export function HomeClient() {
  const { profile, ready } = useProfile();
  const role = useRole();

  if (!ready) return <div className="min-h-[60vh]" />;
  if (role === "parent" && profile) return <AthleteHome profile={profile} />;
  return <StartHub />;
}
