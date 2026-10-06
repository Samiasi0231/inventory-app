import { Link } from "react-router-dom";
 
interface AuthFooterLinkProps {
  prompt: string;
  linkLabel: string;
  to: string;
}
 
export function AuthFooterLink({ prompt, linkLabel, to }: AuthFooterLinkProps) {
  return (
    <p className="mt-8 text-center text-xs text-neutral-600">
      {prompt}{" "}
      <Link to={to} className="font-semibold text-neutral-800 hover:underline">
        {linkLabel}
      </Link>
    </p>
  );
}