import {
  BedDouble,
  Cross,
  Factory,
  ShoppingBag,
  Upload,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
 
export interface BusinessType {
  id: string;
  title: string;
  description: string;
  tags: string[];
  icon: LucideIcon;
}
 
export const businessTypes: BusinessType[] = [
  {
    id: "retail",
    title: "Retail /Shopping",
    description: "Accelerate point-of-sale efficiency and stock rotation.",
    tags: ["Inventory Tracking", "Point Of Sale", "Employee Management"],
    icon: ShoppingBag,
  },
  {
    id: "restaurant",
    title: "Restaurant/Food",
    description: "Scale your hospitality with menu and raw material management.",
    tags: ["Recipe Management", "Table Booking", "Ingredient Alerts"],
    icon: UtensilsCrossed,
  },
  {
    id: "hospital",
    title: "Hospital/Pharmacy",
    description: "Secure oversight of medical supplies and patient records.",
    tags: ["Expiry Tracking", "Batch Management", "Patient Records"],
    icon: Cross,
  },
  {
    id: "hotel",
    title: "Hotel/Hospitality",
    description: "Seamlessly manage bookings, guests, and facility logs.",
    tags: ["Booking Engine", "Housekeeping", "Facility Logs"],
    icon: BedDouble,
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    description: "Control assembly lines and rigorous quality assurance.",
    tags: ["BOM Management", "Work Orders", "Quality Control"],
    icon: Factory,
  },
  {
    id: "wholesale",
    title: "Wholesale/Distribution",
    description: "High-volume oversight for bulk sales and logistics.",
    tags: ["Bulk Pricing", "Logistics Tracking", "Credit Limits"],
    icon: Upload,
  },
];
