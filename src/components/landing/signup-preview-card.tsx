import { GoogleIcon } from "@/components/google-icon";
import { ButtonLink } from "@/components/landing/button-link";
 
function FakeField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-medium text-neutral-700">{label}</p>
      <div className="flex h-9 items-center rounded-md border border-neutral-200 bg-white px-3 text-[11px] text-neutral-400">
        {placeholder}
      </div>
    </div>
  );
}
 
/** Lookalike of the real sign-up form; the buttons take people to /signup. */
export function SignupPreviewCard() {
  return (
    <div className="mx-auto w-full max-w-[340px] rounded-xl border border-neutral-200 bg-neutral-50 p-6 shadow-lg">
      <h3 className="text-base font-bold text-neutral-800">Get started with us!</h3>
 
      <div className="mt-4 space-y-3" aria-hidden>
        <FakeField label="Email" placeholder="e.g noname@gmail.com" />
        <FakeField label="Password" placeholder="Enter password" />
        <FakeField label="Confirm Password" placeholder="Retype password" />
      </div>
 
      <ButtonLink href="/signup" variant="primary" size="md" className="mt-5 w-full">
        Sign Up
      </ButtonLink>
 
      <div className="my-3 flex items-center gap-3 text-[10px] text-neutral-400" aria-hidden>
        <span className="h-px flex-1 bg-neutral-200" />
        Or
        <span className="h-px flex-1 bg-neutral-200" />
      </div>
 
      <ButtonLink href="/signup" variant="outline" size="md" className="w-full border-neutral-200 text-neutral-700">
        <GoogleIcon className="size-4" />
        Continue with google
      </ButtonLink>
    </div>
  );
}

