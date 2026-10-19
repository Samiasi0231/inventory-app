"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { CameraIcon, PlusIcon } from "lucide-react";
import { Field, TextInput } from "@/components/form/app-fields";
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
  SettingsSection,
  SaveSettings,
} from "@/features/settings/components/settings-controls";
import { useSavedSettings } from "@/features/settings/hooks/use-saved-settings";

const defaults = {
  name: "Amaka Okafor",
  email: "amaka@lagoswholesale.ng",
  phone: "+234 803 111 2222",
  image: "",
};

export default function SecuritySettingsPage() {
  const [tab, setTab] = useState<"My Account" | "Security">("My Account");
  const saved = useSavedSettings("account", defaults);
  const sessions = useSavedSettings("sessions", [
    "Chrome • Windows",
    "Safari • Ipad",
  ]);
  const [draft, setDraft] = useState<typeof defaults | null>(null);
  const value = draft ?? saved.value;
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const toast = useToast();
  function save(event: FormEvent) {
    event.preventDefault();
    try {
      saved.save(value);
      toast.add({ type: "success", title: "Changes saved" });
    } catch {
      toast.add({
        type: "error",
        title: "Couldn't save changes",
        description:
          "Your browser storage may be full. Try a smaller profile image.",
      });
    }
  }
  function updatePassword(event: FormEvent) {
    event.preventDefault();
    if (passwords.next.length < 8) {
      setPasswordError("Use at least 8 characters for your new password.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordError("The new passwords do not match.");
      return;
    }
    if (passwords.current === passwords.next) {
      setPasswordError(
        "Choose a password different from your current password.",
      );
      return;
    }
    setPasswordError("");
    toast.add({
      type: "info",
      title: "Password update unavailable",
      description:
        "This demo isn't connected to an account service. Your password has not changed.",
    });
    setPasswords({ current: "", next: "", confirm: "" });
  }
  function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setUploadError("Choose a JPG, PNG or WebP image smaller than 5 MB.");
      event.target.value = "";
      return;
    }
    setUploadError("");
    const reader = new FileReader();
    reader.onload = () => setDraft({ ...value, image: String(reader.result) });
    reader.onerror = () =>
      setUploadError("Couldn't read this image. Please try again.");
    reader.readAsDataURL(file);
  }
  return (
    <SettingsShell
      title="Security & Account"
      description="Your personal account and sign-in security"
      action={
        <Link href="/settings/tax" className="settings-primary-link">
          <PlusIcon size={24} strokeWidth={1.5} />
          Add Tax Category
        </Link>
      }
    >
      <SettingsTabs
        tabs={["My Account", "Security"]}
        value={tab}
        onChange={setTab}
      />
      <div
        id="settings-tab-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab.replaceAll(" ", "-")}`}
      >
        {tab === "My Account" ? (
          <SettingsCard>
            <form
              className="settings-form settings-account-form"
              onSubmit={save}
            >
              <Field label="Full name" htmlFor="account-name">
                <TextInput
                  id="account-name"
                  required
                  value={value.name}
                  onChange={(e) => setDraft({ ...value, name: e.target.value })}
                />
              </Field>
              <Field label="Email address" htmlFor="account-email">
                <TextInput
                  id="account-email"
                  type="email"
                  required
                  value={value.email}
                  onChange={(e) =>
                    setDraft({ ...value, email: e.target.value })
                  }
                />
              </Field>
              <Field label="Phone number" htmlFor="account-phone">
                <TextInput
                  id="account-phone"
                  type="tel"
                  value={value.phone}
                  onChange={(e) =>
                    setDraft({ ...value, phone: e.target.value })
                  }
                />
              </Field>
              <div className="settings-upload-field">
                <label htmlFor="profile-image">Profile Image</label>
                <input
                  ref={fileInput}
                  id="profile-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={upload}
                />
                <button
                  type="button"
                  className="settings-upload"
                  onClick={() => fileInput.current?.click()}
                >
                  {value.image ? (
                    <span
                      className="settings-upload-preview"
                      style={{ backgroundImage: `url("${value.image}")` }}
                    />
                  ) : (
                    <CameraIcon size={18} strokeWidth={1.5} />
                  )}
                  <span>
                    {value.image
                      ? "Change profile image"
                      : "Tap to upload profile image"}
                  </span>
                </button>
                <small>JPG, PNG or WebP • Max 5 MB • 1200 × 1200px (1:1)</small>
                {uploadError && (
                  <p role="alert" className="settings-error">
                    {uploadError}
                  </p>
                )}
              </div>
              <SaveSettings />
            </form>
          </SettingsCard>
        ) : (
          <div className="settings-security-cards">
            <SettingsCard>
              <form className="settings-form" onSubmit={updatePassword}>
                <SettingsSection title="Change password">
                  <Field label="Current password" htmlFor="current-password">
                    <TextInput
                      id="current-password"
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder="********"
                      value={passwords.current}
                      onChange={(e) =>
                        setPasswords({ ...passwords, current: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="New password" htmlFor="new-password">
                    <TextInput
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      value={passwords.next}
                      onChange={(e) =>
                        setPasswords({ ...passwords, next: e.target.value })
                      }
                    />
                  </Field>
                  <Field
                    label="Confirm new password"
                    htmlFor="confirm-password"
                    error={passwordError || undefined}
                  >
                    <TextInput
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirm: e.target.value })
                      }
                    />
                  </Field>
                </SettingsSection>
                <SaveSettings label="Update Password" />
              </form>
            </SettingsCard>
            <SettingsCard>
              <h2>Active Sessions</h2>
              <Table className="settings-table settings-session-table">
                <TableHeader>
                  <TableRow>
                    {["Tax name", "Location", "Last Active", ""].map((h, i) => (
                      <TableHead key={i}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.value.map((session, i) => (
                    <TableRow key={session}>
                      <TableCell>{session}</TableCell>
                      <TableCell>Lagos, NG</TableCell>
                      <TableCell>{i === 0 ? "Now" : "2hrs ago"}</TableCell>
                      <TableCell>
                        {i !== 0 && (
                          <button
                            type="button"
                            className="text-destructive"
                            onClick={() => {
                              try {
                                sessions.save(
                                  sessions.value.filter((s) => s !== session),
                                );
                                toast.add({
                                  type: "info",
                                  title: "Demo session removed",
                                  description:
                                    "No real account sessions were changed.",
                                });
                              } catch {
                                toast.add({
                                  type: "error",
                                  title: "Couldn't remove demo session",
                                });
                              }
                            }}
                          >
                            Sign Out
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </SettingsCard>
          </div>
        )}
      </div>
    </SettingsShell>
  );
}
