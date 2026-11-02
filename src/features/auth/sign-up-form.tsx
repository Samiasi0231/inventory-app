"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryButton } from "@/components/button";
import { FormAlert, GoogleButton, OrDivider, PasswordRequirements } from "@/components/auth";
import { PasswordField, TextField } from "@/components/form";
import { useOnboarding } from "@/context/onboarding-context";
import { authApi } from "@/lib/api"; // only for Google now
import { pendingCredentials, useApiFormError, useRegister } from "@/lib/api/index";
import { signUpSchema, type SignUpValues } from "./auth.schema";

export function SignUpForm() {
  const router = useRouter();
  const { setEmail } = useOnboarding();
  const [serverError, setServerError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const signUp = useRegister(); // [1] POST /api/users/

  const {
    register,
    handleSubmit,
    watch,
    setError, // [2] added to the destructure
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  // [3] Email / confirm-password errors appear under their inputs.
  // Any other backend error (for example "password too common") appears in the FormAlert.
  const { formError, handleError, clearError } = useApiFormError(setError, {
    fields: ["email", "confirmPassword"],
    fieldMap: { re_password: "confirmPassword" },
  });

  const password = watch("password") ?? "";
  const passwordField = register("password");

  const onSubmit = async (values: SignUpValues) => {
    setServerError(null);
    clearError();
    try {
      // [4] replaces authApi.signUp(...). The backend also needs re_password.
      await signUp.mutateAsync({
        email: values.email,
        password: values.password,
        re_password: values.confirmPassword,
      });
      // kept in memory only, so the verify step can log the user in automatically
      pendingCredentials.set({ email: values.email, password: values.password });
      setEmail(values.email);
      router.push("/verify");
    } catch (error) {
      handleError(error);
    }
  };

  const onGoogle = async () => {
    setGoogleLoading(true);
    setServerError(null);
    clearError();
    try {
      const { email } = await authApi.signUpWithGoogle(); // no backend endpoint yet
      setEmail(email);
      router.push("/onboarding/business-type");
    } catch {
      setServerError("Google sign up failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <TextField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="e.g noname@gmail.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <PasswordField
        id="password"
        label="Password"
        autoComplete="new-password"
        placeholder="Enter password"
        aria-describedby="password-requirements"
        {...passwordField}
        onFocus={() => setShowRules(true)}
        onBlur={(event) => {
          passwordField.onBlur(event);
          setShowRules(false);
        }}
      >
        <PasswordRequirements id="password-requirements" password={password} open={showRules} />
      </PasswordField>

      <PasswordField
        id="confirmPassword"
        label="Confirm Password"
        autoComplete="new-password"
        placeholder="Retype password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <FormAlert message={formError ?? serverError} />

      <PrimaryButton type="submit" fullWidth loading={isSubmitting} className="mt-2">
        Sign Up
      </PrimaryButton>

      <OrDivider />

      <GoogleButton onClick={onGoogle} loading={googleLoading} />
    </form>
  );
}