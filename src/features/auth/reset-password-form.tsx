"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CenteredSubmit, FormAlert } from "@/components/auth";
import { PasswordField } from "@/components/form";
import { useOnboarding } from "@/context/onboarding-context";
import { authApi } from "@/lib/api";
import { resetPasswordSchema, type ResetPasswordValues } from "./auth.schema";
 
export function ResetPasswordForm() {
  const router = useRouter();
  const { email, resetToken, setResetToken } = useOnboarding();
  const [serverError, setServerError] = useState<string | null>(null);
 
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
 
  const onSubmit = async ({ password }: ResetPasswordValues) => {
    setServerError(null);
    try {
      await authApi.resetPassword({ email, token: resetToken ?? "", password });
      setResetToken(null);
      router.replace("/password-changed");
    } catch {
      setServerError("We couldn't change your password. Please try again.");
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
 
      <FormAlert message={serverError} />
 
      <CenteredSubmit loading={isSubmitting} />
    </form>
  );
}