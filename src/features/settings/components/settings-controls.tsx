"use client";

import { type ReactNode } from "react";
import { Switch } from "@/components/ui/switch";
import { PrimaryButton } from "@/components/button";

export function SettingsTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: readonly T[];
  value: T;
  onChange: (tab: T) => void;
}) {
  return (
    <div className="settings-tabs" role="tablist" aria-label="Settings views">
      {tabs.map((tab) => (
        <button
          key={tab}
          id={`tab-${tab.replaceAll(" ", "-")}`}
          type="button"
          role="tab"
          aria-selected={tab === value}
          aria-controls="settings-tab-panel"
          tabIndex={tab === value ? 0 : -1}
          onClick={() => onChange(tab)}
          onKeyDown={(event) => {
            const index = tabs.indexOf(tab);
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              const next =
                tabs[
                  (index +
                    (event.key === "ArrowRight" ? 1 : -1) +
                    tabs.length) %
                    tabs.length
                ];
              onChange(next);
              document
                .getElementById(`tab-${next.replaceAll(" ", "-")}`)
                ?.focus();
            }
          }}
          className={tab === value ? "is-active" : ""}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="settings-toggle-row">
      <div>
        <p>{label}</p>
        {hint && <small>{hint}</small>}
      </div>
      <Switch aria-label={label} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="settings-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function SaveSettings({
  label = "Save Changes",
  disabled = false,
}: {
  label?: string;
  disabled?: boolean;
}) {
  return (
    <div className="settings-save">
      <PrimaryButton type="submit" disabled={disabled}>
        {label}
      </PrimaryButton>
    </div>
  );
}
