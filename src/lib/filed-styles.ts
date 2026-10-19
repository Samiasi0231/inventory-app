// export const fieldClass =
//   "h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm shadow-none " +
//   "placeholder:text-neutral-400 focus-visible:border-brand-500 focus-visible:ring-[3px] " +
//   "focus-visible:ring-brand-500/20 data-[size=default]:h-10";
 
// export const fieldErrorClass =
//   "border-red-300 bg-red-50 focus-visible:border-red-400 focus-visible:ring-red-200";

// src/lib/field-styles.ts
/** Shared look for inputs / select triggers so every field matches the design. */
export const fieldClass =
  "h-10 w-full rounded-md border border-neutral-200 bg-field px-3 text-sm shadow-none " +
  "placeholder:text-neutral-400 focus-visible:border-brand-500 focus-visible:ring-[3px] " +
  "focus-visible:ring-brand-500/20 disabled:bg-field data-[size=default]:h-10";

export const fieldErrorClass =
  "border-red-400 bg-[#FF0000]/10 focus-visible:border-red-500 focus-visible:ring-red-200";