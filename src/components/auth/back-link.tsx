import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
 
interface BackLinkProps {
  to: string;
  children: ReactNode;
}
 
export function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="mb-6 inline-flex items-center gap-1 text-xs text-neutral-700 hover:text-neutral-900"
    >
      <ChevronLeft className="size-3.5" aria-hidden />
      {children}
    </Link>
  );
}