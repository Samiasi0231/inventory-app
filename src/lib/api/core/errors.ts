import type { ApiErrorShape } from "./types";

/** Machine-readable codes the backend puts in the `code` field of an error body. */
export const API_ERROR_CODES = {
  EMAIL_NOT_VERIFIED: "email_not_verified",
} as const;

/**
 * TEMPORARY fallback: today the backend only sends a sentence ("Your account is not yet verified, ...").
 * Delete this once it sends `code: "email_not_verified"`.
 */
const NOT_VERIFIED_MESSAGE = /not\s+(yet\s+)?verified/i;

export class ApiError extends Error implements ApiErrorShape {
  status: number | null;
  /** The backend's own `code` (e.g. "email_not_verified"), else the transport code (e.g. "ERR_NETWORK"). */
  code?: string;
  fieldErrors: Record<string, string[]>;
  details?: unknown;

  constructor(shape: Partial<ApiErrorShape> & { message: string }) {
    super(shape.message);
    this.name = "ApiError";
    this.status = shape.status ?? null;
    this.code = shape.code;
    this.fieldErrors = shape.fieldErrors ?? {};
    this.details = shape.details;
  }

  get isNetworkError() {
    return this.status === null;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isValidationError() {
    return this.status === 400 && Object.keys(this.fieldErrors).length > 0;
  }

  /** Login with the right password on an account whose email is not verified yet. */
  get isEmailNotVerified() {
    if (this.code === API_ERROR_CODES.EMAIL_NOT_VERIFIED) return true;
    // fallback: a 4xx whose message says the account is not verified
    return (
      this.status !== null &&
      this.status >= 400 &&
      this.status < 500 &&
      NOT_VERIFIED_MESSAGE.test(this.message)
    );
  }
}