import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
 
interface StatusScreenProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** "badge": white icon on a green tile. "plain": large green outline icon. */
  iconStyle?: "badge" | "plain";
  /** Action area under the text, e.g. a button. */
  children?: ReactNode;
}
 
/** Full-screen centered confirmation (verified, success, etc.). */
export function StatusScreen({ icon: Icon, title, description, iconStyle = "badge", children }: StatusScreenProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6">
      <div className="flex w-full flex-col items-center text-center" role="status">
        {iconStyle === "badge" ? (
          <span className="mb-4 grid size-14 place-items-center rounded-xl bg-brand-500 text-white">
            <Icon className="size-7" aria-hidden />
          </span>
        ) : (
          <Icon className="mb-6 size-24 text-brand-500" strokeWidth={1.75} aria-hidden />
        )}
        <h1 className="text-2xl font-bold text-neutral-800">{title}</h1>
        {description && <p className="mt-2 text-sm text-neutral-600">{description}</p>}
        {children}
      </div>
    </main>
  );
}