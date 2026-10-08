"use client";

import { useRef } from "react";
import Image from "next/image";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CameraIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { Field, SelectInput, TextInput, TextareaInput } from "@/components/form/app-fields";
import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_SUPPLIERS } from "../../mock-data";
import { StepSection, StepSubsection } from "./step-section";
import type { AddProductValues } from "./schema";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function StepBasicInfo() {
  const {
    register,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<AddProductValues>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageDataUrl = watch("imageDataUrl");

  const { fields, append, remove } = useFieldArray({ control, name: "additionalSupplierIds" });

  function handleFile(file: File | undefined) {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("imageDataUrl", { message: "Use a JPG, PNG or WebP image" });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("imageDataUrl", { message: "That image is larger than 5 MB" });
      return;
    }

    clearErrors("imageDataUrl");
    const reader = new FileReader();
    reader.onload = () => setValue("imageDataUrl", String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <StepSection title="1. Product Information" description="Basic details about your product.">
      <div className="flex flex-col gap-5">
        <div>
          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              handleFile(event.dataTransfer.files?.[0]);
            }}
            className="relative flex h-[180px] items-center justify-center rounded-lg border border-dashed border-border"
          >
            {imageDataUrl ? (
              <>
                <Image
                  src={imageDataUrl}
                  alt="Product preview"
                  fill
                  unoptimized
                  className="rounded-lg object-contain p-2"
                />
                <button
                  type="button"
                  onClick={() => setValue("imageDataUrl", null)}
                  aria-label="Remove image"
                  className="absolute top-2 right-2 rounded-full bg-surface p-1.5 text-ink-2 shadow-sm transition-colors hover:text-destructive"
                >
                  <XIcon className="size-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 text-ink-4 transition-colors hover:text-ink-2"
              >
                <CameraIcon className="size-6" />
                <span className="text-sm">Tap to add photo</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
          </div>
          <p className="mt-1.5 text-xs text-ink-4">
            JPG, PNG or WebP • Max 5 MB • 1200 × 1200px (1:1)
          </p>
          {errors.imageDataUrl && (
            <p role="alert" className="mt-1 text-xs text-destructive">
              {errors.imageDataUrl.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product Name" htmlFor="name" required error={errors.name?.message}>
            <TextInput id="name" placeholder="Chocolate" invalid={!!errors.name} {...register("name")} />
          </Field>

          <Field label="Product Type" htmlFor="type" required error={errors.type?.message}>
            <SelectInput id="type" invalid={!!errors.type} {...register("type")}>
              <option value="physical">Physical Product</option>
              <option value="service">Service</option>
            </SelectInput>
          </Field>

          <Field label="SKU" htmlFor="sku" required error={errors.sku?.message}>
            <TextInput id="sku" placeholder="CHC-001" invalid={!!errors.sku} {...register("sku")} />
          </Field>

          <Field label="Barcode" htmlFor="barcode" error={errors.barcode?.message}>
            <TextInput id="barcode" placeholder="6001000001234" {...register("barcode")} />
          </Field>

          <Field label="Category" htmlFor="categoryId" required error={errors.categoryId?.message}>
            <SelectInput id="categoryId" invalid={!!errors.categoryId} {...register("categoryId")}>
              <option value="">Select a category</option>
              {MOCK_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="Brand (Optional)" htmlFor="brandId">
            <SelectInput id="brandId" {...register("brandId")}>
              <option value="">No brand</option>
              {MOCK_BRANDS.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>

        <Field label="Description" htmlFor="description" required error={errors.description?.message}>
          <TextareaInput
            id="description"
            placeholder="Delicious chocolate with a smooth and rich taste."
            invalid={!!errors.description}
            {...register("description")}
          />
        </Field>

        <StepSubsection
          title="Suppliers (Optional)"
          description="Link this product to your suppliers."
        >
          <Field
            label="Primary Supplier"
            htmlFor="primarySupplierId"
            required
            error={errors.primarySupplierId?.message}
          >
            <SelectInput
              id="primarySupplierId"
              invalid={!!errors.primarySupplierId}
              {...register("primarySupplierId")}
            >
              <option value="">Select a supplier</option>
              {MOCK_SUPPLIERS.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </SelectInput>
          </Field>

          <div className="rounded-lg border border-border/70 p-4">
            <p className="text-sm text-ink-2">Additional Suppliers (Optional)</p>

            {fields.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <SelectInput
                      aria-label={`Additional supplier ${index + 1}`}
                      className="h-10"
                      {...register(`additionalSupplierIds.${index}.id`)}
                    >
                      <option value="">Select a supplier</option>
                      {MOCK_SUPPLIERS.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </SelectInput>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label="Remove supplier"
                      className="shrink-0 rounded-md p-2 text-ink-4 transition-colors hover:bg-danger-bg hover:text-danger-fg"
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => append({ id: "" })}
              className="mt-3 flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-brand-700"
            >
              <PlusIcon className="size-4" />
              Add Supplier
            </button>
          </div>
        </StepSubsection>
      </div>
    </StepSection>
  );
}
