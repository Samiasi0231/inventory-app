import { PencilRulerIcon } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { SettingsShell } from "./settings-shell";
import { SettingsCard } from "./settings-card";

interface SettingsPlaceholderProps {
  title: string;
  description: string;
  reason: "designers" | "build";
}

export function SettingsPlaceholder({ title, description, reason }: SettingsPlaceholderProps) {
  return (
    <SettingsShell title={title} description={description}>
      <SettingsCard>
        <EmptyState
          icon={PencilRulerIcon}
          title={title}
          description={
            reason === "designers"
              ? "Waiting for designers to complete."
              : "This screen has been designed but isn't built yet."
          }
        />
      </SettingsCard>
    </SettingsShell>
  );
}
