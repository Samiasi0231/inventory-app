import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CenteredSubmit, FormAlert } from "@/components/auth";
import { TextField } from "@/components/form";
import { useOnboarding } from "@/context/onboarding-context";
import { authApi } from "@/lib/api";
import { forgotPasswordSchema, type ForgotPasswordValues } from "./auth.schema";
 
export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const { setEmail } = useOnboarding();
  const [serverError, setServerError] = useState<string | null>(null);
 
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
 
  const onSubmit = async ({ email }: ForgotPasswordValues) => {
    setServerError(null);
    try {
      await authApi.forgotPassword({ email });
      setEmail(email);
      navigate("/forgot-password/verify");
    } catch {
      setServerError("We couldn't find an account with that email.");
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