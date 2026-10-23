import type { StaticImageData } from "next/image";
import { Building2, MapPin, type LucideIcon } from "lucide-react";
import saleGirl from "@/assets/images/sale-gurl.png";
import ladyAtBookshop from "@/assets/images/ladyatbookshop.jpg";
import secretary from "@/assets/images/secretary.png";

export interface AuthSlideChip {
  label: string;
  className: string;
}

export interface AuthSlideFloater {
  icon: LucideIcon;
  className: string;
  iconClassName?: string;
}

export interface AuthSlide {
  id: string;
  image: StaticImageData | string;
  gradient: string;
  title: string;
  subtitle: string;
  chips?: AuthSlideChip[];
  floaters?: AuthSlideFloater[];
}

export const authSlides: AuthSlide[] = [
  {
    id: "know",
    image:ladyAtBookshop ,
    gradient: "from-emerald-900 via-emerald-800 to-neutral-900",
    title: "Know what's happening.",
    subtitle: "Track your business in real time and make informed decisions with ease.",
    chips: [
      {
        label: "Branch Tracking",
        className: "animate-float [--float-delay:0s] [--float-duration:4s] right-[12%] top-[28%] bg-indigo-50 text-indigo-700",
      },
      {
        label: "Inventory Tracker",
        className: "animate-float [--float-delay:0.8s] [--float-duration:5s] left-[6%] top-[52%] bg-fuchsia-50 text-fuchsia-700",
      },
      {
        label: "Sales Purchase Orders",
        className: "animate-float [--float-delay:1.6s] [--float-duration:4.5s] right-[4%] top-[52%] bg-amber-50 text-amber-700",
      },
      {
        label: "Staff Management",
        className: "animate-float [--float-delay:0.4s] [--float-duration:5.5s] left-[34%] top-[60%] bg-emerald-50 text-emerald-700",
      },
    ],
  },
  {
    id: "grow",
    image: saleGirl,
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
    image: secretary,
    gradient: "from-sky-900 via-slate-800 to-neutral-900",
    title: "Your business, all in one place.",
    subtitle: "Manage sales, inventory, purchases, customers and your team from one platform.",
    chips: [
      {
        label: "Branch Tracking",
        className: "animate-float [--float-delay:0s] [--float-duration:4s] right-[12%] top-[28%] bg-indigo-50 text-indigo-700",
      },
      {
        label: "Inventory Tracker",
        className: "animate-float [--float-delay:0.8s] [--float-duration:5s] left-[6%] top-[52%] bg-fuchsia-50 text-fuchsia-700",
      },
      {
        label: "Sales Purchase Orders",
        className: "animate-float [--float-delay:1.6s] [--float-duration:4.5s] right-[4%] top-[52%] bg-amber-50 text-amber-700",
      },
      {
        label: "Staff Management",
        className: "animate-float [--float-delay:0.4s] [--float-duration:5.5s] left-[34%] top-[60%] bg-emerald-50 text-emerald-700",
      },
    ],
  },
  {
    id: "simple",
    image: secretary,
    gradient: "from-rose-900 via-neutral-800 to-neutral-900",
    title: "All in one system to keep operations simple",
    subtitle: "Sign Up to log your inventory",
    chips: [
      {
        label: "Branch Tracking",
        className: "animate-float [--float-delay:0s] [--float-duration:4s] right-[12%] top-[28%] bg-indigo-50 text-indigo-700",
      },
      {
        label: "Inventory Tracker",
        className: "animate-float [--float-delay:0.8s] [--float-duration:5s] left-[6%] top-[52%] bg-fuchsia-50 text-fuchsia-700",
      },
      {
        label: "Sales Purchase Orders",
        className: "animate-float [--float-delay:1.6s] [--float-duration:4.5s] right-[4%] top-[52%] bg-amber-50 text-amber-700",
      },
      {
        label: "Staff Management",
        className: "animate-float [--float-delay:0.4s] [--float-duration:5.5s] left-[34%] top-[60%] bg-emerald-50 text-emerald-700",
      },
    ],
  },
];

/**
 * Which slide each auth page shows (slide ids from `authSlides`).
 * Keys are matched as a path prefix, so "/verify" also covers "/verify/anything".
 * Pages not listed fall back to the first slide.
 */
export const authSlideByRoute: Record<string, string> = {
  "/signup": "all",
  "/verify": "simple",
  "/signin": "know",
};

/** Index of the slide to show for a pathname. */
export function getAuthSlideIndex(pathname: string, slides: AuthSlide[] = authSlides): number {
  const route = Object.keys(authSlideByRoute).find((r) => pathname === r || pathname.startsWith(`${r}/`));
  const index = route ? slides.findIndex((slide) => slide.id === authSlideByRoute[route]) : -1;
  return index === -1 ? 0 : index;
}

// Kept so existing imports keep working.
export const signupSlides: AuthSlide[] = authSlides;
export const verifySlides: AuthSlide[] = authSlides;