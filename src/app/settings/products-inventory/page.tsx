"use client";

import { useEffect, useState } from "react";

type InventorySettings = {
  skuGeneration: string;
  skuPrefix: string;
  barcodeSupport: boolean;
  stockAlerts: boolean;
  outOfStockNotifications: boolean;
  stockVarianceNotifications: boolean;
  expiryAlerts: boolean;
  expiryAlertTime: string;
  batchTracking: boolean;
  stockTransfers: boolean;
  insufficientStockAction: string;
};

const defaultSettings: InventorySettings = {
  skuGeneration: "automatic",
  skuPrefix: "LWD",
  barcodeSupport: true,
  stockAlerts: true,
  outOfStockNotifications: true,
  stockVarianceNotifications: true,
  expiryAlerts: true,
  expiryAlertTime: "60days",
  batchTracking: true,
  stockTransfers: true,
  insufficientStockAction: "block",
};

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[13px] w-[26px] shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
        checked ? "bg-[#009858]" : "bg-[#c9c9c9]"
      }`}
    >
      <span
        className={`absolute h-[9px] w-[9px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-[15px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

type SettingRowProps = {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function SettingRow({
  title,
  description,
  checked,
  onChange,
}: SettingRowProps) {
  return (
    <div className="flex min-h-[28px] items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[8.5px] font-medium leading-[13px] text-[#252525]">
          {title}
        </p>
        {description && (
          <p className="mt-[2px] text-[7px] leading-[10px] text-[#858585]">
            {description}
          </p>
        )}
      </div>

      <div className="flex h-[16px] items-center">
        <Toggle checked={checked} onChange={onChange} label={title} />
      </div>
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
};

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div className="space-y-[5px]">
      <label className="block text-[8px] font-medium leading-[12px] text-[#303030]">
        {label}
      </label>

      <div className="relative">
        <select
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-[28px] w-full appearance-none rounded-[5px] border border-[#d6d6d6] bg-white px-[9px] pr-8 text-[8px] text-[#858585] outline-none transition focus:border-[#009858] focus:ring-1 focus:ring-[#009858]/20"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="pointer-events-none absolute right-[9px] top-1/2 h-[12px] w-[12px] -translate-y-1/2 text-[#888888]"
        >
          <path
            d="m4.5 7.5 5.5 5 5.5-5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default function ProductsInventoryPage() {
  const [settings, setSettings] = useState<InventorySettings>(defaultSettings);

  const [savedSettings, setSavedSettings] =
    useState<InventorySettings>(defaultSettings);

  const [hasLoaded, setHasLoaded] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("products-inventory-settings");

      if (stored) {
        const parsed = {
          ...defaultSettings,
          ...JSON.parse(stored),
        } as InventorySettings;

        setSettings(parsed);
        setSavedSettings(parsed);
      }
    } catch {
      // Continue with the default settings if storage is unavailable.
    } finally {
      setHasLoaded(true);
    }
  }, []);

  function updateSetting<K extends keyof InventorySettings>(
    key: K,
    value: InventorySettings[K],
  ) {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
    setSaveMessage("");
  }

  function discardChanges() {
    setSettings({ ...savedSettings });
    setSaveMessage("");
  }

  function saveChanges() {
    try {
      localStorage.setItem(
        "products-inventory-settings",
        JSON.stringify(settings),
      );

      setSavedSettings({ ...settings });
      setSaveMessage("Changes saved successfully.");
    } catch {
      setSaveMessage("Unable to save settings in this browser.");
    }
  }

  if (!hasLoaded) {
    return <main className="min-h-screen bg-[#f7f7f6]" aria-busy="true" />;
  }

  return (
    <main className="min-h-screen bg-[#f7f7f6] px-0 py-0 font-sans text-[#252525]">
      <div className=" min-h-screen w-full overflow-hidden border-[#b8b8b8] bg-[#f7f7f6]">
        {/* Header */}
        <header className="border-b border-[#dedede] bg-white px-[20px] pb-[9px] pt-[10px]">
          <h1 className="text-[11px] font-semibold leading-[15px] tracking-[0.05px]">
            Products &amp; Inventory
          </h1>
          <p className="mt-[4px] text-[8px] leading-[11px] text-[#858585]">
            Organization-wide defaults for product and stock management
          </p>
        </header>

        {/* Settings */}
        <section className="px-[20px] pb-[30px] pt-[17px]">
          <div className="rounded-[8px] bg-white px-[11px] pb-[10px] pt-[12px] sm:px-[11px]">
            {/* Product Details */}
            <section>
              <h2 className="mb-[10px] text-[9px] font-semibold leading-[13px]">
                Product Details
              </h2>

              <div className="space-y-[9px]">
                <SelectField
                  label="SKU generation"
                  value={settings.skuGeneration}
                  onChange={(value) => updateSetting("skuGeneration", value)}
                  options={[
                    {
                      label: "Automatic - prefix + sequence",
                      value: "automatic",
                    },
                    { label: "Manual entry", value: "manual" },
                    { label: "Prefix + date", value: "prefix-date" },
                  ]}
                />

                <div className="space-y-[5px]">
                  <label
                    htmlFor="sku-prefix"
                    className="block text-[8px] font-medium leading-[12px]"
                  >
                    SKU prefix
                  </label>
                  <input
                    id="sku-prefix"
                    type="text"
                    value={settings.skuPrefix}
                    maxLength={20}
                    onChange={(event) =>
                      updateSetting("skuPrefix", event.target.value)
                    }
                    placeholder="LWD"
                    className="h-[28px] w-full rounded-[5px] border border-[#d6d6d6] bg-white px-[9px] text-[8px] outline-none placeholder:text-[#858585] focus:border-[#009858] focus:ring-1 focus:ring-[#009858]/20"
                  />
                </div>

                <SettingRow
                  title="Barcode / QR support"
                  description="Scan at sale and receiving"
                  checked={settings.barcodeSupport}
                  onChange={(value) => updateSetting("barcodeSupport", value)}
                />
              </div>
            </section>

            {/* Low Stock Notifications */}
            <section className="mt-[13px]">
              <h2 className="mb-[9px] text-[9px] font-semibold leading-[13px]">
                Low Stock Notifications
              </h2>

              <div className="space-y-[5px]">
                <SettingRow
                  title="Stock alerts"
                  description="Triggers at each products minimum stock"
                  checked={settings.stockAlerts}
                  onChange={(value) => updateSetting("stockAlerts", value)}
                />

                <SettingRow
                  title="Out-of-stock notifications"
                  checked={settings.outOfStockNotifications}
                  onChange={(value) =>
                    updateSetting("outOfStockNotifications", value)
                  }
                />

                <SettingRow
                  title="Stock-variance notifications"
                  description="After counts and adjustments"
                  checked={settings.stockVarianceNotifications}
                  onChange={(value) =>
                    updateSetting("stockVarianceNotifications", value)
                  }
                />

                <SettingRow
                  title="Expiry alerts"
                  description="Requires batch / expiry tracking"
                  checked={settings.expiryAlerts}
                  onChange={(value) => updateSetting("expiryAlerts", value)}
                />

                <div className="space-y-[5px] pt-[1px]">
                  <label
                    htmlFor="expiry-time"
                    className="block text-[8px] font-medium leading-[12px]"
                  >
                    Expiry Alert Time
                  </label>
                  <input
                    id="expiry-time"
                    type="text"
                    value={settings.expiryAlertTime}
                    onChange={(event) =>
                      updateSetting("expiryAlertTime", event.target.value)
                    }
                    placeholder="60days"
                    className="h-[28px] w-full rounded-[5px] border border-[#d6d6d6] bg-white px-[9px] text-[8px] outline-none placeholder:text-[#858585] focus:border-[#009858] focus:ring-1 focus:ring-[#009858]/20"
                  />
                </div>
              </div>
            </section>

            {/* Inventory Controls */}
            <section className="mt-[16px]">
              <h2 className="mb-[9px] text-[9px] font-semibold leading-[13px]">
                Inventory Controls
              </h2>

              <div className="space-y-[5px]">
                <SettingRow
                  title="Batch & expiry tracking"
                  description="Adds batch number and expiry at receiving"
                  checked={settings.batchTracking}
                  onChange={(value) => updateSetting("batchTracking", value)}
                />

                <SettingRow
                  title="Stock transfers between locations"
                  checked={settings.stockTransfers}
                  onChange={(value) => updateSetting("stockTransfers", value)}
                />

                <SelectField
                  label="When stock is insufficient at sale"
                  value={settings.insufficientStockAction}
                  onChange={(value) =>
                    updateSetting("insufficientStockAction", value)
                  }
                  options={[
                    { label: "Block the sale", value: "block" },
                    { label: "Allow negative stock", value: "allow" },
                    { label: "Show a warning", value: "warn" },
                  ]}
                />
              </div>
            </section>

            {/* Footer actions */}
            <div className="mt-[24px] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={discardChanges}
                className="inline-flex h-[27px] items-center justify-center rounded-[5px] border border-[#d3d3d3] bg-white px-[13px] text-[8px] font-medium text-[#009858] transition hover:bg-[#f4fbf7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009858]"
              >
                Discard
              </button>

              <div className="flex flex-wrap items-center justify-end gap-3">
                {saveMessage && (
                  <p
                    role="status"
                    aria-live="polite"
                    className="text-[8px] text-[#009858]"
                  >
                    {saveMessage}
                  </p>
                )}

                <button
                  type="button"
                  onClick={saveChanges}
                  className="inline-flex h-[27px] items-center justify-center rounded-[5px] bg-[#009858] px-[13px] text-[8px] font-semibold text-white transition hover:bg-[#007e49] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009858] focus-visible:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
