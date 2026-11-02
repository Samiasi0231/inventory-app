/**
 * Holds the email + password from the sign-up form ONLY in memory (a module variable),
 * so the app can log the user in right after they verify their email.
 * Never written to localStorage / cookies. A page refresh wipes it, and the user is
 * then sent to sign in instead (their email is already verified).
 */
interface PendingCredentials {
  email: string;
  password: string;
}

let pending: PendingCredentials | null = null;

export const pendingCredentials = {
  set(credentials: PendingCredentials) {
    pending = credentials;
  },

  /** Returns the credentials if they belong to this email, and always forgets them. */
  take(email: string): PendingCredentials | null {
    const match =
      pending && pending.email.toLowerCase() === email.toLowerCase() ? pending : null;
    pending = null;
    return match;
  },

  clear() {
    pending = null;
  },
};
