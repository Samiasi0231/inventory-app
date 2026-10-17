"use client";

import { useState } from "react";

type ApprovalRule = {
  id: number;
  name: string;
  description: string;
  condition: string;
  trigger: string;
  location: string;
  approver: string;
  enabled: boolean;
  threshold: string;
};

const initialRules: ApprovalRule[] = [
  {
    id: 1,
    name: "Inventory Adjustments",
    description: "Stock quantity changes that require authorization.",
    condition: "Quantity over 10 units",
    trigger: "Quantity above threshold",
    threshold: "10",
    location: "All locations",
    approver: "Manager",
    enabled: true,
  },
  {
    id: 2,
    name: "Price Changes",
    description: "Changes to a product's selling price.",
    condition: "Any change to a selling price",
    trigger: "Any price change",
    threshold: "",
    location: "All locations",
    approver: "Manager",
    enabled: true,
  },
  {
    id: 3,
    name: "Invoice & Receipt Cancellations",
    description: "Cancellation of an issued invoice or receipt.",
    condition: "Every cancellation",
    trigger: "Every cancellation",
    threshold: "",
    location: "All locations",
    approver: "Administrator",
    enabled: true,
  },
  {
    id: 4,
    name: "Large Sales Discounts",
    description: "Discounts above the permitted threshold.",
    condition: "Discount over 5% of sale value",
    trigger: "Discount above threshold",
    threshold: "5",
    location: "All locations",
    approver: "Manager",
    enabled: true,
  },
  {
    id: 5,
    name: "Customer Credit",
    description: "Transactions that exceed the customer's credit limit.",
    condition: "Exceeds assigned credit limit",
    trigger: "Credit above limit",
    threshold: "",
    location: "All locations",
    approver: "Manager",
    enabled: true,
  },
  {
    id: 6,
    name: "Returns",
    description: "Returns that require review before processing.",
    condition: "Every return",
    trigger: "Every return",
    threshold: "",
    location: "All locations",
    approver: "Manager",
    enabled: true,
  },
  {
    id: 7,
    name: "Write-offs",
    description: "Stock written off as damaged, lost or unusable.",
    condition: "Every write-off",
    trigger: "Every write-off",
    threshold: "",
    location: "All locations",
    approver: "Owner",
    enabled: true,
  },
  {
    id: 8,
    name: "Purchase Orders",
    description: "Purchase orders above the configured value.",
    condition: "Order total exceeds ₦500,000",
    trigger: "Order total exceeds threshold",
    threshold: "500000",
    location: "Main Warehouse",
    approver: "Manager",
    enabled: false,
  },
];

function SmallIcon({ type }: { type: "condition" | "location" | "approver" }) {
  if (type === "condition") {
    return (
      <svg viewBox="0 0 16 16" fill="none" className="h-[10px] w-[10px]">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M8 4.8V8L10.2 9.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "location") {
    return (
      <svg viewBox="0 0 16 16" fill="none" className="h-[10px] w-[10px]">
        <path
          d="M8 14s4.5-4.2 4.5-8A4.5 4.5 0 0 0 3.5 6c0 3.8 4.5 8 4.5 8Z"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-[10px] w-[10px]">
      <circle cx="8" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M3.5 13c.3-2.1 2-3.4 4.5-3.4s4.2 1.3 4.5 3.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ApprovalRules() {
  const [rules, setRules] = useState<ApprovalRule[]>(initialRules);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<ApprovalRule | null>(null);

  const editingRule = rules.find((rule) => rule.id === editingId);

  function editRule(rule: ApprovalRule) {
    setEditingId(rule.id);
    setDraft({ ...rule });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  function saveChanges() {
    if (!draft) return;

    setRules((current) =>
      current.map((rule) => (rule.id === draft.id ? draft : rule)),
    );

    cancelEdit();
  }

  function updateDraft<K extends keyof ApprovalRule>(
    key: K,
    value: ApprovalRule[K],
  ) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  return (
    <main className="min-h-screen w-full bg-[#f7f8fa] px-5 py-5 font-sans text-[#202522] sm:px-7 lg:px-[30px]">
      {/* Page heading */}
      <header className="mb-[18px]">
        <h1 className="text-[16px] font-medium leading-[21px] tracking-[-0.2px]">
          Approval Rules
        </h1>
        <p className="mt-[3px] text-[10px] leading-[15px] text-[#888e89]">
          Define which business actions require approval and who can approve
          them
        </p>
      </header>

      {draft && editingRule ? (
        /* EDIT APPROVAL RULE */
        <section className="w-full rounded-[5px] border border-[#eceeec] bg-white p-[18px] sm:p-[22px]">
          <button
            type="button"
            onClick={cancelEdit}
            className="mb-[10px] flex items-center gap-[5px] text-[10px] text-[#555d57] hover:text-[#009b58]"
          >
            <span aria-hidden="true">←</span>
            Back
          </button>

          <h2 className="text-[12px] font-medium leading-[17px]">
            Edit Rule: {editingRule.name}
          </h2>

          <div className="mt-[13px] flex items-center justify-between">
            <label
              htmlFor="rule-enabled"
              className="text-[10px] font-medium text-[#363d37]"
            >
              Enable this rule
            </label>

            <button
              id="rule-enabled"
              type="button"
              role="switch"
              aria-checked={draft.enabled}
              onClick={() => updateDraft("enabled", !draft.enabled)}
              className={`relative h-[11px] w-[20px] rounded-full transition-colors ${
                draft.enabled ? "bg-[#009b58]" : "bg-[#c7ccc8]"
              }`}
            >
              <span
                className={`absolute top-[1px] h-[9px] w-[9px] rounded-full bg-white shadow-sm transition-all ${
                  draft.enabled ? "left-[10px]" : "left-[1px]"
                }`}
              />
            </button>
          </div>

          <div className="mt-[13px] grid grid-cols-1 gap-x-[8px] gap-y-[12px] sm:grid-cols-2">
            <label className="block">
              <span className="mb-[5px] block text-[9px] font-medium text-[#424943]">
                Trigger Condition
              </span>
              <input
                value={draft.trigger}
                onChange={(event) => updateDraft("trigger", event.target.value)}
                className="h-[34px] w-full rounded-[4px] border border-[#d9ded9] bg-white px-[9px] text-[10px] text-[#545b55] outline-none focus:border-[#009b58]"
              />
            </label>

            <label className="block">
              <span className="mb-[5px] block text-[9px] font-medium text-[#424943]">
                Threshold (units)
              </span>
              <input
                value={draft.threshold}
                onChange={(event) =>
                  updateDraft("threshold", event.target.value)
                }
                className="h-[34px] w-full rounded-[4px] border border-[#d9ded9] bg-white px-[9px] text-[10px] text-[#545b55] outline-none focus:border-[#009b58]"
              />
            </label>

            <label className="block">
              <span className="mb-[5px] block text-[9px] font-medium text-[#424943]">
                Approver
              </span>
              <div className="relative">
                <select
                  value={draft.approver}
                  onChange={(event) =>
                    updateDraft("approver", event.target.value)
                  }
                  className="h-[34px] w-full appearance-none rounded-[4px] border border-[#d9ded9] bg-white px-[9px] pr-[27px] text-[10px] text-[#545b55] outline-none focus:border-[#009b58]"
                >
                  <option>Manager</option>
                  <option>Administrator</option>
                  <option>Owner</option>
                </select>
                <span className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2 text-[10px] text-[#777e78]">
                  ⌄
                </span>
              </div>
            </label>

            <label className="block">
              <span className="mb-[5px] block text-[9px] font-medium text-[#424943]">
                Location
              </span>
              <div className="relative">
                <select
                  value={draft.location}
                  onChange={(event) =>
                    updateDraft("location", event.target.value)
                  }
                  className="h-[34px] w-full appearance-none rounded-[4px] border border-[#d9ded9] bg-white px-[9px] pr-[27px] text-[10px] text-[#545b55] outline-none focus:border-[#009b58]"
                >
                  <option>All locations</option>
                  <option>All</option>
                  <option>Main Warehouse</option>
                  <option>Head Office</option>
                </select>
                <span className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2 text-[10px] text-[#777e78]">
                  ⌄
                </span>
              </div>
            </label>
          </div>

          <div className="mt-[18px] flex justify-end">
            <button
              type="button"
              onClick={saveChanges}
              className="h-[30px] rounded-[4px] bg-[#009b58] px-[14px] text-[10px] font-medium text-white transition-colors hover:bg-[#00864c]"
            >
              Save Changes
            </button>
          </div>
        </section>
      ) : (
        /* APPROVAL RULE CARDS */
        <div className="space-y-[10px]">
          {rules.map((rule) => (
            <button
              type="button"
              key={rule.id}
              onClick={() => editRule(rule)}
              className="block w-full rounded-[5px] border border-[#f0f1f0] bg-white px-[12px] py-[10px] text-left transition-colors hover:border-[#dfe8e2]"
            >
              {/* Rule title, description and status */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[10px] font-medium leading-[15px] text-[#292e2a]">
                    {rule.name}
                  </h2>
                  <p className="mt-[1px] text-[8px] leading-[12px] text-[#858b86]">
                    {rule.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-[9px]">
                  <span
                    className={`rounded-full px-[6px] py-[3px] text-[7px] leading-none ${
                      rule.enabled
                        ? "bg-[#e4f8ed] text-[#009451]"
                        : "bg-[#f0f1f0] text-[#727873]"
                    }`}
                  >
                    {rule.enabled ? "Enabled" : "Disabled"}
                  </span>
                  <span className="text-[14px] leading-[12px] text-[#747b75]">
                    ›
                  </span>
                </div>
              </div>

              {/* Metadata divider */}
              <div className="mb-[7px] mt-[8px] border-t border-[#e9ece9]" />

              {/* Condition, location and approver */}
              <div className="grid grid-cols-3 gap-[8px]">
                <div className="min-w-0">
                  <div className="flex items-center gap-[4px] text-[#777e78]">
                    <SmallIcon type="condition" />
                    <span className="text-[7px] leading-[10px]">Condition</span>
                  </div>
                  <p className="mt-[3px] pl-[14px] text-[7px] leading-[10px] text-[#666d67]">
                    {rule.condition}
                  </p>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-[4px] text-[#777e78]">
                    <SmallIcon type="location" />
                    <span className="text-[7px] leading-[10px]">
                      Applies to
                    </span>
                  </div>
                  <p className="mt-[3px] pl-[14px] text-[7px] leading-[10px] text-[#666d67]">
                    {rule.location}
                  </p>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-[4px] text-[#777e78]">
                    <SmallIcon type="approver" />
                    <span className="text-[7px] leading-[10px]">Approver</span>
                  </div>
                  <p className="mt-[3px] pl-[14px] text-[7px] leading-[10px] text-[#666d67]">
                    {rule.approver}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
