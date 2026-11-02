import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryButton } from "@/components/button";
import { CenteredSubmit, ResendCode } from "@/components/auth";
import { TextField } from "@/components/form";
import { useCountdown } from "@/hooks/use-countdown";
import { ApiError, getErrorMessage } from "@/lib/api/core"; // new
import { verifyCodeSchema, type VerifyCodeValues } from "./auth.schema";

const RESEND_SECONDS = 60;

interface VerifyCodeFormProps {
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  centered?: boolean;
}

export function VerifyCodeForm({ onVerify, onResend, centered = false }: VerifyCodeFormProps) {
  const { secondsLeft, start } = useCountdown(0);
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
    } catch (error) {
      // a wrong or expired code keeps your message; network and server problems show the real one
      setServerError(
        error instanceof ApiError && (error.status === null || error.status >= 500)
          ? error.message
          : "That code is invalid or has expired. Request a new one.",
      );
    }
  };

  const resend = async () => {
    setServerError(null);
    try {
      await onResend();
      start(RESEND_SECONDS);
    } catch (error) {
      setServerError(getErrorMessage(error, "We couldn't resend the code. Please try again."));
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
        hint={<ResendCode seconds={secondsLeft} onResend={resend} />}
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