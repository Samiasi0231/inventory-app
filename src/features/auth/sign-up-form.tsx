import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryButton } from "@/components/button";
import { FormAlert, GoogleButton, OrDivider, PasswordRequirements } from "@/components/auth";
import { PasswordField, TextField } from "@/components/form";
import { useOnboarding } from "@/context/onboarding-context";
import { authApi } from "@/lib/api";
import { signUpSchema, type SignUpValues } from "./auth.schema";
 
export function SignUpForm() {
  const navigate = useNavigate();
  const { setEmail } = useOnboarding();
  const [serverError, setServerError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
 
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });
 
  const password = watch("password") ?? "";
 
  const onSubmit = async (values: SignUpValues) => {
    setServerError(null);
    try {
      await authApi.signUp({ email: values.email, password: values.password });
      setEmail(values.email);
      navigate("/verify");
    } catch {
      setServerError("We couldn't create your account. Please try again.");
    }
  };
 
  const onGoogle = async () => {
    setGoogleLoading(true);
    setServerError(null);
    try {
      const { email } = await authApi.signUpWithGoogle();
      setEmail(email);
      navigate("/onboarding/business-type");
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
        {...register("password")}
      >
        <PasswordRequirements password={password} />
      </PasswordField>
 
      <PasswordField
        id="confirmPassword"
        label="Confirm Password"
        autoComplete="new-password"
        placeholder="Retype password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
 
      <FormAlert message={serverError} />
 
      <PrimaryButton type="submit" fullWidth loading={isSubmitting} className="mt-2">
        Sign Up
      </PrimaryButton>
 
      <OrDivider />
 
      <GoogleButton onClick={onGoogle} loading={googleLoading} />
    </form>
  );
}