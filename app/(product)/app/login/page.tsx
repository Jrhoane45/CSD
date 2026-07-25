import type { Metadata } from "next";
import { LoginForm } from "@/components/app/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Club Sports Direct.",
};

export default function LoginPage() {
  return <LoginForm />;
}
