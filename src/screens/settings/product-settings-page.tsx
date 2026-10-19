"use client";

import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { Field, SelectInput, TextInput } from "@/components/form/app-fields";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useDraft } from "@/hooks/use-draft";
import { SettingsShell } from "@/features/settings/components/settings-shell";
import { SettingsCard } from "@/features/settings/components/settings-card";
import { settingsService } from "@/features/settings/settings.service";
import {
  INSUFFICIENT_STOCK_OPTIONS,
  SKU_GENERATION_OPTIONS,
} from "@/features/settings/types";

function ToggleRow({
  label,
  hint,
  checked,
  onCheckedChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        <p className="text-base text-ink-1">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-ink-3">{hint}</p>}
      </div>
      <Switch aria-label={label} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default function ProductSettingsPage() {
  const toast = useToast();
  const { data, loading } = useAsyncResource(
    "product-settings",
    () => settingsService.getProductSettings(),
    "We couldn't load your product settings.",
  );

  const { value: form, dirty, set, reset } = useDraft(data);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!form) return;
    setSaving(true);
    try {
      await settingsService.updateProductSettings(form);
      reset();
      toast.add({ type: "success", title: "Changes saved" });
    } catch {
      toast.add({ type: "error", title: "Couldn't save changes" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingsShell
      title="Products & Inventory"
      description="Organization-wide defaults for product and stock management"
    >
      <SettingsCard>
        {loading || !form ? (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <Skeleton key={index} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-ink-1">Product Details</h2>

              <Field label="SKU generation" htmlFor="skuGeneration">
                <SelectInput
                  id="skuGeneration"
                  value={form.skuGeneration}
                  onChange={(event) => set("skuGeneration", event.target.value)}
                >
                  {SKU_GENERATION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="SKU prefix" htmlFor="skuPrefix">
                <TextInput
                  id="skuPrefix"
                  value={form.skuPrefix}
                  onChange={(event) => set("skuPrefix", event.target.value)}
                />
              </Field>

              <ToggleRow
                label="Barcode / QR support"
                hint="Scan at sale and receiving"
                checked={form.barcodeSupport}
                onCheckedChange={(next) => set("barcodeSupport", next)}
              />
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-ink-1">Low Stock Notifications</h2>

              <ToggleRow
                label="Stock alerts"
                hint="Triggers at each products minimum stock"
                checked={form.stockAlerts}
                onCheckedChange={(next) => set("stockAlerts", next)}
              />
              <ToggleRow
                label="Out-of-stock notifications"
                checked={form.outOfStockNotifications}
                onCheckedChange={(next) => set("outOfStockNotifications", next)}
              />
              <ToggleRow
                label="Stock-variance notifications"
                hint="After counts and adjustments"
                checked={form.stockVarianceNotifications}
                onCheckedChange={(next) => set("stockVarianceNotifications", next)}
              />
              <ToggleRow
                label="Expiry alerts"
                hint="Requires batch / expiry tracking"
                checked={form.expiryAlerts}
                onCheckedChange={(next) => set("expiryAlerts", next)}
              />

              <Field
                label="Expiry Alert Time"
                htmlFor="expiryAlertDays"
                hint="Days of notice before an item expires"
              >
                <TextInput
                  id="expiryAlertDays"
                  type="number"
                  min={1}
                  disabled={!form.expiryAlerts}
                  value={form.expiryAlertDays}
                  onChange={(event) => set("expiryAlertDays", event.target.value)}
                />
              </Field>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-ink-1">Inventory Controls</h2>

              <ToggleRow
                label="Batch & expiry tracking"
                hint="Adds batch number and expiry at receiving"
                checked={form.batchTracking}
                onCheckedChange={(next) => set("batchTracking", next)}
              />
              <ToggleRow
                label="Stock transfers between locations"
                checked={form.stockTransfers}
                onCheckedChange={(next) => set("stockTransfers", next)}
              />

              <Field label="When stock is insufficient at sale" htmlFor="insufficientStockAction">
                <SelectInput
                  id="insufficientStockAction"
                  value={form.insufficientStockAction}
                  onChange={(event) => set("insufficientStockAction", event.target.value)}
                >
                  {INSUFFICIENT_STOCK_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </section>

            <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-6">
              <SecondaryButton onClick={reset} disabled={!dirty || saving}>
                Discard
              </SecondaryButton>
              <PrimaryButton onClick={save} loading={saving} disabled={!dirty}>
                Save Changes
              </PrimaryButton>
            </div>
          </div>
        )}
      </SettingsCard>
    </SettingsShell>
  );
}
