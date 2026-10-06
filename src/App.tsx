import { Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "@/layout/auth-layout";
import { CenteredLayout } from "@/layout/centered-layout";
import { OnboardingLayout } from "@/layout/onbaording-layout";
import { signupSlides, verifySlides } from "@/features/auth/auth-slides";
import SignUpPage from "@/pages/sign-up-page";
import SignInPage from "@/pages/sign-in-page";
import VerifyCodePage from "@/pages/verify-code-page";
import VerifiedPage from "@/pages/verify-page";
import WelcomeBackPage from "@/pages/welccome-back-page";
import ForgotPasswordPage from "@/pages/forgot-password-page";
import ForgotPasswordVerifyPage from "@/pages/forgot-password-page";
import ResetPasswordPage from "@/pages/reset-password-page";
import PasswordChangedPage from "@/pages/password-changed-page";
import BusinessTypePage from "@/pages/business-type-page";
import BusinessDetailsPage from "@/pages/busineess-details-page";
import DashboardPage from "@/pages/dashboard-page";
 
export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout slides={signupSlides} />}>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
      </Route>
 
      <Route element={<AuthLayout slides={verifySlides} />}>
        <Route path="/verify" element={<VerifyCodePage />} />
      </Route>
 
      <Route element={<CenteredLayout />}>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/forgot-password/verify" element={<ForgotPasswordVerifyPage />} />
        <Route path="/forgot-password/reset" element={<ResetPasswordPage />} />
      </Route>
 
      <Route path="/verified" element={<VerifiedPage />} />
      <Route path="/welcome-back" element={<WelcomeBackPage />} />
      <Route path="/password-changed" element={<PasswordChangedPage />} />

      <Route element={<OnboardingLayout />}>
        <Route path="/onboarding/business-type" element={<BusinessTypePage />} />
        <Route path="/onboarding/business-details" element={<BusinessDetailsPage />} />
      </Route>
 
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
}