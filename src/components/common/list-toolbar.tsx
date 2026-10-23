import type { ReactNode } from "react";
import { Search } from "lucide-react";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  placeholder: string;
  /** Filter controls shown on the right */
  children?: ReactNode;
}

export function ListToolbar({
  search,
  onSearchChange,
  placeholder,
  children,
}: Props) {
  return (
    <div className="mb-4 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full max-w-[633px]">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          aria-label={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="h-[42px] w-full rounded-lg border border-border bg-transparent pl-10 pr-3 text-base text-ink-1 outline-none placeholder:text-ink-4 focus:border-primary"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
