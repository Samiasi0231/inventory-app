
import Image from "next/image";
import { cn } from "@/lib/utils";
import logo from "@/assets/images/riin-logo.svg";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex flex-col items-start gap-0.5", className)}
      aria-label="Riinox"
    >
      <Image
        src={logo}
        alt="Riinox"
        width={32}
        height={32}
        className="size-7 object-contain"
        priority
      />
    </div>
  );
}