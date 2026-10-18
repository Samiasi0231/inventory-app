"use client";

import Link from "next/link";
import {
  ChevronRightIcon,
  MapPinIcon,
  ShieldCheckIcon,
  TriangleAlertIcon,
  UsersIcon,
} from "lucide-react";
import { SecondaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { SettingsShell } from "@/features/settings/components/settings-shell";
import { settingsService } from "@/features/settings/settings.service";
import { describeCondition } from "@/features/settings/approval-rules";
import type { ApprovalRule } from "@/features/settings/types";

function RuleFacts({ rule }: { rule: ApprovalRule }) {
  const facts = [
    { icon: ShieldCheckIcon, label: "Condition", value: describeCondition(rule) },
    { icon: MapPinIcon, label: "Applies to", value: rule.appliesTo === "All" ? "All locations" : rule.appliesTo },
    { icon: UsersIcon, label: "Approver", value: rule.approver },
  ];

  return (
    <dl className="grid gap-4 border-t border-border/60 pt-4 sm:grid-cols-3">
      {facts.map((fact) => (
        <div key={fact.label} className="min-w-0">
          <dt className="flex items-center gap-2 text-sm text-ink-3">
            <fact.icon className="size-4 shrink-0" />
            {fact.label}
          </dt>
          <dd className="mt-1 text-sm text-ink-1">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function ApprovalRulesPage() {
  const { data, loading, error, refetch } = useAsyncResource(
    "approval-rules",
    () => settingsService.listApprovalRules(),
    "We couldn't load your approval rules. Please try again.",
  );

  const rules = data ?? [];

  return (
    <SettingsShell
      title="Approval Rules"
      description="Define which business actions require approval and who can approve them"
    >
      {error ? (
        <div className="rounded-xl bg-surface p-6">
          <EmptyState
            icon={TriangleAlertIcon}
            title="We couldn't load your approval rules"
            description={error}
            action={<SecondaryButton onClick={refetch}>Try again</SecondaryButton>}
          />
        </div>
      ) : loading ? (
        <div className="flex flex-col gap-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-[150px] rounded-xl" />
          ))}
        </div>
      ) : rules.length === 0 ? (
        <div className="rounded-xl bg-surface p-6">
          <EmptyState
            icon={ShieldCheckIcon}
            title="No approval rules yet"
            description="Actions that need sign-off will be listed here."
          />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {rules.map((rule) => (
            <Link
              key={rule.id}
              href={`/settings/approval-rules/${rule.id}`}
              className="group flex flex-col gap-4 rounded-xl bg-surface p-5 transition-colors hover:bg-surface-muted/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-ink-1">{rule.name}</h2>
                  <p className="mt-1 text-sm text-ink-3">{rule.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge variant={rule.enabled ? "success" : "neutral"}>
                    {rule.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                  <ChevronRightIcon className="size-5 text-ink-3 transition-colors group-hover:text-ink-1" />
                </div>
              </div>

              <RuleFacts rule={rule} />
            </Link>
          ))}
        </div>
      )}
    </SettingsShell>
  );
}
