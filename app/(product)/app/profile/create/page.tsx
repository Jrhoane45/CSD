"use client";

import { useProfile } from "@/lib/useProfile";
import { OnboardingFlow } from "@/components/app/OnboardingFlow";

export default function CreateProfilePage() {
  const { profile, ready } = useProfile();
  // Acts as create (no profile) or edit (prefilled from the saved profile).
  if (!ready) return null;
  return <OnboardingFlow initial={profile} />;
}
