"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CenteredSubmit, FormAlert } from "@/components/auth";
import { PasswordField } from "@/components/form";
import { useOnboarding } from "@/context/onboarding-context";
import { ApiError, useResetPasswordConfirm } from "@/lib/api/index"; // [1] replaces authApi
import { resetPasswordSchema, type ResetPasswordValues } from "./auth.schema";

export function ResetPasswordForm() {
  const router = useRouter();
  const { email, resetToken, setResetToken } = useOnboarding();
  const [serverError, setServerError] = useState<string | null>(null);
  const [codeProblem, setCodeProblem] = useState(false); 

  const resetPassword = useResetPasswordConfirm(); 


  useEffect(() => {
    if (!resetToken) router.replace("/forgot-password/verify");
  }, [resetToken, router]);

  const {
    register,
    handleSubmit,
    setError, 
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async ({ password, confirmPassword }: ResetPasswordValues) => {
    setServerError(null);
    setCodeProblem(false);
    try {
      await resetPassword.mutateAsync({
        email,
        token: resetToken ?? "",
        new_password: password,
        re_new_password: confirmPassword,
      });
      setResetToken(null);
     window.location.assign("/password-changed");
    }    
    catch (error) {
      if (!(error instanceof ApiError)) {
        setServerError("We couldn't change your password. Please try again.");
        return;
      }

      if (error.fieldErrors.token || error.fieldErrors.uid) {
        setCodeProblem(true);
        return;
      }

      const newPassword = error.fieldErrors.new_password?.[0];
      const confirm = error.fieldErrors.re_new_password?.[0];
      if (newPassword || confirm) {
        if (newPassword) setError("password", { type: "server", message: newPassword });
        if (confirm) setError("confirmPassword", { type: "server", message: confirm });
        return;
      }

      if (error.status === null || error.status >= 500) {
        setServerError(error.message); 
      } else if (error.status === 400) {
        setCodeProblem(true); 
      } else {
        setServerError("We couldn't change your password. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <PasswordField
        id="password"
        label="New password"
        autoComplete="new-password"
        placeholder="********************"
        className="h-11"
        error={errors.password?.message}
        {...register("password")}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        autoComplete="new-password"
        placeholder="********************"
        className="h-11"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <FormAlert
        message={codeProblem ? "That code is invalid or has expired." : serverError}
      />

      {/* shown only when the code was rejected */}
      {codeProblem && (
        <Link
          href="/forgot-password/verify"
          className="text-center text-sm font-semibold text-neutral-700 hover:underline"
        >
          Enter the code again or request a new one
        </Link>
      )}

      <CenteredSubmit loading={isSubmitting} />
    </form>
  );
}