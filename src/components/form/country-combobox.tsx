import { useState } from "react";
import { Check, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { fieldClass, fieldErrorClass } from "@/lib/filed-styles";
import { countries } from "@/data/locations";
 
interface CountryComboboxProps {
  id?: string;
  value: string; // country code
  onChange: (code: string) => void;
  invalid?: boolean;
}
 
export function CountryCombobox({ id, value, onChange, invalid }: CountryComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = countries.find((c) => c.code === value);
 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        className={cn(
          fieldClass,
          "flex items-center justify-between text-left",
          invalid && fieldErrorClass,
          !selected && "text-neutral-400",
        )}
      >
        <span className="truncate">{selected ? selected.name : "Select Country"}</span>
        <Search className="size-4 shrink-0 text-neutral-500" aria-hidden />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--anchor-width) p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.name}
                  onSelect={() => {
                    onChange(country.code);
                    setOpen(false);
                  }}
                  className="data-[selected=true]:bg-brand-50 data-[selected=true]:text-brand-700"
                >
                  {country.name}
                  <Check
                    className={cn(
                      "ml-auto size-4 text-brand-600",
                      country.code === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}