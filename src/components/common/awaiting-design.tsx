import { PencilRulerIcon } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";

interface AwaitingDesignProps {
  title: string;
  description?: string;
  reason?: "designers" | "build";
}

export function AwaitingDesign({ title, description, reason = "designers" }: AwaitingDesignProps) {
  return (
    <div className="rounded-xl bg-surface p-5">
      <EmptyState
        icon={PencilRulerIcon}
        title={title}
        description={
          description ??
          (reason === "designers"
            ? "Waiting for designers to complete."
            : "This screen has been designed but isn't built yet.")
        }
      />
    </div>
  );
}
