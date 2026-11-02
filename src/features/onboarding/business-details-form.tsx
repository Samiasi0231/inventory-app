"use client";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CountryField, SelectField, TextField } from "@/components/form";
import { StepFooter } from "@/components/onboarding";
import { useOnboarding } from "@/context/onboarding-context";
import { countries, currencies, staffRanges } from "@/data/locations";
import {
  applyApiFieldErrors,
  authSession,
  useCreateOrganization,
  type CreateOrganizationPayload,
} from "@/lib/api/index";
import { dialCodeFor, toInternationalPhone } from "./phone";
import {
  businessDetailsSchema,
  type BusinessDetailsValues,
} from "./schema";

const staffSizeOptions = staffRanges.map((range) => ({
  value: range,
  label: range,
}));

const currencyOptions = currencies.map((currency) => ({
  value: currency.code,
  label: currency.label,
}));

export function BusinessDetailsForm() {
  const router = useRouter();
  const { businessType, fullName, setBusinessProfile } = useOnboarding();

  const createOrganization = useCreateOrganization(); // POST /api/organizations/

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<BusinessDetailsValues>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: {
      businessName: "",
      staffSize: "",
      country: "",
      address: "",
      city: "",
      postalCode: "",
      currency: "",
      taxId: "",
      phone: "",
    },
  });

  const countryCode = watch("country");
  const dialCode = dialCodeFor(countryCode); // "NG" -> "+234"

  const regionOptions = useMemo(
    () =>
      (
        countries.find((country) => country.code === countryCode)?.regions ??
        []
      ).map((region) => ({
        value: region,
        label: region,
      })),
    [countryCode],
  );

  const onSubmit = async (values: BusinessDetailsValues) => {
    if (!businessType) {
      setError("root", { type: "server", message: "Please choose a business type first." });
      return;
    }

    const countryName =
      countries.find((country) => country.code === values.country)?.name ??
      values.country;

    // your form fields -> the backend's field names
    const phone = toInternationalPhone(values.phone, values.country); // "0803 123 4567" -> "+2348031234567"

    const payload: CreateOrganizationPayload = {
      business_type: businessType, // the backend code, e.g. "retail"
      name: values.businessName.trim(),
      country: values.country, // ISO code, e.g. "NG"
      state: values.city, // your "City/Region" select is the backend's `state`
      address: values.address.trim(),
      currency: values.currency, // ISO code, e.g. "NGN"
      staff_size: values.staffSize,
      ...(values.postalCode?.trim() ? { postal_code: values.postalCode.trim() } : {}),
      ...(values.taxId?.trim() ? { tax_id: values.taxId.trim() } : {}),
      ...(phone ? { phone } : {}),
    };

    try {
      await createOrganization.mutateAsync(payload);

      // onboarding is finished: without this the dashboard guard sends the user back here
      authSession.patch({ registrationComplete: true });

      setBusinessProfile({
        fullName,
        businessName: values.businessName,
        city: values.city,
        country: countryName,
      });
      router.push("/onboarding/");
    } catch (error) {
      // field errors appear under their inputs; anything else lands in your existing root message
      const message = applyApiFieldErrors(error, setError, {
        fields: [
          "businessName",
          "staffSize",
          "country",
          "address",
          "city",
          "postalCode",
          "currency",
          "taxId",
          "phone",
        ],
        fieldMap: {
          name: "businessName",
          staff_size: "staffSize",
          state: "city",
          postal_code: "postalCode",
          tax_id: "taxId",
        },
      });

      if (message) {
        setError("root", {
          type: "server",
          message: message || "We couldn't save your business details. Please try again.",
        });
      }
    }
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
          name="staffSize"
          render={({ field }) => (
            <SelectField
              id="staffSize"
              label="Staff size"
              placeholder="Select staff size"
              options={staffSizeOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.staffSize?.message}
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

                const country = countries.find(
                  (item) => item.code === code,
                );

                if (country) {
                  setValue("currency", country.currency, {
                    shouldValidate: true,
                  });
                }

                // a phone typed for the previous country may no longer be valid
                if (getValues("phone")) void trigger("phone");
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

        <TextField
          id="phone"
          label="Phone number"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="Enter phone number"
          hint={
            dialCode
              ? `Country code ${dialCode} is added automatically`
              : "Select a country to add its code"
          }
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      {errors.root?.message && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {errors.root.message}
        </p>
      )}

      <StepFooter
        nextType="submit"
        loading={isSubmitting}
        onBack={() => router.push("/onboarding/business-type")}
      />
    </form>
  );
}