"use client";

import { useRef, useState } from "react";

type Tab = "account" | "security";

type Session = {
  id: number;
  device: string;
  location: string;
  active: string;
};

const initialSessions: Session[] = [
  {
    id: 1,
    device: "Chrome • Windows",
    location: "Lagos, NG",
    active: "Now",
  },
  {
    id: 2,
    device: "Safari • iPad",
    location: "Lagos, NG",
    active: "2hrs ago",
  },
];

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M4 8h4l1.5-2h5L16 8h4v10H4z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md px-3 py-[7px] text-[11px] transition-colors ${
        active
          ? "bg-[#e6fff3] font-medium text-[#008c50]"
          : "bg-transparent text-[#454545] hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-[7px] block text-[11px] font-medium text-[#343434]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-[38px] w-full rounded-[6px] border border-[#d8d8d8] bg-white px-[10px] text-[12px] text-[#333] outline-none transition placeholder:text-[#a2a2a2] focus:border-[#009557] focus:ring-1 focus:ring-[#009557]/20"
      />
    </label>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className="mb-[7px] block text-[11px] font-medium text-[#343434]">
        {label}
      </span>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-[38px] w-full rounded-[6px] border border-[#d8d8d8] bg-white px-[10px] pr-10 text-[12px] outline-none focus:border-[#009557] focus:ring-1 focus:ring-[#009557]/20"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-3 text-[#888] hover:text-[#333]"
        >
          {visible ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
              <path d="M9.9 5.2A11.8 11.8 0 0112 5c5.5 0 9 7 9 7a14 14 0 01-3 3.8M6.2 6.2C4.1 7.7 3 10 3 12c0 0 3.5 7 9 7 1 0 2-.2 2.9-.6" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </label>
  );
}

function PrimaryButton({
  children,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex min-h-[36px] items-center justify-center gap-2 rounded-[5px] bg-[#009653] px-4 py-2 text-[11px] font-medium text-white transition hover:bg-[#007f46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009653]/40"
    >
      {children}
    </button>
  );
}

export default function SecurityAccountPage() {
  const [tab, setTab] = useState<Tab>("account");
  const [fullName, setFullName] = useState("Amaka Okafor");
  const [email, setEmail] = useState("amaka@lagoswholesale.ng");
  const [phone, setPhone] = useState("+234 803 111 2222");
  const [photo, setPhoto] = useState("");
  const [currentPassword, setCurrentPassword] = useState("password");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sessions, setSessions] = useState(initialSessions);
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  function saveAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Account details updated successfully.");
  }

  function updatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Your new password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("The new passwords do not match.");
      return;
    }

    setMessage("Password form validated. Connect your API to save it.");
  }

  function selectPhoto(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("The image must be smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(String(reader.result));
      setMessage("");
    };

    reader.readAsDataURL(file);
  }

  function signOut(id: number) {
    setSessions((current) => current.filter((session) => session.id !== id));
    setMessage("Session removed from this page.");
  }

  return (
    <main className="min-h-screen w-full bg-[#f7f7f7] font-sans text-[#292929]">
      {/* Main page header — no sidebar */}
      <header className="flex min-h-[60px] flex-wrap items-center justify-between gap-3 border-b border-[#e8e8e8] bg-white px-5 py-3 sm:px-7 lg:px-8">
        <div>
          <h1 className="text-[17px] font-semibold leading-6 tracking-[-0.3px]">
            Security &amp; Account
          </h1>
          <p className="mt-1 text-[11px] text-[#909090]">
            Your personal account and sign-in security
          </p>
        </div>

        <PrimaryButton
          onClick={() => setMessage("Tax category action clicked.")}
        >
          <PlusIcon />
          Add Tax Category
        </PrimaryButton>
      </header>

      <div className="mx-auto w-full max-w-[1100px] px-4 py-5 sm:px-6 lg:px-7">
        {/* Tabs */}
        <div className="mb-4 flex min-h-[42px] items-center gap-1 rounded-[8px] border border-[#f0f0f0] bg-white p-1">
          <TabButton
            active={tab === "account"}
            onClick={() => {
              setTab("account");
              setMessage("");
            }}
          >
            My Account
          </TabButton>

          <TabButton
            active={tab === "security"}
            onClick={() => {
              setTab("security");
              setMessage("");
            }}
          >
            Security
          </TabButton>
        </div>

        {message && (
          <div
            role="status"
            className="mb-4 rounded-md border border-[#c9efdc] bg-[#edfff5] px-3 py-2 text-[12px] text-[#087d49]"
          >
            {message}
            <button
              type="button"
              onClick={() => setMessage("")}
              className="float-right ml-3 font-semibold"
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {tab === "account" ? (
          <section className="rounded-[9px] border border-[#f0f0f0] bg-white p-4 sm:p-5">
            <form onSubmit={saveAccount}>
              <div className="space-y-[15px]">
                <Field
                  label="Full name"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Enter your full name"
                />

                <Field
                  label="Email address"
                  value={email}
                  onChange={setEmail}
                  type="email"
                  placeholder="Enter your email address"
                />

                <Field
                  label="Phone number"
                  value={phone}
                  onChange={setPhone}
                  type="tel"
                  placeholder="+234 803 111 2222"
                />

                {/* Profile image */}
                <div>
                  <span className="mb-[8px] block text-[11px] font-medium text-[#343434]">
                    Profile Image
                  </span>

                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => selectPhoto(e.target.files?.[0])}
                  />

                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className="flex h-[92px] w-full max-w-[260px] flex-col items-center justify-center gap-2 rounded-[7px] border border-dashed border-[#d2d2d2] bg-white text-[#858585] transition hover:border-[#009653] hover:bg-[#f8fffb]"
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt="Profile preview"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <CameraIcon />
                    )}
                    <span className="text-[10px]">
                      {photo
                        ? "Change profile image"
                        : "Tap to upload profile image"}
                    </span>
                  </button>

                  <p className="mt-2 text-[9px] leading-4 text-[#999]">
                    JPG, PNG or WebP • Max 5 MB • 1200 × 1200px (1:1)
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <PrimaryButton type="submit">Save Changes</PrimaryButton>
              </div>
            </form>
          </section>
        ) : (
          <div className="space-y-4">
            {/* Change password */}
            <section className="rounded-[9px] border border-[#f0f0f0] bg-white p-4 sm:p-5">
              <h2 className="mb-5 text-[13px] font-semibold">
                Change password
              </h2>

              <form onSubmit={updatePassword}>
                <div className="space-y-4">
                  <PasswordField
                    label="Current password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                  />

                  <PasswordField
                    label="New password"
                    value={newPassword}
                    onChange={setNewPassword}
                  />

                  <PasswordField
                    label="Confirm new password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                  />
                </div>

                <div className="mt-4 flex justify-end">
                  <PrimaryButton type="submit">Update Password</PrimaryButton>
                </div>
              </form>
            </section>

            {/* Active sessions */}
            <section className="rounded-[9px] border border-[#f0f0f0] bg-white p-4 sm:p-5">
              <h2 className="mb-4 text-[13px] font-semibold">
                Active Sessions
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-left">
                  <thead>
                    <tr className="bg-[#f7f7f7] text-[10px] text-[#555]">
                      <th className="rounded-l-[5px] px-3 py-[10px] font-medium">
                        Tax name
                      </th>
                      <th className="px-3 py-[10px] font-medium">Location</th>
                      <th className="px-3 py-[10px] font-medium">
                        Last Active
                      </th>
                      <th className="rounded-r-[5px] px-3 py-[10px] font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sessions.map((session) => (
                      <tr
                        key={session.id}
                        className="border-b border-[#ededed] last:border-b-0"
                      >
                        <td className="px-3 py-4 text-[11px] text-[#555]">
                          {session.device}
                        </td>
                        <td className="px-3 py-4 text-[11px] text-[#555]">
                          {session.location}
                        </td>
                        <td className="px-3 py-4 text-[11px] text-[#555]">
                          {session.active}
                        </td>
                        <td className="px-3 py-4">
                          <button
                            type="button"
                            onClick={() => signOut(session.id)}
                            className="text-[11px] text-[#ff4545] hover:underline"
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
                          className="px-3 py-6 text-center text-[11px] text-[#888]"
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
