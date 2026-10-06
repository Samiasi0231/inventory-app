interface OnboardingHeaderProps {
  title: string;
  description?: string;
}
 
export function OnboardingHeader({ title, description }: OnboardingHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-2xl font-bold text-neutral-800">{title}</h1>
      {description && <p className="mt-2 text-sm text-neutral-600">{description}</p>}
    </div>
  );
}