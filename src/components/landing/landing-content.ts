import type { StaticImageData } from "next/image";

// Audience photos live in src/assets/images and are imported, so Next.js bundles
// them. Swap the file names below for the photos you want on each card.
import fashionImage from "@/assets/images/riinox cloths.png";
import restaurantImage from "@/assets/images/resturant-agent.png"; // ← replace with your restaurant photo
import retailImage from "@/assets/images/retailer-agent.png"; // ← replace with your retail photo
import wholesaleImage from "@/assets/images/store-recorder.png"; // ← replace with your wholesale photo
import pharmacyImage from "@/assets/images/ladyatbookshop.jpg"; // ← replace with your pharmacy photo

export interface NavLink {
  label: string;
  href: string;
  /** Shows the "Solutions" dropdown. */
  hasMenu?: boolean;
}

export const navLinks: NavLink[] = [
  { label: "Products", href: "#features" },
  { label: "Solutions", href: "#solutions", hasMenu: true },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "#contact" },
];

// -----------------------------------------------------------------------------
// Features
// -----------------------------------------------------------------------------
export type IllustrationKind = "sales" | "inventory" | "insights" | "multi-store" | "staff";

export interface Feature {
  id: string;
  title: string;
  description: string;
  illustration: IllustrationKind;
  /**
   * "wide": top row — illustration on top, text below (2 per row).
   * "compact": bottom row — text on top, illustration below (3 per row).
   */
  variant: "wide" | "compact";
  /**
   * Optional exported illustration from Figma (e.g. "/landing/features/sales.png").
   * When the file exists it is drawn over the coded illustration; when it is
   * missing the coded illustration is shown instead.
   */
  image?: string;
}

export const features: Feature[] = [
  {
    id: "sales",
    title: "Sales & Purchasing",
    description: "Manage sales, supplier orders, and incoming stock in one connected workspace.",
    illustration: "sales",
    variant: "wide",
  },
  {
    id: "inventory",
    title: "Smart inventory & batch control",
    description: "Track stock levels, monitor product batches, and spot low-stock items before they run out.",
    illustration: "inventory",
    variant: "wide",
  },
  {
    id: "insights",
    // The design reads "Perfomance Insights" (typo). Change here if the designer wants it kept.
    title: "Performance Insights",
    description: "Understand sales, expenses, and stock value at a glance.",
    illustration: "insights",
    variant: "compact",
  },
  {
    id: "multi-store",
    title: "Multi-Store support",
    description: "Run multiple locations from one account while keeping each branch's operations organized.",
    illustration: "multi-store",
    variant: "compact",
  },
  {
    id: "staff",
    title: "Staff management",
    description: "Give your team the right access while keeping sensitive business operations secure.",
    illustration: "staff",
    variant: "compact",
  },
];

// -----------------------------------------------------------------------------
// Sample data shown inside the feature illustrations (decorative only).
// Matches the design: change the copy here, the layout lives in feature-illustrations.tsx.
// -----------------------------------------------------------------------------
export const purchaseOrderPreview = {
  formFields: [
    "Order Date",
    "Created By",
    "Branch",
    "Supplier",
    "Supplier's Reference/Invoice Number",
    "Delivery Method",
    "Notes",
  ],
  /** Fields that show a value in the design; the rest stay empty. */
  formValues: { "Order Date": "04 Oct 2026", "Created By": "Inventory Manager" } as Record<string, string>,
  columns: ["Product", "Variant", "Unit", "Quantity", "Unit cost (₦)", "Total (₦)"],
  rows: [
    ["Premium Chin Chin", "Large / Milk", "Carton", "4", "108,000", "432,000"],
    ["Premium Chin Chin", "Original", "Carton", "10", "8,500", "85,000"],
  ] as string[][],
};

export interface InventoryRow {
  code: string;
  product: string;
  category: string;
  stock: number;
  status: "low" | "in-stock";
}

export const inventoryPreview: { columns: string[]; rows: InventoryRow[] } = {
  columns: ["Item Code", "Product Name", "Category", "Total Stock", "Status"],
  rows: [
    { code: "I-001", product: "Pet Coke", category: "Food and Beverages", stock: 200, status: "low" },
    { code: "I-002", product: "Premium Rice (50kg)", category: "Food and Beverages", stock: 300, status: "in-stock" },
    { code: "I-003", product: "Ayoola Palm Oil (10L)", category: "Food and Beverages", stock: 400, status: "in-stock" },
  ],
};

export const grossProfitPreview = {
  tabs: ["Daily", "Weekly", "Monthly"],
  activeTab: "Monthly",
  yLabels: ["320,000", "280,000", "240,000", "200,000", "160,000"],
  xLabels: ["Oct 1", "Oct 3", "Oct 5", "Oct 7", "Oct 9", "Oct 11"],
  /** Points as a percentage of the chart height (0–100), one per x label. */
  values: [6, 24, 48, 70, 46, 82],
};

export const branchPreview = [
  { name: "Lekki Branch", area: "Lekki, Lagos", active: true },
  { name: "Ikeja Branch", area: "Ikeja, Lagos", active: false },
  { name: "Abuja Branch", area: "Garki, Abuja", active: false },
  { name: "Port Harcourt Branch", area: "GRA, Port Harcourt", active: false },
];

export const branchDetails = [
  { label: "Code", value: "Main" },
  { label: "Phone Number", value: "+234 801 234 5678" },
  { label: "Business Email", value: "info@lagoswholesale.com" },
  { label: "Address", value: "12 Broad Street" },
  { label: "City", value: "Ikeja" },
  { label: "Region", value: "Lagos" },
];

// -----------------------------------------------------------------------------
// Audience
// -----------------------------------------------------------------------------
export interface Audience {
  id: string;
  title: string;
  description: string;
  mode: string;
  /** Imported from src/assets/images, or a path to a file under /public. */
  image: StaticImageData | string;
  /** Shown until the photo loads (and if it can't). */
  gradient: string;
}

export const audiences: Audience[] = [
  {
    id: "fashion",
    title: "Fashion & Lifestyle",
    description: "Manage collections, monitor stock across branches, and stay on top of purchasing.",
    mode: "Fashion",
    image: fashionImage,
    gradient: "from-rose-700 to-neutral-900",
  },
  {
    id: "restaurants",
    title: "Restaurants & Hospitality",
    description: "Manage suppliers, track purchases, and keep your daily business operations organised.",
    mode: "Restaurant",
    image: restaurantImage,
    gradient: "from-amber-700 to-neutral-900",
  },
  {
    id: "retail",
    title: "Retailers & Shop Owners",
    description: "Keep sales moving, track your stock, and manage daily shop operations from one place.",
    mode: "Retail",
    image: retailImage,
    gradient: "from-orange-700 to-neutral-900",
  },
  {
    id: "wholesale",
    title: "Wholesale & Distribution",
    description: "Handle bulk orders, supplier relationships, and stock moving across your warehouses.",
    mode: "Wholesale",
    image: wholesaleImage,
    gradient: "from-red-700 to-neutral-900",
  },
  {
    id: "pharmacy",
    title: "Pharmacies & Healthcare",
    description: "Track batches and expiry dates so the right stock is always on the shelf.",
    mode: "Pharmacy",
    image: pharmacyImage,
    gradient: "from-emerald-700 to-neutral-900",
  },
];

// -----------------------------------------------------------------------------
// How it works
// -----------------------------------------------------------------------------
export interface Step {
  title: string;
  description: string;
}

export const steps: Step[] = [
  {
    title: "Create Your Account",
    description: "Sign up for RIINOX and create your business account in just a few simple steps.",
  },
  {
    title: "Make RIINOX Yours",
    description: "Answer a few questions about your business to personalise your dashboard and the tools you need.",
  },
  {
    title: "Start Running Your Business",
    description:
      "Your workspace is ready. Manage sales, track inventory, monitor performance, and keep everything organised.",
  },
];

// -----------------------------------------------------------------------------
// Testimonials — placeholders, replace with real, approved customer quotes.
// -----------------------------------------------------------------------------
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Honestly, I was skeptical. I thought it was going to be complicated like every other software I'd tried. But I recorded my first sale in two minutes. That was it — I was sold.",
    name: "Grace Adebayo",
    role: "Supermarket owner · Ibadan",
  },
  {
    id: "t2",
    quote:
      "I used to count stock by hand every weekend. Now I see what is running low before customers ask for it, across both of my shops.",
    name: "Tunde Bakare",
    role: "Pharmacy owner · Lagos",
  },
  {
    id: "t3",
    quote:
      "Setting up my staff took minutes. Everyone sees what they need to, and I keep the numbers that matter to myself.",
    name: "Amaka Obi",
    role: "Fashion retailer · Enugu",
  },
  {
    id: "t4",
    quote:
      "Managing three warehouses used to mean three notebooks. Now it is one dashboard and I know where everything is.",
    name: "Ibrahim Musa",
    role: "Wholesale distributor · Kano",
  },
  {
    id: "t5",
    quote:
      "My kitchen team logs deliveries as they arrive. Month-end is no longer a stressful guessing game.",
    name: "Ngozi Eze",
    role: "Restaurant owner · Port Harcourt",
  },
];

// -----------------------------------------------------------------------------
// FAQ
// -----------------------------------------------------------------------------
export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "What is Riinox?",
    answer:
      "RIINOX is an all-in-one business management platform built for Nigerian businesses. It brings sales, inventory, purchases, customers, staff and multiple branches together in one simple workspace.",
  },
  {
    question: "Who can use Riinox?",
    answer:
      "Any business that buys, stocks or sells products: retail shops, supermarkets, pharmacies, restaurants, fashion stores and wholesale distributors, from a single shop to many branches.",
  },
  {
    question: "Can I make sales and receive payments?",
    answer:
      "Yes. You can record sales in seconds, keep track of what customers have paid, and see a clear history of every transaction in one place.",
  },
  {
    question: "Do I need technical experience to use Riinox?",
    answer:
      "Not at all. Riinox is designed to be simple and intuitive, even if you've never used business management software before. And whenever you need help, you can access our online guides and reach our customer support team for assistance.",
  },
  {
    question: "Can I control my staff's access?",
    answer:
      "Yes. Invite your team and give each person only the access they need, so sensitive information like profit and stock value stays with you. You can suspend or remove access at any time.",
  },
  {
    question: "Can I manage multiple branches?",
    answer:
      "Yes. Run one location or many from a single account, switch between branches, and review performance for each branch or for the whole business together.",
  },
];

// -----------------------------------------------------------------------------
// Footer
// -----------------------------------------------------------------------------
export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Products",
    links: [
      { label: "Advanced Analytics", href: "#features" },
      { label: "Inventory Management", href: "#features" },
      { label: "Multi-Store Support", href: "#features" },
      { label: "Staff Management", href: "#features" },
    ],
  },
  {
    title: "Business Types",
    links: [
      { label: "Wholesale & Distribution", href: "#solutions" },
      { label: "Supermarket & Retail", href: "#solutions" },
      { label: "Pharmacies", href: "#solutions" },
      { label: "Restaurants", href: "#solutions" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Advanced Analytics", href: "#features" },
      { label: "Inventory Management", href: "#features" },
      { label: "Multi-Store Support", href: "#features" },
      { label: "Staff Management", href: "#features" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Riinox", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];