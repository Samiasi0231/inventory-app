import { SecondaryButton, type AppButtonProps } from "@/components/button";
import { GoogleIcon } from "@/components/google-icon";
import { cn } from "@/lib/utils";
 
export function GoogleButton({ className, children = "Continue with google", ...props }: AppButtonProps) {
  return (
    <SecondaryButton
      fullWidth
      leftIcon={<GoogleIcon className="size-4" />}
      className={cn("h-11 text-neutral-700", className)}
      {...props}
    >
      {children}
    </SecondaryButton>
  );
}