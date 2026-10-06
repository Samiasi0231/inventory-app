export interface Country {
  code: string;
  name: string;
  currency: string;
  regions: string[];
}
 
export const countries: Country[] = [
  {
    code: "NG",
    name: "Nigeria",
    currency: "NGN",
    regions: ["Lagos", "Abuja (FCT)", "Rivers", "Oyo", "Kano", "Kaduna", "Enugu", "Ogun", "Delta", "Anambra"],
  },
  {
    code: "NL",
    name: "Netherlands",
    currency: "EUR",
    regions: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
  },
  {
    code: "GH",
    name: "Ghana",
    currency: "GHS",
    regions: ["Greater Accra", "Ashanti", "Western", "Northern", "Central"],
  },
  {
    code: "KE",
    name: "Kenya",
    currency: "KES",
    regions: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
  },
  {
    code: "ZA",
    name: "South Africa",
    currency: "ZAR",
    regions: ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape"],
  },
  {
    code: "GB",
    name: "United Kingdom",
    currency: "GBP",
    regions: ["England", "Scotland", "Wales", "Northern Ireland"],
  },
  {
    code: "US",
    name: "United States",
    currency: "USD",
    regions: ["California", "New York", "Texas", "Florida", "Illinois"],
  },
  {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    regions: ["Ontario", "Quebec", "British Columbia", "Alberta"],
  },
];
 
export const currencies = [
  { code: "NGN", label: "NGN — Nigerian Naira" },
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "GHS", label: "GHS — Ghanaian Cedi" },
  { code: "KES", label: "KES — Kenyan Shilling" },
  { code: "ZAR", label: "ZAR — South African Rand" },
  { code: "CAD", label: "CAD — Canadian Dollar" },
];
 
export const staffRanges = ["0-10", "11-20", "21-50", "51-100", "100 and above"];