import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CountryField, SelectField, TextField } from "@/components/form";
import { StepFooter } from "@/components/onboarding";
import { useOnboarding } from "@/context/onboarding-context";
import { countries, currencies, staffRanges } from "@/data/locations";
import { onboardingApi } from "@/lib/api";
import { businessDetailsSchema, type BusinessDetailsValues } from "./schema";
 
const staffOptions = staffRanges.map((range) => ({ value: range, label: range }));
const currencyOptions = currencies.map((c) => ({ value: c.code, label: c.label }));
 
export function BusinessDetailsForm() {
  const navigate = useNavigate();
  const { businessType } = useOnboarding();
 
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BusinessDetailsValues>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: {
      businessName: "",
      staffRange: "",
      country: "",
      address: "",
      city: "",
      postalCode: "",
      currency: "",
      taxId: "",
    },
  });
 
  const countryCode = watch("country");
  const regionOptions = useMemo(
    () =>
      (countries.find((c) => c.code === countryCode)?.regions ?? []).map((region) => ({
        value: region,
        label: region,
      })),
    [countryCode],
  );
 
  const onSubmit = async (values: BusinessDetailsValues) => {
    await onboardingApi.saveBusiness({
      ...values,
      businessType: businessType ?? "",
      country: countries.find((c) => c.code === values.country)?.name ?? values.country,
    });
    navigate("/dashboard");
  };
 
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <TextField
          id="businessName"
          label="Business name"
          placeholder="e.g Donquixote"
          error={errors.businessName?.message}
          {...register("businessName")}
        />
 
        <Controller
          control={control}
          name="staffRange"
          render={({ field }) => (
            <SelectField
              id="staffRange"
              label="Number of staff"
              placeholder="Select number of staff"
              options={staffOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.staffRange?.message}
            />
          )}
        />
 
        <Controller
          control={control}
          name="country"
          render={({ field }) => (
            <CountryField
              value={field.value}
              error={errors.country?.message}
              onChange={(code) => {
                field.onChange(code);
                setValue("city", "");
                const country = countries.find((c) => c.code === code);
                if (country) setValue("currency", country.currency, { shouldValidate: true });
              }}
            />
          )}
        />
 
        <TextField
          id="address"
          label="Business Address"
          placeholder="Enter business address"
          error={errors.address?.message}
          {...register("address")}
        />
 
        <Controller
          control={control}
          name="city"
          render={({ field }) => (
            <SelectField
              id="city"
              label="City/Region"
              placeholder="Select city/region"
              options={regionOptions}
              value={field.value}
              onChange={field.onChange}
              disabled={!regionOptions.length}
              error={errors.city?.message}
            />
          )}
        />
 
        <TextField
          id="postalCode"
          label="Postal/Zip Code"
          placeholder="Enter Code"
          error={errors.postalCode?.message}
          {...register("postalCode")}
        />
 
        <Controller
          control={control}
          name="currency"
          render={({ field }) => (
            <SelectField
              id="currency"
              label="Base Currency"
              placeholder="Select currency"
              options={currencyOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.currency?.message}
            />
          )}
        />
 
        <TextField
          id="taxId"
          label="Tax Id/VAT"
          placeholder="Enter Tax Id/Vat"
          error={errors.taxId?.message}
          {...register("taxId")}
        />
      </div>
 
      <StepFooter
        nextType="submit"
        loading={isSubmitting}
        onBack={() => navigate("/onboarding/business-type")}
      />
    </form>
  );
}