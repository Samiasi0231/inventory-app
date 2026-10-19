"use client";

import { CircleIcon, CircleCheckIcon } from "lucide-react";
import { SelectInput } from "@/components/form/app-fields";
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
  { title: "Sales", events: ["Large Sale", "Failed Transaction", "Refunds"] },
  { title: "Security", events: ["Failed Logins", "Permission Changes"] },
  {
    title: "Operations",
    events: [
      "Pending Approvals",
      "Approval decisions",
      "Incoming Sales Orders",
    ],
  },
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

export default function NotificationsSettingsPage() {
  const saved = useSavedSettings("notifications", defaults);
  const toast = useToast();
  function set(event: string, next: Partial<Preference>) {
    try {
      saved.save({
        ...saved.value,
        [event]: { ...saved.value[event], ...next },
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
                    (h) => (
                      <TableHead key={h}>{h}</TableHead>
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
                          aria-label={`${event}: ${key === "inApp" ? "In-app" : key}`}
                          className="settings-circle-check"
                          onClick={() =>
                            set(event, { [key]: !saved.value[event][key] })
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
                      <SelectInput
                        aria-label={`${event} recipient`}
                        value={saved.value[event].recipient}
                        onChange={(e) =>
                          set(event, { recipient: e.target.value })
                        }
                      >
                        {[
                          "Inventory Manager, Manager",
                          "Inventory Manager",
                          "Manager",
                          "Owner",
                        ].map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </SelectInput>
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
