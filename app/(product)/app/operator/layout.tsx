import { OperatorGate } from "@/components/app/OperatorGate";

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  return <OperatorGate>{children}</OperatorGate>;
}
