"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ChevronDown, Save } from "lucide-react";

type FieldProps = {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  type?: string;
  options?: string[];
  helper?: string;
  required?: boolean;
};

function Field({
  label,
  placeholder,
  defaultValue,
  type = "text",
  options,
  helper,
  required = false,
}: FieldProps) {
  const className =
    "h-[25px] w-full min-w-0 rounded-[4px] border border-[#d7d7d7] bg-white px-[8px] text-[9px] font-normal text-[#555] outline-none placeholder:text-[#999] focus:border-[#009653] focus:ring-1 focus:ring-[#009653]/10";

  return (
    <div className="min-w-0">
      <label className="mb-[6px] block text-[8px] font-medium text-[#222]">
        {label}
      </label>

      <div className="relative">
        {options ? (
          <>
            <select
              aria-label={label}
              defaultValue={defaultValue ?? options[0]}
              required={required}
              className={`${className} appearance-none pr-7`}
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown
              size={12}
              strokeWidth={1.5}
              className="pointer-events-none absolute right-[7px] top-1/2 -translate-y-1/2 text-[#777]"
            />
          </>
        ) : (
          <input
            aria-label={label}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            required={required}
            className={className}
          />
        )}
      </div>

      {helper && <p className="mt-[4px] text-[7px] text-[#888]">{helper}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-[12px] text-[9px] font-semibold text-[#222]">
        {title}
      </h2>
      {children}
    </section>
  );
}

const businessTypes = [
  "Wholesale",
  "Retail",
  "Distributor",
  "Manufacturer",
  "Services",
  "Other",
];

const countries = ["Nigeria", "Ghana", "Kenya", "South Africa"];

const currencies = ["NGN (₦)", "USD ($)", "GBP (£)", "GHS (₵)", "KES (KSh)"];

const nigeriaStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "Federal Capital Territory",
];

const statesByCountry: Record<string, string[]> = {
  Nigeria: nigeriaStates,
  Ghana: ["Greater Accra", "Ashanti", "Central", "Eastern", "Western"],
  Kenya: ["Nairobi", "Mombasa", "Nakuru", "Kiambu"],
  "South Africa": ["Gauteng", "Western Cape", "KwaZulu-Natal"],
};

const timeZones = [
  "Africa/Lagos (WAT)",
  "Africa/Accra (GMT)",
  "Africa/Nairobi (EAT)",
  "Africa/Johannesburg (SAST)",
  "Europe/London (GMT)",
  "America/New_York (ET)",
];

const dateFormats = ["DD MM YY", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];

export default function BusinessProfilePage() {
  const [saved, setSaved] = useState(false);
  const [country, setCountry] = useState("Nigeria");
  const [region, setRegion] = useState("Lagos");
  const [currency, setCurrency] = useState("NGN (₦)");
  const [timezone, setTimezone] = useState("Africa/Lagos (WAT)");
  const [dateFormat, setDateFormat] = useState("DD MM YY");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Connect this handler to your business-profile API
    // to persist the form data in your database.
    setSaved(true);
  }

  const regionOptions = statesByCountry[country] ?? ["Other"];

  return (
    <div className="min-h-full bg-[#fafafa]">
      {/* Page header */}
      <header className="flex min-h-[44px] items-center justify-between gap-3 border-b border-[#dedede] bg-white px-[16px] py-[8px] sm:px-[17px] lg:px-[16px]">
        <div className="min-w-0">
          <h1 className="text-[12px] font-semibold leading-[16px] text-[#222]">
            Business Profile
          </h1>

          <p className="mt-[2px] text-[7px] leading-[11px] text-[#888]">
            Manage your business information and regional preferences.
          </p>
        </div>

        <button
          type="submit"
          form="business-profile-form"
          className="flex h-[24px] shrink-0 items-center gap-[5px] rounded-[4px] bg-[#009653] px-[11px] text-[8px] font-semibold text-white transition hover:bg-[#007d44] active:scale-[0.98]"
        >
          <Save size={11} />
          Save Changes
        </button>
      </header>

      {/* Form background and card */}
      <main className="px-[10px] py-[12px] sm:px-[16px] sm:py-[15px] lg:px-[16px] lg:py-[15px]">
        <form
          id="business-profile-form"
          onSubmit={handleSubmit}
          onChange={() => setSaved(false)}
          className="mx-auto max-w-[1000px] space-y-[17px] rounded-[7px] border border-[#f0f0f0] bg-white px-[10px] py-[14px] sm:px-[12px] sm:py-[14px] lg:px-[10px] lg:py-[12px]"
        >
          {saved && (
            <p
              role="status"
              className="rounded border border-[#b8ecd1] bg-[#e9fff3] px-3 py-2 text-[10px] text-[#007b45]"
            >
              Form submitted. Connect your API to save changes permanently.
            </p>
          )}

          {/* Business information */}
          <Section title="Business information">
            <div className="grid grid-cols-1 gap-x-[8px] gap-y-[10px] sm:grid-cols-2 sm:gap-x-[8px]">
              <Field
                label="Business name *"
                placeholder="Lagos Wholesale Depot"
                defaultValue="Lagos Wholesale Depot"
                required
              />

              <Field
                label="Legal business name"
                placeholder="Lagos Wholesale Depot Ltd."
                defaultValue="Lagos Wholesale Depot Ltd."
              />

              <Field
                label="Business type"
                defaultValue="Wholesale"
                options={businessTypes}
              />

              <Field
                label="Registration number"
                placeholder="RC 1234567"
                defaultValue="RC 1234567"
              />
            </div>
          </Section>

          {/* Contact information */}
          <Section title="Contact information">
            <div className="grid grid-cols-1 gap-x-[8px] gap-y-[10px] sm:grid-cols-2">
              <Field
                label="Business email"
                type="email"
                placeholder="info@lagoswholesale.com"
                defaultValue="info@lagoswholesale.com"
              />

              <Field
                label="Phone number"
                type="tel"
                placeholder="+234 801 234 5678"
                defaultValue="+234 801 234 5678"
              />

              <div className="sm:col-span-2">
                <Field
                  label="Business address"
                  placeholder="12 Broad Street"
                  defaultValue="12 Broad Street"
                  helper="Enter your primary business address"
                />
              </div>

              <Field label="City" placeholder="Ikeja" defaultValue="Ikeja" />

              <div>
                <label className="mb-[6px] block text-[8px] font-medium text-[#222]">
                  State / Region
                </label>

                <div className="relative">
                  <select
                    aria-label="State / Region"
                    value={region}
                    onChange={(event) => setRegion(event.target.value)}
                    className="h-[25px] w-full appearance-none rounded-[4px] border border-[#d7d7d7] bg-white px-[8px] pr-7 text-[9px] text-[#555] outline-none focus:border-[#009653]"
                  >
                    {regionOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={12}
                    strokeWidth={1.5}
                    className="pointer-events-none absolute right-[7px] top-1/2 -translate-y-1/2 text-[#777]"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Regional preferences */}
          <Section title="Regional Preferences">
            <div className="grid grid-cols-1 gap-x-[8px] gap-y-[10px] sm:grid-cols-2">
              <div>
                <label className="mb-[6px] block text-[8px] font-medium text-[#222]">
                  Country
                </label>

                <div className="relative">
                  <select
                    aria-label="Country"
                    value={country}
                    onChange={(event) => {
                      const nextCountry = event.target.value;
                      setCountry(nextCountry);
                      setRegion(statesByCountry[nextCountry][0]);
                    }}
                    className="h-[25px] w-full appearance-none rounded-[4px] border border-[#d7d7d7] bg-white px-[8px] pr-7 text-[9px] text-[#555] outline-none focus:border-[#009653]"
                  >
                    {countries.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={12}
                    strokeWidth={1.5}
                    className="pointer-events-none absolute right-[7px] top-1/2 -translate-y-1/2 text-[#777]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-[6px] block text-[8px] font-medium text-[#222]">
                  Default Currency
                </label>

                <div className="relative">
                  <select
                    aria-label="Default Currency"
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value)}
                    className="h-[25px] w-full appearance-none rounded-[4px] border border-[#d7d7d7] bg-white px-[8px] pr-7 text-[9px] text-[#555] outline-none focus:border-[#009653]"
                  >
                    {currencies.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={12}
                    strokeWidth={1.5}
                    className="pointer-events-none absolute right-[7px] top-1/2 -translate-y-1/2 text-[#777]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-[6px] block text-[8px] font-medium text-[#222]">
                  Time Zone
                </label>

                <div className="relative">
                  <select
                    aria-label="Time Zone"
                    value={timezone}
                    onChange={(event) => setTimezone(event.target.value)}
                    className="h-[25px] w-full appearance-none rounded-[4px] border border-[#d7d7d7] bg-white px-[8px] pr-7 text-[9px] text-[#555] outline-none focus:border-[#009653]"
                  >
                    {timeZones.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={12}
                    strokeWidth={1.5}
                    className="pointer-events-none absolute right-[7px] top-1/2 -translate-y-1/2 text-[#777]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-[6px] block text-[8px] font-medium text-[#222]">
                  Date Format
                </label>

                <div className="relative">
                  <select
                    aria-label="Date Format"
                    value={dateFormat}
                    onChange={(event) => setDateFormat(event.target.value)}
                    className="h-[25px] w-full appearance-none rounded-[4px] border border-[#d7d7d7] bg-white px-[8px] pr-7 text-[9px] text-[#555] outline-none focus:border-[#009653]"
                  >
                    {dateFormats.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={12}
                    strokeWidth={1.5}
                    className="pointer-events-none absolute right-[7px] top-1/2 -translate-y-1/2 text-[#777]"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Registration and tax information */}
          <Section title="Registration & Tax Information">
            <div className="grid grid-cols-1 gap-x-[8px] gap-y-[10px] sm:grid-cols-2">
              <Field
                label="Tax Identification Number"
                placeholder="Enter tax identification number"
                defaultValue="Nigeria"
              />

              <Field
                label="Business Registration Details"
                placeholder="Corporate Affairs Commission, RC 1234567"
                defaultValue="Corporate Affairs Commission, RC 1234567"
              />

              <Field
                label="Country"
                defaultValue="Nigeria"
                options={countries}
              />

              <Field
                label="Default Currency"
                defaultValue="NGN (₦)"
                options={currencies}
              />
            </div>
          </Section>
        </form>
      </main>
    </div>
  );
}
