
"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  CircleIcon,
  CircleCheckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useSavedSettings } from "@/features/settings/hooks/use-saved-settings";

const groups = [
  {
    title: "Inventory",
    events: ["Low Stock", "Out of Stock", "Stock Variance", "Batch/Expiry"],
  },
  {
    title: "Sales",
    events: ["Large Sale", "Failed Transaction", "Refunds"],
  },
  {
    title: "Security",
    events: ["Failed Logins", "Permission Changes"],
  },
  {
    title: "Operations",
    events: [
      "Pending Approvals",
      "Approval decisions",
      "Incoming Sales Orders",
    ],
  },
];

const RECIPIENT_OPTIONS = [
  "Inventory Manager, Manager",
  "Inventory Manager",
  "Manager",
  "Owner",
];

interface Preference {
  enabled: boolean;
  inApp: boolean;
  email: boolean;
  recipient: string;
}

const defaults = Object.fromEntries(
  groups.flatMap((group) =>
    group.events.map((event, index) => [
      event,
      {
        enabled: true,
        inApp: true,
        email: !["Stock Variance", "Refunds"].includes(event),
        recipient:
          index === 0 ? "Inventory Manager, Manager" : "Inventory Manager",
      },
    ]),
  ),
) as Record<string, Preference>;

interface RecipientDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  ariaLabel: string;
}

function RecipientDropdown({
  value,
  options,
  onChange,
  ariaLabel,
}: RecipientDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-w-0">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className={cn(
          "flex h-[42px] w-full items-center justify-between gap-2",
          "rounded-lg border border-border bg-white px-3 text-sm text-ink-1",
          "outline-none transition-colors hover:border-primary",
          "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
        )}
      >
        <span className="truncate">{value}</span>

        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-ink-3 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close recipient dropdown"
            tabIndex={-1}
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />

          <ul
            role="listbox"
            aria-label={ariaLabel}
            className={cn(
              "absolute right-0 z-20 mt-1 max-h-60 w-full min-w-48",
              "overflow-y-auto rounded-lg border border-border/60",
              "bg-white p-1 shadow-[0_10px_30px_rgba(47,47,47,0.12)]",
            )}
          >
            {options.map((option) => {
              const selected = option === value;

              return (
                <li key={option} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2",
                      "rounded-md px-3 py-2 text-left text-sm",
                      "transition-colors",
                      "hover:bg-primary/10 hover:text-primary",
                      "focus-visible:bg-primary/10 focus-visible:text-primary",
                      "focus-visible:outline-none",
                      selected &&
                        "bg-primary font-medium text-white hover:bg-primary hover:text-white",
                    )}
                  >
                    <span>{option}</span>

                    {selected && (
                      <Check size={15} className="shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default function NotificationsSettingsPage() {
  const saved = useSavedSettings("notifications", defaults);
  const toast = useToast();

  function set(event: string, next: Partial<Preference>) {
    try {
      saved.save({
        ...saved.value,
        [event]: {
          ...saved.value[event],
          ...next,
        },
      });
    } catch {
      toast.add({
        type: "error",
        title: "Couldn't save notification preference",
      });
    }
  }

  return (
    <SettingsShell
      title="Notifications"
      description="Manage the alerts your business receives and how they are managed"
    >
      <div className="settings-notifications">
        {groups.map((group) => (
          <SettingsCard key={group.title}>
            <h2>{group.title}</h2>

            <Table className="settings-table settings-notification-table">
              <TableHeader>
                <TableRow>
                  {["Event", "Enabled", "In-app", "Email", "Recipient"].map(
                    (heading) => (
                      <TableHead key={heading}>{heading}</TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {group.events.map((event) => (
                  <TableRow key={event}>
                    <TableCell>{event}</TableCell>

                    {(["enabled", "inApp", "email"] as const).map((key) => (
                      <TableCell key={key}>
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={saved.value[event][key]}
                          aria-label={`${event}: ${
                            key === "inApp" ? "In-app" : key
                          }`}
                          className="settings-circle-check"
                          onClick={() =>
                            set(event, {
                              [key]: !saved.value[event][key],
                            })
                          }
                        >
                          {saved.value[event][key] ? (
                            <CircleCheckIcon
                              size={16}
                              strokeWidth={1.5}
                              className="text-primary"
                            />
                          ) : (
                            <CircleIcon
                              size={16}
                              strokeWidth={1.5}
                              className="text-ink-3"
                            />
                          )}
                        </button>
                      </TableCell>
                    ))}

                    <TableCell>
                      <RecipientDropdown
                        ariaLabel={`${event} recipient`}
                        value={saved.value[event].recipient}
                        onChange={(recipient) =>
                          set(event, { recipient })
                        }
                        options={RECIPIENT_OPTIONS}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SettingsCard>
        ))}
      </div>
    </SettingsShell>
  );
}
