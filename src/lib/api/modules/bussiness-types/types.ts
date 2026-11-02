/** `?context=onboarding` returns only the cards shown on the onboarding screen. */
export type BusinessTypeContext = "onboarding";

/** Codes seen in the live API. New ones can appear, so the type stays open. */
export type KnownBusinessTypeCode =
  | "retail"
  | "restaurant_food"
  | "pharmacy"
  | "hospitality"
  | "manufacturing"
  | "wholesale_distribution"
  | "fashion"
  | "supermarket"
  | "school"
  | "general_trading"
  | "services"
  | "other";

export interface BusinessType {
  id: string;
  /** Stable key that other endpoints use, e.g. "wholesale_distribution". */
  code: KnownBusinessTypeCode | (string & {});
  name: string;
  /** Empty string for types that are not onboarding cards (fashion, school, ...). */
  description: string;
  /** A lucide icon name such as "shopping-basket" or "truck"; empty string when not set. */
  icon: string;
  /** Empty array for types that are not onboarding cards. */
  highlights: string[];
}
