import { z } from "zod";
 
export const passwordRules = [
  { id: "length", label: "Password must be 8 characters long", test: (v: string) => v.length >= 8 },
  { id: "upper", label: "Password must have one upper case letter", test: (v: string) => /[A-Z]/.test(v) },
  { id: "number", label: "Password must have one number", test: (v: string) => /\d/.test(v) },
] as const;
 
const emailSchema = z.string().min(1, "Email is required").email("Enter a valid email address");
 
const newPasswordSchema = z
  .string()
  .min(1, "Password is required")
  .superRefine((value, ctx) => {
    for (const rule of passwordRules) {
      if (!rule.test(value)) ctx.addIssue({ code: "custom", message: rule.label });
    }
  });
 
export const signUpSchema = z
  .object({
    email: emailSchema,
    password: newPasswordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesn't match",
    path: ["confirmPassword"],
  });
 
export type SignUpValues = z.infer<typeof signUpSchema>;
 
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});
 
export type SignInValues = z.infer<typeof signInSchema>;
 
export const verifyCodeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code sent to your email"),
});
 
export type VerifyCodeValues = z.infer<typeof verifyCodeSchema>;
 
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
 
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
 
export const resetPasswordSchema = z
  .object({
    password: newPasswordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesn't match",
    path: ["confirmPassword"],
  });
 
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
