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
import {
  ApiError,
  getErrorMessage,
  pendingCredentials,
  useLogin,
  useResendActivation,
} from "@/lib/api/index";
import { signInSchema, type SignInValues } from "./auth.schema";

export function SignInForm() {
  const router = useRouter();
  const { setEmail } = useOnboarding();
  const [serverError, setServerError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const signIn = useLogin(); // POST /api/auth/jwt/login/
  const resend = useResendActivation(); // POST /api/users/resend_activation/

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
      const res = await signIn.mutateAsync(values);
      setEmail(res.setup_info.email);
      router.push(res.registration_complete ? "/dashboard" : "/onboarding/business-type");
    } catch (error) {
      // [NEW] right password, but the email was never verified:
      // send a fresh code and continue on the verify page.
      if (error instanceof ApiError && error.isEmailNotVerified) {
        // memory only: lets the verify step log them in automatically afterwards
        pendingCredentials.set({ email: values.email, password: values.password });
        setEmail(values.email);
        try {
          await resend.mutateAsync({ email: values.email });
        } catch {
          // e.g. a code was just sent (rate limit). Still continue: the verify page has its own Resend.
        }
        router.push(`/verify?email=${encodeURIComponent(values.email)}`);
        return;
      }

      if (error instanceof ApiError && error.status === 401) {
        setError("password", { type: "server", message: "Wrong password" });
      } else {
        setServerError(getErrorMessage(error));
      }
    }
  };

  const onGoogle = async () => {
    setGoogleLoading(true);
    setServerError(null);
    try {
      const { email } = await authApi.signUpWithGoogle(); // no backend endpoint yet
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

      <PrimaryButton type="submit" fullWidth loading={isSubmitting}
      className="mt-2">
        Sign In
      </PrimaryButton>

      <OrDivider />

      <GoogleButton onClick={onGoogle} loading={googleLoading} />
    </form>
  );
}