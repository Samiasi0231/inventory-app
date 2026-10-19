"use client";

import { useState, type FormEvent } from "react";
import { Field, TextInput, SelectInput } from "@/components/form/app-fields";
import { useToast } from "@/components/ui/toast";
import { SettingsShell } from "@/features/settings/components/settings-shell";
import { SettingsCard } from "@/features/settings/components/settings-card";
import {
  SettingsTabs,
  SettingsSection,
  ToggleRow,
  SaveSettings,
} from "@/features/settings/components/settings-controls";
import { useSavedSettings } from "@/features/settings/hooks/use-saved-settings";

const defaults = {
  dueDays: "14",
  invoicePrefix: "INV-",
  nextPO: "1044",
  receiptPrefix: "RCT-",
  nextReceipt: "0871",
  receiptDetails: "Name, address, phone number",
  salesPrefix: "RCT-",
  nextSales: "0871",
  discounts: true,
  poPrefix: "PO-",
  nextInvoice: "0233",
  captureInvoice: true,
  priceDifferences: true,
  partialReceiving: true,
  batchExpiry: true,
};
type Values = typeof defaults;

export default function SalesSettingsPage() {
  const [tab, setTab] = useState<"Sales" | "Purchasing">("Sales");
  const saved = useSavedSettings("sales", defaults);
  const [draft, setDraft] = useState<Values | null>(null);
  const value = draft ?? saved.value;
  const toast = useToast();
  function set<K extends keyof Values>(key: K, next: Values[K]) {
    setDraft({ ...value, [key]: next });
  }
  function save(event: FormEvent) {
    event.preventDefault();
    try {
      saved.save(value);
      toast.add({ type: "success", title: "Changes saved" });
    } catch {
      toast.add({ type: "error", title: "Couldn't save changes" });
    }
  }
  function input(key: keyof Values, label: string, numeric = false) {
    return (
      <Field label={label} htmlFor={key}>
        <TextInput
          id={key}
          type={numeric ? "number" : "text"}
          min={numeric ? 0 : undefined}
          required
          value={String(value[key])}
          onChange={(e) => set(key, e.target.value)}
        />
      </Field>
    );
  }
  return (
    <SettingsShell
      title="Sales & Purchasing"
      description="Defaults for transaction documents and workflows."
    >
      <SettingsTabs
        tabs={["Sales", "Purchasing"]}
        value={tab}
        onChange={setTab}
      />
      <SettingsCard>
        <form
          id="settings-tab-panel"
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          className={`settings-form settings-transaction-form ${tab === "Sales" ? "settings-sales-form" : ""}`}
          onSubmit={save}
        >
          {tab === "Sales" ? (
            <>
              <SettingsSection title="Purchase order defaults">
                {input("dueDays", "Invoice due period (days)", true)}
                {input("invoicePrefix", "Inv prefix")}
                {input("nextPO", "Next PO number", true)}
              </SettingsSection>
              <SettingsSection title="Receipts defaults">
                {input("receiptPrefix", "Receipt prefix")}
                {input("nextReceipt", "Next Receipt number", true)}
                <Field
                  label="Business detail on receipts"
                  htmlFor="receiptDetails"
                >
                  <SelectInput
                    id="receiptDetails"
                    value={value.receiptDetails}
                    onChange={(e) => set("receiptDetails", e.target.value)}
                  >
                    {[
                      "Name, address, phone number",
                      "Name and address",
                      "Name only",
                    ].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </SelectInput>
                </Field>
              </SettingsSection>
              <SettingsSection title="Sales defaults">
                {input("salesPrefix", "Sales Order prefix")}
                {input("nextSales", "Next Sales number", true)}
                <ToggleRow
                  label="Allow discounts at sale"
                  hint="Large discounts follow Approval Rules"
                  checked={value.discounts}
                  onChange={(v) => set("discounts", v)}
                />
              </SettingsSection>
            </>
          ) : (
            <>
              <SettingsSection title="Purchase order defaults">
                {input("poPrefix", "PO prefix")}
                {input("nextInvoice", "Next Invoice number", true)}
              </SettingsSection>
              <SettingsSection title="Supplier Invoice Preferences">
                <ToggleRow
                  label="Capture supplier invoice number on receiving"
                  checked={value.captureInvoice}
                  onChange={(v) => set("captureInvoice", v)}
                />
                <ToggleRow
                  label="Flag price differences from the PO"
                  hint="Large differences can route to approval"
                  checked={value.priceDifferences}
                  onChange={(v) => set("priceDifferences", v)}
                />
              </SettingsSection>
              <SettingsSection title="Receiving Preferences">
                <ToggleRow
                  label="Allow partial receiving"
                  hint="Receive part of an order now and rest later"
                  checked={value.partialReceiving}
                  onChange={(v) => set("partialReceiving", v)}
                />
                <ToggleRow
                  label="Require batch & expiry at receiving"
                  hint="When batch / expiry tracking is on"
                  checked={value.batchExpiry}
                  onChange={(v) => set("batchExpiry", v)}
                />
              </SettingsSection>
            </>
          )}
          <SaveSettings />
        </form>
      </SettingsCard>
    </SettingsShell>
  );
}
