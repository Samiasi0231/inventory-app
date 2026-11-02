"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CenteredSubmit, FormAlert } from "@/components/auth";
import { TextField } from "@/components/form";
import { useOnboarding } from "@/context/onboarding-context";
import { ApiError, applyApiFieldErrors, useForgotPassword } from "@/lib/api/index"; 
import { forgotPasswordSchema, type ForgotPasswordValues } from "./auth.schema";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { setEmail } = useOnboarding();
  const [serverError, setServerError] = useState<string | null>(null);

  const forgotPassword = useForgotPassword(); // [2] POST /api/users/reset_password/ (sends the code)

  const {
    register,
    handleSubmit,
    setError, // [3] added
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }: ForgotPasswordValues) => {
    setServerError(null);
    try {
      await forgotPassword.mutateAsync({ email }); // [4] replaces authApi.forgotPassword
      setEmail(email);
      router.push("/forgot-password/verify");
    } catch (error) {
      // an `email` error from the backend appears under the input; anything else in the alert
      const message = applyApiFieldErrors(error, setError, { fields: ["email"] });
      if (message) {
        setServerError(
          error instanceof ApiError && (error.status === null || error.status >= 500)
            ? error.message // network, timeout or server problems keep their real message
            : "We couldn't find an account with that email.",
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <TextField
        id="email"
        label="Registered email"
        type="email"
        autoComplete="email"
        placeholder="e.g donxuixote@gmail.com"
        className="h-11"
        error={errors.email?.message}
        {...register("email")}
      />

      <FormAlert message={serverError} />

      <CenteredSubmit loading={isSubmitting} />
    </form>
  );
}