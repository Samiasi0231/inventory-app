
import retailImage from "@/assets/images/retail.svg";
import restaurantImage from "@/assets/images/Bowlfood.svg";
import hospitalImage from "@/assets/images/cross.svg";
import hotelImage from "@/assets/images/hospitality.svg";
import manufacturingImage from "@/assets/images/manifacturing.svg.svg";
import wholesaleImage from "@/assets/images/wholesales.svg.svg";

export interface BusinessType {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
}

export const businessTypes: BusinessType[] = [
  {
    id: "retail",
    title: "Retail /Shopping",
    description: "Accelerate point-of-sale efficiency and stock rotation.",
    tags: ["Inventory Tracking", "Point Of Sale", "Employee Management"],
    image: retailImage,
  },
  {
    id: "restaurant",
    title: "Restaurant/Food",
    description: "Scale your hospitality with menu and raw material management.",
    tags: ["Recipe Management", "Table Booking", "Ingredient Alerts"],
    image: restaurantImage,
  },
  {
    id: "hospital",
    title: "Hospital/Pharmacy",
    description: "Secure oversight of medical supplies and patient records.",
    tags: ["Expiry Tracking", "Batch Management", "Patient Records"],
    image: hospitalImage,
  },
  {
    id: "hotel",
    title: "Hotel/Hospitality",
    description: "Seamlessly manage bookings, guests, and facility logs.",
    tags: ["Booking Engine", "Housekeeping", "Facility Logs"],
    image: hotelImage,
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    description: "Control assembly lines and rigorous quality assurance.",
    tags: ["BOM Management", "Work Orders", "Quality Control"],
    image: manufacturingImage,
  },
  {
    id: "wholesale",
    title: "Wholesale/Distribution",
    description: "High-volume oversight for bulk sales and logistics.",
    tags: ["Bulk Pricing", "Logistics Tracking", "Credit Limits"],
    image: wholesaleImage,
  },
];
