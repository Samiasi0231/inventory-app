import { Building2, MapPin, type LucideIcon } from "lucide-react";
 
export interface AuthSlideChip {
  label: string;
  /** Position + colour classes for the floating pill. */
  className: string;
}
 
export interface AuthSlideFloater {
  icon: LucideIcon;
  className: string;
  iconClassName?: string;
}
 
export interface AuthSlide {
  id: string;
  /** Drop the photo in /public/auth. Falls back to the gradient if missing. */
  image: string;
  gradient: string;
  title: string;
  subtitle: string;
  chips?: AuthSlideChip[];
  floaters?: AuthSlideFloater[];
}
 
export const signupSlides: AuthSlide[] = [
  {
    id: "know",
    image: "/auth/slide-know.jpg",
    gradient: "from-emerald-900 via-emerald-800 to-neutral-900",
    title: "Know what's happening.",
    subtitle: "Track your business in real time and make informed decisions with ease.",
  },
  {
    id: "grow",
    image: "/auth/slide-grow.jpg",
    gradient: "from-amber-800 via-orange-900 to-neutral-900",
    title: "Built to grow with you.",
    subtitle: "Manage one location or multiple branches with the tools you need to grow.",
    floaters: [
      { icon: Building2, className: "left-[8%] top-[8%]" },
      { icon: Building2, className: "left-[10%] top-[34%]" },
      { icon: Building2, className: "right-[16%] top-[30%]" },
      { icon: MapPin, className: "right-[16%] top-[48%]", iconClassName: "text-red-500" },
    ],
  },
  {
    id: "all",
    image: "/auth/slide-all.jpg",
    gradient: "from-sky-900 via-slate-800 to-neutral-900",
    title: "Your business, all in one place.",
    subtitle: "Manage sales, inventory, purchases, customers and your team from one platform.",
    chips: [
      { label: "Branch Tracking", className: "right-[12%] top-[28%] bg-indigo-50 text-indigo-700" },
      { label: "Inventory Tracker", className: "left-[6%] top-[52%] bg-fuchsia-50 text-fuchsia-700" },
      { label: "Sales Purchase Orders", className: "right-[4%] top-[52%] bg-amber-50 text-amber-700" },
      { label: "Staff Management", className: "left-[34%] top-[70%] bg-emerald-50 text-emerald-700" },
    ],
  },
];
 
export const verifySlides: AuthSlide[] = [
  {
    id: "simple",
    image: "/auth/slide-simple.jpg",
    gradient: "from-rose-900 via-neutral-800 to-neutral-900",
    title: "All in one system to keep operations simple",
    subtitle: "Sign Up to log your inventory",
  },
  signupSlides[2],
];
