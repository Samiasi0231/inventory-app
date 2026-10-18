"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, TriangleAlertIcon } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { Field, SelectInput, TextInput } from "@/components/form/app-fields";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useDraft } from "@/hooks/use-draft";
import { SettingsShell } from "@/features/settings/components/settings-shell";
import { SettingsCard } from "@/features/settings/components/settings-card";
import { settingsService } from "@/features/settings/settings.service";
import { thresholdLabel } from "@/features/settings/approval-rules";
import { APPROVAL_LOCATIONS, APPROVER_OPTIONS } from "@/features/settings/types";

export default function ApprovalRuleEditPage({ ruleId }: { ruleId: string }) {
  const router = useRouter();
  const toast = useToast();

  const { data, loading, error, refetch } = useAsyncResource(
    `approval-rule::${ruleId}`,
    () => settingsService.getApprovalRule(ruleId),
    "We couldn't load this rule. Please try again.",
  );

  const { value: rule, set } = useDraft(data);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!rule) return;
    setSaving(true);
    try {
      await settingsService.updateApprovalRule(rule.id, rule);
      toast.add({ type: "success", title: "Rule updated" });
      router.push("/settings/approval-rules");
    } catch {
      toast.add({ type: "error", title: "Couldn't update this rule" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingsShell
      title="Approval Rules"
      description="Define which business actions require approval and who can approve them"
    >
      <SettingsCard>
        {error || (!loading && !rule) ? (
          <EmptyState
            icon={TriangleAlertIcon}
            title="We couldn't load this rule"
            description={error ?? "This rule no longer exists."}
            action={
              error ? (
                <SecondaryButton onClick={refetch}>Try again</SecondaryButton>
              ) : (
                <SecondaryButton onClick={() => router.push("/settings/approval-rules")}>
                  Back to rules
                </SecondaryButton>
              )
            }
          />
        ) : loading || !rule ? (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-[66px] rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <button
              type="button"
              onClick={() => router.push("/settings/approval-rules")}
              className="flex w-fit items-center gap-2 text-sm text-ink-2 transition-colors hover:text-primary"
            >
              <ArrowLeftIcon className="size-4" />
              Back
            </button>

            <h2 className="text-base font-semibold text-ink-1">Edit Rule-{rule.name}</h2>

            <div className="flex items-center justify-between gap-6">
              <p className="text-base text-ink-1">Enable this rule</p>
              <Switch
                aria-label="Enable this rule"
                checked={rule.enabled}
                onCheckedChange={(next) => set("enabled", next)}
              />
            </div>

            <fieldset disabled={!rule.enabled} className="flex min-w-0 flex-col gap-4 border-0 p-0">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Trigger Condition" htmlFor="condition">
                  <TextInput
                    id="condition"
                    value={rule.condition}
                    onChange={(event) => set("condition", event.target.value)}
                  />
                </Field>

                {rule.threshold !== undefined && (
                  <Field label={thresholdLabel(rule)} htmlFor="threshold">
                    <TextInput
                      id="threshold"
                      inputMode="numeric"
                      value={rule.threshold}
                      onChange={(event) =>
                        set("threshold", event.target.value.replace(/\D/g, ""))
                      }
                    />
                  </Field>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Approver" htmlFor="approver">
                  <SelectInput
                    id="approver"
                    value={rule.approver}
                    onChange={(event) => set("approver", event.target.value)}
                  >
                    {APPROVER_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectInput>
                </Field>

                <Field label="Location" htmlFor="appliesTo">
                  <SelectInput
                    id="appliesTo"
                    value={rule.appliesTo}
                    onChange={(event) => set("appliesTo", event.target.value)}
                  >
                    {APPROVAL_LOCATIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              </div>
            </fieldset>

            <div className="flex justify-end pt-2">
              <PrimaryButton onClick={save} loading={saving}>
                Save Changes
              </PrimaryButton>
            </div>
          </div>
        )}
      </SettingsCard>
    </SettingsShell>
  );
}
