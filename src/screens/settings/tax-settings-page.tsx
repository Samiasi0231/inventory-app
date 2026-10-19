"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeftIcon, PencilIcon, PlusIcon, PowerIcon } from "lucide-react";
import { PrimaryButton } from "@/components/button";
import { Field, TextInput, SelectInput } from "@/components/form/app-fields";
import { RowActionsMenu } from "@/components/common/row-action-menu";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { SettingsShell } from "@/features/settings/components/settings-shell";
import { SettingsCard } from "@/features/settings/components/settings-card";
import {
  SettingsTabs,
  ToggleRow,
  SaveSettings,
} from "@/features/settings/components/settings-controls";
import { useSavedSettings } from "@/features/settings/hooks/use-saved-settings";

interface Tax {
  id: string;
  name: string;
  appliesTo: string;
  rate: string;
  calculation: string;
  active: boolean;
  system: boolean;
}
const defaults: Tax[] = [
  {
    id: "standard",
    name: "Standard Tax",
    appliesTo: "All products and categoriess",
    rate: "7.5",
    calculation: "Percentage",
    active: true,
    system: true,
  },
  {
    id: "zero",
    name: "Zero-Rated",
    appliesTo: "Selected Items",
    rate: "0",
    calculation: "Percentage",
    active: true,
    system: true,
  },
  {
    id: "exempt",
    name: "Exempt",
    appliesTo: "No tax charged",
    rate: "",
    calculation: "Percentage",
    active: false,
    system: false,
  },
];
const blank: Tax = {
  id: "",
  name: "",
  appliesTo: "All Products",
  rate: "",
  calculation: "Percentage",
  active: true,
  system: false,
};

export default function TaxSettingsPage() {
  const [tab, setTab] = useState<"Tax Configuration" | "Payment Methods">(
    "Tax Configuration",
  );
  const [editing, setEditing] = useState<Tax | null>(null);
  const saved = useSavedSettings("taxes", defaults);
  const payment = useSavedSettings("payment-methods", {
    Cash: true,
    "Bank Transfer": true,
    POS: true,
  });
  const toast = useToast();
  function persist(rows: Tax[]) {
    try {
      saved.save(rows);
      toast.add({ type: "success", title: "Changes saved" });
      return true;
    } catch {
      toast.add({ type: "error", title: "Couldn't save changes" });
      return false;
    }
  }
  function save(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    const row = {
      ...editing,
      name: editing.name.trim(),
      id: editing.id || crypto.randomUUID(),
    };
    if (!row.name) return;
    const next = saved.value.some((t) => t.id === row.id)
      ? saved.value.map((t) => (t.id === row.id ? row : t))
      : [...saved.value, row];
    if (persist(next)) setEditing(null);
  }
  return (
    <SettingsShell
      title="Tax & Payments"
      description="Tax treatment and accepted payment methods"
      action={
        <PrimaryButton
          leftIcon={<PlusIcon size={24} strokeWidth={1.5} />}
          onClick={() => {
            setTab("Tax Configuration");
            setEditing({ ...blank });
          }}
        >
          Add Tax Category
        </PrimaryButton>
      }
    >
      <SettingsTabs
        tabs={["Tax Configuration", "Payment Methods"]}
        value={tab}
        onChange={(v) => {
          setTab(v);
          setEditing(null);
        }}
      />
      <SettingsCard>
        <div
          id="settings-tab-panel"
          role="tabpanel"
          aria-labelledby={`tab-${tab.replaceAll(" ", "-")}`}
        >
          {tab === "Payment Methods" ? (
            <div className="settings-section">
              <h2>Payment Methods</h2>
              {(
                Object.keys(payment.value) as Array<keyof typeof payment.value>
              ).map((key) => (
                <ToggleRow
                  key={key}
                  label={key}
                  checked={payment.value[key]}
                  onChange={(enabled) => {
                    try {
                      payment.save({ ...payment.value, [key]: enabled });
                    } catch {
                      toast.add({
                        type: "error",
                        title: "Couldn't save payment method",
                      });
                    }
                  }}
                />
              ))}
            </div>
          ) : editing ? (
            <form className="settings-form settings-tax-form" onSubmit={save}>
              <button
                type="button"
                className="settings-back"
                onClick={() => setEditing(null)}
              >
                <ArrowLeftIcon size={16} />
                Back
              </button>
              <div className="settings-form-grid">
                <Field label="Tax name" htmlFor="tax-name">
                  <TextInput
                    id="tax-name"
                    required
                    value={editing.name}
                    placeholder="e.g Standard Tax"
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                  />
                </Field>
                <Field label="Tax amount" htmlFor="tax-amount">
                  <TextInput
                    id="tax-amount"
                    type="number"
                    min="0"
                    max={editing.calculation === "Percentage" ? 100 : undefined}
                    step="0.01"
                    required
                    placeholder="e.g 7.5"
                    value={editing.rate}
                    onChange={(e) =>
                      setEditing({ ...editing, rate: e.target.value })
                    }
                  />
                </Field>
                <Field label="Calculation Type" htmlFor="tax-calculation">
                  <SelectInput
                    id="tax-calculation"
                    value={editing.calculation}
                    onChange={(e) =>
                      setEditing({ ...editing, calculation: e.target.value })
                    }
                  >
                    <option>Percentage</option>
                    <option>Fixed amount</option>
                  </SelectInput>
                </Field>
                <Field label="Applies To" htmlFor="tax-applies">
                  <SelectInput
                    id="tax-applies"
                    value={editing.appliesTo}
                    onChange={(e) =>
                      setEditing({ ...editing, appliesTo: e.target.value })
                    }
                  >
                    {Array.from(
                      new Set([
                        editing.appliesTo,
                        "All Products",
                        "Selected Items",
                        "No tax charged",
                      ]),
                    ).map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </SelectInput>
                </Field>
              </div>
              <ToggleRow
                label="Active"
                checked={editing.active}
                onChange={(active) => setEditing({ ...editing, active })}
              />
              <SaveSettings />
            </form>
          ) : (
            <Table className="settings-table settings-tax-table">
              <TableHeader>
                <TableRow>
                  {["Tax name", "Applies To", "Rate", "Status", "Actions"].map(
                    (h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {saved.value.map((tax) => (
                  <TableRow key={tax.id}>
                    <TableCell>{tax.name}</TableCell>
                    <TableCell>{tax.appliesTo}</TableCell>
                    <TableCell>
                      {tax.rate === ""
                        ? "--"
                        : `${tax.rate}${tax.calculation === "Percentage" ? "%" : ""}`}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`settings-status ${tax.active ? "is-active" : ""}`}
                      >
                        <span>•</span>{" "}
                        {tax.active
                          ? tax.system
                            ? "System"
                            : "Active"
                          : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <RowActionsMenu
                        ariaLabel={`Actions for ${tax.name}`}
                        items={[
                          {
                            key: "edit",
                            label: "Edit tax category",
                            icon: <PencilIcon size={14} />,
                            onSelect: () => setEditing({ ...tax }),
                          },
                          {
                            key: "status",
                            label: tax.active ? "Deactivate" : "Activate",
                            icon: <PowerIcon size={14} />,
                            onSelect: () =>
                              persist(
                                saved.value.map((t) =>
                                  t.id === tax.id
                                    ? { ...t, active: !t.active }
                                    : t,
                                ),
                              ),
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </SettingsCard>
    </SettingsShell>
  );
}
