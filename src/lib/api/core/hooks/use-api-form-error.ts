"use client";

import { useCallback, useRef, useState } from "react";
import { applyApiFieldErrors } from "../error-utils";

type Options = Parameters<typeof applyApiFieldErrors>[2];
type SetError = Parameters<typeof applyApiFieldErrors>[1];

/**
 * Wires any mutation's error into a react-hook-form form:
 *
 *   const { formError, handleError, clearError } = useApiFormError(form.setError, {
 *     fields: ["email", "password"],
 *     fieldMap: { re_password: "confirmPassword" },
 *   });
 *   register.mutate(values, { onError: handleError });
 *
 * Field errors appear under the inputs; `formError` is the banner/toast message.
 */
export function useApiFormError(setError: SetError, options?: Options) {
  const [formError, setFormError] = useState<string | null>(null);

  // Keep the latest args without re-creating handleError on every render.
  const latest = useRef({ setError, options });
  latest.current = { setError, options };

  const handleError = useCallback((error: unknown) => {
    const { setError: set, options: opts } = latest.current;
    setFormError(applyApiFieldErrors(error, set, opts) ?? null);
  }, []);

  const clearError = useCallback(() => setFormError(null), []);

  return { formError, handleError, clearError };
}
