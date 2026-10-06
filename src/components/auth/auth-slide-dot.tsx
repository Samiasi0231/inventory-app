import { cn } from "@/lib/utils";
 
interface AuthSlideDotsProps {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  className?: string;
}
 
export function AuthSlideDots({ count, active, onSelect, className }: AuthSlideDotsProps) {
  if (count < 2) return null;
  return (
    <div className={cn("flex gap-1.5", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Show slide ${index + 1}`}
          aria-current={index === active}
          className={cn(
            "h-1.5 rounded-full bg-white transition-all",
            index === active ? "w-6 opacity-100" : "w-1.5 opacity-50",
          )}
        />
      ))}
    </div>
  );
}