"use client";

import { useState } from "react";

type Tab = "Sales" | "Purchasing";

const inputStyle =
  "box-border h-9 w-full rounded-[5px] border border-[#dedfdf] bg-white px-[10px] text-xs text-[#777] outline-none focus:border-[#009653] focus:ring-1 focus:ring-[#009653]";

const labelStyle = "mb-2 block text-[11px] text-[#292d2b]";

function Field({
  label,
  value,
  placeholder,
}: {
  label: string;
  value?: string;
  placeholder?: string;
}) {
  return (
    <label className="mb-[15px] block">
      <span className={labelStyle}>{label}</span>
      <input
        defaultValue={value}
        placeholder={placeholder}
        className={inputStyle}
      />
    </label>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="my-0 mb-[13px] mt-5 text-xs font-semibold text-[#242824]">
      {children}
    </h3>
  );
}

function Toggle({
  label,
  description,
  initial = true,
}: {
  label: string;
  description?: string;
  initial?: boolean;
}) {
  const [enabled, setEnabled] = useState(initial);

  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div>
        <div className="text-[11px]">{label}</div>
        {description && (
          <div className="mt-1 text-[9px] text-[#999]">{description}</div>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={() => setEnabled(!enabled)}
        className={`flex h-[18px] w-[34px] shrink-0 items-center rounded-[20px] border-0 p-[2px] ${
          enabled ? "justify-end bg-[#009653]" : "justify-start bg-[#c8ceca]"
        }`}
      >
        <span className="h-[14px] w-[14px] rounded-full bg-white" />
      </button>
    </div>
  );
}

function SalesForm() {
  return (
    <>
      <SectionTitle>Purchase order defaults</SectionTitle>
      <Field label="Invoice due period (days)" value="14" />
      <Field label="Inv prefix" value="INV-" />
      <Field label="Next PO number" value="1044" />

      <SectionTitle>Receipts defaults</SectionTitle>
      <Field label="Receipt prefix" value="RCT-" />
      <Field label="Next Receipt number" value="0871" />

      <label className="mb-[15px] block">
        <span className={labelStyle}>Business detail on receipts</span>
        <select className={inputStyle} defaultValue="">
          <option value="" disabled>
            Name, address, phone number
          </option>
          <option>Name</option>
          <option>Address</option>
          <option>Phone number</option>
        </select>
      </label>

      <SectionTitle>Sales defaults</SectionTitle>
      <Field label="Sales Order prefix" value="RCT-" />
      <Field label="Next Sales number" value="0871" />

      <Toggle
        label="Allow discounts at sale"
        description="Large discounts follow Approval Rules"
      />
    </>
  );
}

function PurchasingForm() {
  return (
    <>
      <SectionTitle>Purchase order defaults</SectionTitle>
      <Field label="PO prefix" value="PO-" />
      <Field label="Next Invoice number" value="0233" />

      <SectionTitle>Supplier Invoice Preferences</SectionTitle>
      <Toggle label="Capture supplier invoice number on receiving" />
      <Toggle
        label="Flag price differences from the PO"
        description="Large differences cause this to approval"
      />

      <SectionTitle>Receiving Preferences</SectionTitle>
      <Toggle
        label="Allow partial receiving"
        description="Receive part of an order now and rest later"
      />
      <Toggle
        label="Require batch & expiry at receiving"
        description="When batch / expiry tracking is on"
      />
    </>
  );
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>("Purchasing");
  const [saved, setSaved] = useState(false);

  return (
    <main className="box-border min-h-screen py-5 font-[Arial,Helvetica,sans-serif] text-[#242824]">
      <div className=" w-full max-w-[1100px] overflow-hidden rounded-[9px] bg-[#f7f7f7]">
        <header className="border-b border-[#e5e5e5] bg-white px-7 py-[22px]">
          <h1 className="m-0 text-xl font-semibold">Sales &amp; Purchasing</h1>
          <p className="mt-[7px] mb-0 text-xs text-[#929692]">
            Defaults for transaction documents and workflows.
          </p>
        </header>

        <div className=" p-6">
          <div className="mb-[18px] flex gap-[5px] rounded-[7px] bg-white p-[7px]">
            {(["Sales", "Purchasing"] as Tab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setSaved(false);
                }}
                className={`cursor-pointer rounded-[5px] border-0 px-4 py-[10px] text-xs ${
                  activeTab === tab
                    ? "bg-[#e4fff3] text-[#009653]"
                    : "bg-white text-[#515651]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <section className="rounded-lg bg-white px-[22px] pt-3 pb-5">
            {activeTab === "Sales" ? <SalesForm /> : <PurchasingForm />}

            <div className="mt-[25px] flex items-center justify-end gap-3">
              {saved && (
                <span className="text-[11px] text-[#009653]">
                  Changes saved locally
                </span>
              )}

              <button
                type="button"
                onClick={() => setSaved(true)}
                className="cursor-pointer rounded-[5px] border-0 bg-[#009653] px-[19px] py-[11px] text-[11px] font-semibold text-white"
              >
                Save Changes
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
