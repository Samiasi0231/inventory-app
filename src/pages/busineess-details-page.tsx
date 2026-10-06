import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "@/components/onboarding";
import { useOnboarding } from "@/context/onboarding-context";
import { BusinessDetailsForm } from "@/features/onboarding/business-details-form";
 
export default function BusinessDetailsPage() {
  const navigate = useNavigate();
  const { businessType } = useOnboarding();
 
  // A business type is required to land here — send people back if it's missing.
  useEffect(() => {
    if (!businessType) navigate("/onboarding/business-type", { replace: true });
  }, [businessType, navigate]);
 
  return (
    <section>
      <OnboardingHeader
        title="Your Business details?"
        description="Help us set up your workspace with the right information."
      />
      <BusinessDetailsForm />
    </section>
  );
}