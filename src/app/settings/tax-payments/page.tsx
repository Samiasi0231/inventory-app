"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";

type Tab = "account" | "security";

type AccountDetails = {
  fullName: string;
  email: string;
  phone: string;
};

type Session = {
  id: number;
  browser: string;
  location: string;
  lastActive: string;
};

const initialAccount: AccountDetails = {
  fullName: "Amaka Okafor",
  email: "amaka@lagoswholesale.ng",
  phone: "+234 803 111 2222",
};

const initialSessions: Session[] = [
  {
    id: 1,
    browser: "Chrome • Windows",
    location: "Lagos, NG",
    lastActive: "Now",
  },
  {
    id: 2,
    browser: "Safari • iPad",
    location: "Lagos, NG",
    lastActive: "2hrs ago",
  },
];

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-[13px] w-[13px]"
      aria-hidden="true"
    >
      <path
        d="M10 3.5v13M3.5 10h13"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[13px] w-[13px]"
      aria-hidden="true"
    >
      <path
        d="M4 8h4l1.5-2h5L16 8h4v10H4V8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-[5px]">
      <label className="block text-[8px] font-medium leading-[12px] text-[#282828]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="h-[28px] w-full rounded-[5px] border border-[#d6d6d6] bg-white px-[9px] text-[8px] text-[#333] outline-none placeholder:text-[#929292] focus:border-[#009858] focus:ring-1 focus:ring-[#009858]/20"
      />
    </div>
  );
}

function GreenButton({
  children,
  type = "button",
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-[27px] items-center justify-center rounded-[5px] bg-[#009858] px-[13px] text-[8px] font-semibold text-white transition-colors hover:bg-[#007e49] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009858] focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
}

export default function SecurityAccount() {
  const [activeTab, setActiveTab] = useState<Tab>("account");

  const [account, setAccount] = useState<AccountDetails>(initialAccount);

  const [savedAccount, setSavedAccount] =
    useState<AccountDetails>(initialAccount);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [savedImage, setSavedImage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [accountMessage, setAccountMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [sessions, setSessions] = useState<Session[]>(initialSessions);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function updateAccount(key: keyof AccountDetails, value: string) {
    setAccount((previous) => ({ ...previous, [key]: value }));
    setAccountMessage("");
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAccountMessage("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAccountMessage("Image must be 5 MB or smaller.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
        setAccountMessage("");
      }
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function saveAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!account.fullName.trim() || !account.email.trim()) {
      setAccountMessage("Name and email are required.");
      return;
    }

    setSavedAccount({ ...account });
    setSavedImage(profileImage);
    setAccountMessage("Changes saved.");
  }

  function discardAccount() {
    setAccount({ ...savedAccount });
    setProfileImage(savedImage);
    setAccountMessage("");
  }

  function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("The new passwords do not match.");
      return;
    }

    // Connect this handler to your password-change API in production.
    setPasswordMessage(
      "Form validated. Connect your backend to change the password.",
    );
  }

  function signOutSession(id: number) {
    // In production, revoke this session using your backend API.
    setSessions((previous) => previous.filter((session) => session.id !== id));
  }

  return (
    <main className="min-h-full w-full bg-[#f7f7f7] font-sans text-[#202020]">
      {/* Page header */}
      <header className="flex min-h-[46px] items-center justify-between gap-4 border-b border-[#dedede] bg-white px-4 py-[9px] sm:px-[16px]">
        <div>
          <h1 className="text-[11px] font-semibold leading-[15px] tracking-[0.05px]">
            Security &amp; Account
          </h1>
          <p className="mt-[3px] text-[7px] leading-[10px] text-[#858585]">
            Your personal account and sign-in security
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("open-add-tax-category"))
          }
          className="inline-flex h-[26px] shrink-0 items-center justify-center gap-[5px] rounded-[5px] bg-[#009858] px-[11px] text-[8px] font-medium text-white transition hover:bg-[#007e49] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009858]"
        >
          <PlusIcon />
          <span>Add Tax Category</span>
        </button>
      </header>

      <div className="space-y-[14px] px-4 pb-6 pt-[17px] sm:px-[16px]">
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Account settings"
          className="flex h-[29px] items-center gap-[4px] rounded-[7px] bg-white px-[5px]"
        >
          <button
            id="account-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "account"}
            aria-controls="account-panel"
            onClick={() => setActiveTab("account")}
            className={`h-[21px] rounded-[5px] px-[8px] text-[8px] transition-colors ${
              activeTab === "account"
                ? "bg-[#e4fff3] font-medium text-[#007e49]"
                : "text-[#303030] hover:bg-[#f5f5f5]"
            }`}
          >
            My Account
          </button>

          <button
            id="security-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "security"}
            aria-controls="security-panel"
            onClick={() => setActiveTab("security")}
            className={`h-[21px] rounded-[5px] px-[8px] text-[8px] transition-colors ${
              activeTab === "security"
                ? "bg-[#e4fff3] font-medium text-[#007e49]"
                : "text-[#303030] hover:bg-[#f5f5f5]"
            }`}
          >
            Security
          </button>
        </div>

        {/* My Account */}
        {activeTab === "account" && (
          <section
            id="account-panel"
            role="tabpanel"
            aria-labelledby="account-tab"
            className="rounded-[7px] bg-white px-[11px] pb-[10px] pt-[12px] sm:px-[11px]"
          >
            <form onSubmit={saveAccount}>
              <div className="space-y-[9px]">
                <FormField
                  label="Full name"
                  value={account.fullName}
                  onChange={(value) => updateAccount("fullName", value)}
                  autoComplete="name"
                />

                <FormField
                  label="Email address"
                  value={account.email}
                  onChange={(value) => updateAccount("email", value)}
                  type="email"
                  autoComplete="email"
                />

                <FormField
                  label="Phone number"
                  value={account.phone}
                  onChange={(value) => updateAccount("phone", value)}
                  type="tel"
                  autoComplete="tel"
                />

                {/* Profile image */}
                <div className="space-y-[5px]">
                  <label className="block text-[8px] font-medium leading-[12px]">
                    Profile Image
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="sr-only"
                    aria-label="Upload profile image"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-[46px] w-full max-w-[158px] flex-col items-center justify-center gap-[4px] rounded-[5px] border border-dashed border-[#d5d5d5] bg-white text-[#777] transition hover:border-[#009858] hover:bg-[#f8fffb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009858]"
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Selected profile"
                        className="h-[22px] w-[22px] rounded-full object-cover"
                      />
                    ) : (
                      <CameraIcon />
                    )}

                    <span className="text-[7px] leading-[10px]">
                      {profileImage
                        ? "Change profile image"
                        : "Tap to upload profile image"}
                    </span>
                  </button>

                  <p className="text-[6px] leading-[9px] text-[#929292]">
                    JPG, PNG or WebP · Max 5 MB · 1200 × 1200px (1:1)
                  </p>
                </div>
              </div>

              <div className="mt-[23px] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={discardAccount}
                    className="text-[8px] text-[#777] transition hover:text-[#009858]"
                  >
                    Discard
                  </button>

                  {accountMessage && (
                    <p
                      role="status"
                      aria-live="polite"
                      className="text-[8px] text-[#00864e]"
                    >
                      {accountMessage}
                    </p>
                  )}
                </div>

                <GreenButton type="submit">Save Changes</GreenButton>
              </div>
            </form>
          </section>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <div
            id="security-panel"
            role="tabpanel"
            aria-labelledby="security-tab"
            className="space-y-[14px]"
          >
            {/* Change password card */}
            <section className="rounded-[7px] bg-white px-[11px] pb-[11px] pt-[12px]">
              <h2 className="mb-[11px] text-[9px] font-semibold leading-[13px]">
                Change password
              </h2>

              <form onSubmit={updatePassword}>
                <div className="space-y-[9px]">
                  <FormField
                    label="Current password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                  />

                  <FormField
                    label="New password"
                    value={newPassword}
                    onChange={setNewPassword}
                    type="password"
                    autoComplete="new-password"
                  />

                  <FormField
                    label="Confirm new password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    type="password"
                    autoComplete="new-password"
                  />
                </div>

                <div className="mt-[14px] flex flex-wrap items-center justify-end gap-3">
                  {passwordMessage && (
                    <p
                      role="status"
                      aria-live="polite"
                      className="max-w-full text-right text-[8px] text-[#00864e]"
                    >
                      {passwordMessage}
                    </p>
                  )}

                  <GreenButton type="submit">Update Password</GreenButton>
                </div>
              </form>
            </section>

            {/* Active sessions card */}
            <section className="rounded-[7px] bg-white px-[11px] pb-[10px] pt-[12px]">
              <h2 className="mb-[10px] text-[9px] font-semibold leading-[13px]">
                Active Sessions
              </h2>

              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[400px] border-collapse text-left">
                  <thead>
                    <tr className="h-[21px] bg-[#f7f7f7]">
                      <th className="rounded-l-[4px] px-[9px] text-[6px] font-medium text-[#454545]">
                        Tax name
                      </th>
                      <th className="px-[9px] text-[6px] font-medium text-[#454545]">
                        Location
                      </th>
                      <th className="px-[9px] text-[6px] font-medium text-[#454545]">
                        Last Active
                      </th>
                      <th className="rounded-r-[4px] px-[9px]" />
                    </tr>
                  </thead>

                  <tbody>
                    {sessions.map((session) => (
                      <tr
                        key={session.id}
                        className="h-[33px] border-b border-[#e9e9e9] last:border-b-0"
                      >
                        <td className="whitespace-nowrap px-[9px] text-[7px] text-[#555]">
                          {session.browser}
                        </td>

                        <td className="whitespace-nowrap px-[9px] text-[7px] text-[#555]">
                          {session.location}
                        </td>

                        <td className="whitespace-nowrap px-[9px] text-[7px] text-[#555]">
                          {session.lastActive}
                        </td>

                        <td className="px-[9px] text-right">
                          <button
                            type="button"
                            onClick={() => signOutSession(session.id)}
                            className="whitespace-nowrap text-[7px] text-[#f04444] transition hover:text-[#bd2020] focus-visible:outline-none focus-visible:underline"
                          >
                            Sign Out
                          </button>
                        </td>
                      </tr>
                    ))}

                    {sessions.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-5 text-center text-[8px] text-[#888]"
                        >
                          No active sessions to display.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
