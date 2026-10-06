import { CountryCombobox } from "@/components/form/country-combobox";
import { FormField } from "@/components/form/form-field";
 
interface CountryFieldProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (code: string) => void;
  error?: string;
}
 
export function CountryField({ id = "country", label = "Country", value, onChange, error }: CountryFieldProps) {
  return (
    <FormField label={label} htmlFor={id} error={error}>
      <CountryCombobox id={id} value={value} onChange={onChange} invalid={!!error} />
    </FormField>
  );
}