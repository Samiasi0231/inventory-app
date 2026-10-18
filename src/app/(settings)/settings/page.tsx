
import Link from "next/link";
import {
  Building2,
  MapPin,
  ShieldCheck,
  ClipboardCheck,
  Package,
  ShoppingCart,
  CreditCard,
  Bell,
  LockKeyhole,
  Archive,
  ReceiptText,
  ChevronRight,
} from "lucide-react";

const settingsItems = [
  {
    title: "Business Profile",
    description: "Manage your business information and contact details.",
    href: "/settings/business-profile",
    icon: Building2,
  },
  {
    title: "Branches & Location",
    description: "Manage business locations and staff allocation.",
    href: "/settings/branches-location",
    icon: MapPin,
  },
  {
    title: "Roles & Permissions",
    description: "Manage user roles and access permissions.",
    href: "/settings/roles-permissions",
    icon: ShieldCheck,
  },
  {
    title: "Approval Rules",
    description: "Configure approval workflows for your business.",
    href: "/settings/approval-rules",
    icon: ClipboardCheck,
  },
  {
    title: "Products & Inventory",
    description: "Manage inventory and product preferences.",
    href: "/settings/products-inventory",
    icon: Package,
  },
  {
    title: "Sales & Purchasing",
    description: "Configure sales and purchasing preferences.",
    href: "/settings/sales-purchasing",
    icon: ShoppingCart,
  },
  {
    title: "Tax & Payments",
    description: "Manage tax and payment settings.",
    href: "/settings/tax-payments",
    icon: CreditCard,
  },
  {
    title: "Notifications",
    description: "Manage your notification preferences.",
    href: "/settings/notifications",
    icon: Bell,
  },
  {
    title: "Security & Account",
    description: "Manage account security and sign-in settings.",
    href: "/settings/security-account",
    icon: LockKeyhole,
  },
  {
    title: "Archive",
    description: "View archived records and restore them when needed.",
    href: "/settings/archive",
    icon: Archive,
  },
  {
    title: "Subscription & Billing",
    description: "Manage subscription and billing information.",
    href: "/settings/subscription-billing",
    icon: ReceiptText,
  },
];

export default function Page() {
  return (
    <div className="min-h-full bg-[#f7f7f7] p-5 sm:p-7">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#222]">
          General Settings
        </h2>
        <p className="mt-1 text-xs text-[#777]">
          Configure and manage your business preferences.
        </p>
      </div>

      <section
        aria-label="Settings categories"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {settingsItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex min-h-[130px] items-start gap-3 rounded-lg border border-[#e5e5e5] bg-white p-4 transition hover:border-[#008f50] hover:shadow-sm"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e4fff2] text-[#008b50]">
                <Icon className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-[#292929]">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#777]">
                  {item.description}
                </p>
              </div>

              <ChevronRight className="mt-1 size-4 shrink-0 text-[#999] transition group-hover:translate-x-1 group-hover:text-[#008f50]" />
            </Link>
          );
        })}
      </section>
    </div>
  );
}
