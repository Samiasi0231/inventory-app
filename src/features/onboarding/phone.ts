import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/min";

/** Returns the code if it is a country the library knows (ISO alpha-2, e.g. "NG"), else null. */
function asCountry(code: string): CountryCode | null {
  try {
    getCountryCallingCode(code as CountryCode);
    return code as CountryCode;
  } catch {
    return null;
  }
}

/** "NG" -> "+234". Null when no country is selected or the code is unknown. */
export function dialCodeFor(country: string): string | null {
  const known = asCountry(country);
  return known ? `+${getCountryCallingCode(known)}` : null;
}

/** True when the number is valid for the country. Unknown countries pass: the backend checks them. */
export function isValidPhoneForCountry(value: string, country: string): boolean {
  const known = asCountry(country);
  if (!known) return true;
  return Boolean(parsePhoneNumberFromString(value, known)?.isValid());
}

/** "0803 123 4567" + "NG" -> "+2348031234567". Undefined when the field is empty. */
export function toInternationalPhone(
  value: string | undefined,
  country: string,
): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  const known = asCountry(country);
  if (!known) return trimmed; 

  const parsed = parsePhoneNumberFromString(trimmed, known);
  return parsed?.isValid() ? parsed.number : trimmed;
}