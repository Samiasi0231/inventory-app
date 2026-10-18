"use client";

import { useState } from "react";

type NotificationRow = {
  id: string;
  name: string;
  enabled: boolean;
  inApp: boolean;
  email: boolean;
  recipient: string;
};

type NotificationSection = {
  title: string;
  rows: NotificationRow[];
};

const initialSections: NotificationSection[] = [
  {
    title: "Inventory",
    rows: [
      {
        id: "low-stock",
        name: "Low Stock",
        enabled: true,
        inApp: true,
        email: true,
        recipient: "Inventory Manager, Admin",
      },
      {
        id: "out-stock",
        name: "Out of Stock",
        enabled: true,
        inApp: true,
        email: true,
        recipient: "Inventory Manager",
      },
      {
        id: "price-changes",
        name: "Price Set Changes",
        enabled: true,
        inApp: true,
        email: false,
        recipient: "Inventory Manager",
      },
      {
        id: "stock-transfer",
        name: "Stock Transfer",
        enabled: true,
        inApp: true,
        email: true,
        recipient: "Inventory Manager",
      },
    ],
  },
  {
    title: "Sales",
    rows: [
      {
        id: "login-sale",
        name: "Login Sale",
        enabled: true,
        inApp: true,
        email: true,
        recipient: "Inventory Manager, Admin",
      },
      {
        id: "failed-transaction",
        name: "Failed Transaction",
        enabled: true,
        inApp: true,
        email: true,
        recipient: "Inventory Manager",
      },
      {
        id: "refund",
        name: "Refund",
        enabled: true,
        inApp: true,
        email: false,
        recipient: "Inventory Manager",
      },
    ],
  },
  {
    title: "Security",
    rows: [
      {
        id: "failed-login",
        name: "Failed Logins",
        enabled: true,
        inApp: true,
        email: true,
        recipient: "Inventory Manager",
      },
      {
        id: "permission-change",
        name: "Permission Changes",
        enabled: true,
        inApp: true,
        email: true,
        recipient: "Inventory Manager",
      },
    ],
  },
  {
    title: "Operations",
    rows: [
      {
        id: "pending-approval",
        name: "Pending Approvals",
        enabled: true,
        inApp: true,
        email: true,
        recipient: "Inventory Manager, Admin",
      },
      {
        id: "approval-rejection",
        name: "Approval Rejections",
        enabled: true,
        inApp: true,
        email: true,
        recipient: "Inventory Manager",
      },
      {
        id: "incoming-orders",
        name: "Incoming Sales Orders",
        enabled: true,
        inApp: true,
        email: true,
        recipient: "Inventory Manager",
      },
    ],
  },
];

const recipientOptions = [
  "Inventory Manager",
  "Admin",
  "Inventory Manager, Admin",
  "All Users",
];

function StatusIcon({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex h-[13px] w-[13px] items-center justify-center rounded-full border ${
        active
          ? "border-[#69c5a0] text-[#42ad80]"
          : "border-[#d9dcd9] text-[#b9bfbb]"
      }`}
      aria-label={active ? "Enabled" : "Disabled"}
    >
      {active ? (
        <svg viewBox="0 0 12 12" className="h-[9px] w-[9px]" fill="none">
          <path
            d="m3 6 2 2 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span className="h-[3px] w-[3px] rounded-full bg-current" />
      )}
    </span>
  );
}

export default function NotificationsPage() {
  const [sections, setSections] =
    useState<NotificationSection[]>(initialSections);

  function toggleStatus(
    sectionTitle: string,
    rowId: string,
    field: "enabled" | "inApp" | "email",
  ) {
    setSections((current) =>
      current.map((section) =>
        section.title !== sectionTitle
          ? section
          : {
              ...section,
              rows: section.rows.map((row) =>
                row.id === rowId ? { ...row, [field]: !row[field] } : row,
              ),
            },
      ),
    );
  }

  function updateRecipient(
    sectionTitle: string,
    rowId: string,
    recipient: string,
  ) {
    setSections((current) =>
      current.map((section) =>
        section.title !== sectionTitle
          ? section
          : {
              ...section,
              rows: section.rows.map((row) =>
                row.id === rowId ? { ...row, recipient } : row,
              ),
            },
      ),
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f7f7f7] text-[#343434]">
      {/* Settings content */}
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[14px] p-4 sm:p-5 lg:px-7">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-[9px] border border-[#f0f0f0] bg-white px-3 py-3 sm:px-4 sm:py-4"
          >
            <h2 className="mb-[11px] text-[12px] font-semibold text-[#303030]">
              {section.title}
            </h2>

            {/* Table header */}
            <div className="grid grid-cols-[minmax(95px,1.8fr)_0.7fr_0.7fr_0.7fr_minmax(110px,1.5fr)] items-center gap-2 rounded-t-[5px] bg-[#f8f8f8] px-2 py-[9px] text-[9px] font-medium text-[#656565] sm:px-3">
              <span>Event</span>
              <span className="text-center">Enabled</span>
              <span className="text-center">In-app</span>
              <span className="text-center">Email</span>
              <span>Recipient</span>
            </div>

            {/* Notification rows */}
            <div>
              {section.rows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[minmax(95px,1.8fr)_0.7fr_0.7fr_0.7fr_minmax(110px,1.5fr)] items-center gap-2 border-b border-[#eeeeee] px-2 py-[8px] last:border-b-0 sm:px-3"
                >
                  <span className="min-w-0 text-[10px] leading-4 text-[#555555]">
                    {row.name}
                  </span>

                  {(["enabled", "inApp", "email"] as const).map((field) => (
                    <button
                      key={field}
                      type="button"
                      onClick={() => toggleStatus(section.title, row.id, field)}
                      className="flex h-6 items-center justify-center rounded-sm outline-none transition hover:bg-[#f0faf5] focus-visible:ring-2 focus-visible:ring-[#69c5a0]"
                      aria-label={`${field === "inApp" ? "In-app" : field === "email" ? "Email" : "Enabled"} ${row.name}`}
                      aria-pressed={row[field]}
                    >
                      <StatusIcon active={row[field]} />
                    </button>
                  ))}

                  <div className="min-w-0">
                    <select
                      value={row.recipient}
                      onChange={(event) =>
                        updateRecipient(
                          section.title,
                          row.id,
                          event.target.value,
                        )
                      }
                      aria-label={`Recipient for ${row.name}`}
                      className="h-[25px] w-full min-w-0 cursor-pointer rounded-[5px] border border-[#e3e3e3] bg-white px-1 text-[9px] text-[#777777] outline-none hover:border-[#bcbcbc] focus:border-[#68bd99] focus:ring-1 focus:ring-[#68bd99] sm:px-2"
                    >
                      {recipientOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
