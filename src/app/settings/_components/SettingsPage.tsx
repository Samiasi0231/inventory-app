import type { ReactNode } from "react";

type SettingsPageProps = {
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
};

export function SettingsPage({
  title,
  description,
  children,
  action,
}: SettingsPageProps) {
  return (
    <>
      <header className="flex min-h-[63px] items-center justify-between gap-3 border-b border-[#dedede] px-4 py-3 sm:px-6 lg:px-[25px]">
        <div>
          <h1 className="text-[15px] font-semibold text-[#222]">{title}</h1>
          <p className="mt-1 text-[10px] text-[#888]">{description}</p>
        </div>

        {action}
      </header>

      <main className="min-h-full bg-[#fafafa] p-3 sm:p-5 lg:px-[25px] lg:py-4">
        <div className="mx-auto max-w-[1100px] space-y-5 rounded-[8px] border border-[#f0f0f0] bg-white p-4 sm:p-5">
          {children}
        </div>
      </main>
    </>
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
    <section className="space-y-4">
      <h2 className="text-[12px] font-semibold text-[#252525]">{title}</h2>
      {children}
    </section>
  );
}

export function SettingsInput({
  label,
  placeholder,
  defaultValue,
}: {
  label: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block min-w-0 text-[11px] font-medium text-[#252525]">
      {label}
      <input
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-[7px] h-[41px] w-full rounded-[5px] border border-[#d7d7d7] bg-white px-[10px] text-[11px] font-normal text-[#555] outline-none focus:border-[#009653] focus:ring-2 focus:ring-[#009653]/10"
      />
    </label>
  );
}
