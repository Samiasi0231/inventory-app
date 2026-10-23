import Link from "next/link";
import { Container } from "@/components/landing/container";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/landing/social-icons";
import { Logo } from "@/components/logo";
import { footerColumns } from "./landing-content";
 
const socials = [
  { label: "LinkedIn", href: "#", icon: LinkedinIcon },
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "X", href: "#", icon: XIcon },
  { label: "YouTube", href: "#", icon: YoutubeIcon },
];
 
export function LandingFooter() {
  return (
    <footer id="contact" className="scroll-mt-24 bg-black text-white">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_2.2fr]">
          <Logo />
 
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerColumns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-xs font-semibold text-white">{column.title}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <Link href={link.href} className="text-xs text-white/70 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
 
        <div className="mt-12 flex flex-col gap-5 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-white/60">© {new Date().getFullYear()} Riinox. All rights reserved.</p>
 
          <ul className="flex items-center gap-4">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  className="text-white/80 transition-colors hover:text-white"
                >
                  <social.icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}