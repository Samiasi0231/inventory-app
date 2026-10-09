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
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="relative w-full max-w-[400px]">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="h-9 w-full rounded-md border border-gray-200 pl-9 pr-3 text-xs outline-none focus:border-emerald-600"
        />
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
