"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryButton } from "@/components/button";
import { FormAlert, GoogleButton, OrDivider } from "@/components/auth";
import { PasswordField, TextField } from "@/components/form";
import { useOnboarding } from "@/context/onboarding-context";
import { authApi } from "@/lib/api";
import { signInSchema, type SignInValues } from "./auth.schema";
 
export function SignInForm() {
  const router = useRouter();
  const { setEmail } = useOnboarding();
  const [serverError, setServerError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
 
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
 
  const onSubmit = async (values: SignInValues) => {
    setServerError(null);
    try {
      const { email } = await authApi.signIn(values);
      setEmail(email);
      router.push("/inventory");
    } catch {
      setError("password", { type: "server", message: "Wrong password" });
    }
  };
 
  const onGoogle = async () => {
    setGoogleLoading(true);
    setServerError(null);
    try {
      const { email } = await authApi.signUpWithGoogle();
      setEmail(email);
      router.push("/welcome-back");
    } catch {
      setServerError("Google sign in failed. Please try again.");
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
        autoComplete="current-password"
        placeholder="Enter Password"
        error={errors.password?.message}
        action={
          <Link href="/forgot-password"
            className="text-[11px] font-semibold text-neutral-700 hover:text-brand-600 hover:underline"
          >
            Forgot password
          </Link>
        }
        {...register("password")}
      />
 
      <FormAlert message={serverError} />
 
      <PrimaryButton type="submit" fullWidth loading={isSubmitting} className="mt-2">
        Sign In
      </PrimaryButton>
 
      <OrDivider />
 
      <GoogleButton onClick={onGoogle} loading={googleLoading} />
    </form>
  );
}