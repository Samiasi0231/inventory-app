import { normalizeError } from "./fetcher";

/** Readable message for any thrown value (toast, banner, etc.). */
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const message = normalizeError(error).message;
  return message || fallback;
}

type SetFieldError = (
  // react-hook-form's setError accepts any field name; typed loosely so it fits every form.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  name: any,
  error: { type: string; message: string },
) => void;

interface ApplyFieldErrorsOptions {
  /** Backend field -> form field, e.g. { re_password: "confirmPassword", token: "code" }. */
  fieldMap?: Record<string, string>;
  /** Form fields that exist. Errors for any other field become the form-level message. */
  fields?: readonly string[];
}

/**
 * Pushes backend validation errors onto form fields.
 * Returns a form-level message (wrong credentials, non_field_errors, network errors,
 * errors for fields the form doesn't have) to show in a banner or toast, or
 * undefined when every error landed on a field.
 */
export function applyApiFieldErrors(
  error: unknown,
  setError: SetFieldError,
  options: ApplyFieldErrorsOptions = {},
): string | undefined {
  const apiError = normalizeError(error);
  const entries = Object.entries(apiError.fieldErrors);
  const unmapped: string[] = [];

  for (const [field, messages] of entries) {
    const target = options.fieldMap?.[field] ?? field;
    const exists = !options.fields || options.fields.includes(target);

    if (field !== "non_field_errors" && exists && messages[0]) {
      setError(target, { type: "server", message: messages[0] });
    } else {
      unmapped.push(...messages);
    }
  }

  if (unmapped.length) return unmapped.join(" ");
  return entries.length ? undefined : apiError.message;
}
