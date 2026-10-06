import { BusinessTypeCard } from "@/components/onboarding/bussiness-type-card";
import { businessTypes, type BusinessType } from "@/features/onboarding/bussiness-types";
 
interface BusinessTypePickerProps {
  value: string | null;
  onChange: (id: string) => void;
  options?: BusinessType[];
}
 
export function BusinessTypePicker({ value, onChange, options = businessTypes }: BusinessTypePickerProps) {
  return (
    <div role="radiogroup" aria-label="Business type" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((type) => (
        <BusinessTypeCard key={type.id} type={type} selected={value === type.id} onSelect={onChange} />
      ))}
    </div>
  );
}