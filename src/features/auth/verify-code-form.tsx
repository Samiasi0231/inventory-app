import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryButton } from "@/components/button";
import { CenteredSubmit, ResendCode } from "@/components/auth";
import { TextField } from "@/components/form";
import { useCountdown } from "@/hooks/use-countdown";
import { verifyCodeSchema, type VerifyCodeValues } from "./auth.schema";
 
const RESEND_SECONDS = 60;
 
interface VerifyCodeFormProps {
  /** Verify the code. Throw to show the "invalid code" error. */
  onVerify: (code: string) => Promise<void>;
  /** Request a new code. Throw to show the "couldn't resend" error. */
  onResend: () => Promise<void>;
  /** Centered narrow button (single-column screens) instead of full width. */
  centered?: boolean;
}
 
export function VerifyCodeForm({ onVerify, onResend, centered = false }: VerifyCodeFormProps) {
  const { seconds, start } = useCountdown(0);
  const [serverError, setServerError] = useState<string | null>(null);
 
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyCodeValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: "" },
  });
 
  const submit = async ({ code }: VerifyCodeValues) => {
    setServerError(null);
    try {
      await onVerify(code);
    } catch {
      setServerError("That code is invalid or has expired. Request a new one.");
    }
  };
 
  const resend = async () => {
    setServerError(null);
    try {
      await onResend();
      start(RESEND_SECONDS);
    } catch {
      setServerError("We couldn't resend the code. Please try again.");
    }
  };
 
  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
      <TextField
        id="code"
        label="Input Code"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="Input Code"
        className="h-11"
        error={errors.code?.message ?? serverError ?? undefined}
        hint={<ResendCode seconds={seconds} onResend={resend} />}
        {...register("code")}
      />
 
      {centered ? (
        <CenteredSubmit label="Verify" withArrow={false} loading={isSubmitting} className="mt-2" />
      ) : (
        <PrimaryButton type="submit" fullWidth loading={isSubmitting} className="mt-2 h-11">
          Verify
        </PrimaryButton>
      )}
    </form>
  );
}