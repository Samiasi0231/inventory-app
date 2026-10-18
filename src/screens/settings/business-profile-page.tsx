"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/button";
import { Field, SelectInput, TextInput } from "@/components/form/app-fields";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useDraft } from "@/hooks/use-draft";
import { SettingsShell } from "@/features/settings/components/settings-shell";
import { settingsService } from "@/features/settings/settings.service";
import { BUSINESS_TYPES } from "@/features/settings/types";
import { SettingsCard } from "@/features/settings/components/settings-card";

const STATES = ["Lagos", "Rivers", "Abuja (FCT)", "Kano", "Oyo"];
const CITIES = ["Ikeja", "Lagos Island", "Lekki", "Port Harcourt", "Kano"];
const COUNTRIES = ["Nigeria", "Ghana", "Kenya"];
const CURRENCIES = ["Naira (₦)", "Cedi (₵)", "Shilling (KSh)"];

export default function BusinessProfilePage() {
  const toast = useToast();
  const { data, loading } = useAsyncResource(
    "business-profile",
    () => settingsService.getBusinessProfile(),
    "We couldn't load your business profile.",
  );

  const { value: form, set, reset } = useDraft(data);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!form) return;
    setSaving(true);
    try {
      await settingsService.updateBusinessProfile(form);
      reset();
      toast.add({ type: "success", title: "Changes saved" });
    } catch {
      toast.add({ type: "error", title: "Couldn't save changes" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingsShell
      title="Business Profile"
      description="Manage your business information and regional preferences."
      action={
        <PrimaryButton onClick={save} loading={saving} disabled={!form}>
          Save Changes
        </PrimaryButton>
      }
    >
      <SettingsCard>
        {loading || !form ? (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-[66px] rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-ink-1">Business information</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business name" htmlFor="businessName" required>
                  <TextInput
                    id="businessName"
                    value={form.businessName}
                    onChange={(event) => set("businessName", event.target.value)}
                  />
                </Field>
                <Field label="Legal business name" htmlFor="legalName">
                  <TextInput
                    id="legalName"
                    value={form.legalName}
                    onChange={(event) => set("legalName", event.target.value)}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business type" htmlFor="businessType">
                  <SelectInput
                    id="businessType"
                    value={form.businessType}
                    onChange={(event) => set("businessType", event.target.value)}
                  >
                    {BUSINESS_TYPES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Registration number" htmlFor="registrationNumber">
                  <TextInput
                    id="registrationNumber"
                    value={form.registrationNumber}
                    onChange={(event) => set("registrationNumber", event.target.value)}
                  />
                </Field>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-ink-1">Contact information</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business email" htmlFor="email">
                  <TextInput
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => set("email", event.target.value)}
                  />
                </Field>
                <Field label="Phone number" htmlFor="phone">
                  <TextInput
                    id="phone"
                    value={form.phone}
                    onChange={(event) => set("phone", event.target.value)}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City" htmlFor="city">
                  <SelectInput
                    id="city"
                    value={form.city}
                    onChange={(event) => set("city", event.target.value)}
                  >
                    {CITIES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="State / Region" htmlFor="state">
                  <SelectInput
                    id="state"
                    value={form.state}
                    onChange={(event) => set("state", event.target.value)}
                  >
                    {STATES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              </div>

              <Field
                label="Business address"
                htmlFor="address"
                hint="Enter your primary business address"
              >
                <TextInput
                  id="address"
                  value={form.address}
                  onChange={(event) => set("address", event.target.value)}
                />
              </Field>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-ink-1">Regional Preferences</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Country" htmlFor="country">
                  <SelectInput
                    id="country"
                    value={form.country}
                    onChange={(event) => set("country", event.target.value)}
                  >
                    {COUNTRIES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Default Currency" htmlFor="currency">
                  <SelectInput
                    id="currency"
                    value={form.currency}
                    onChange={(event) => set("currency", event.target.value)}
                  >
                    {CURRENCIES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              </div>
            </section>
          </div>
        )}
      </SettingsCard>
    </SettingsShell>
  );
}
