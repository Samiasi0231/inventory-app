"use client";
 
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/landing/button-link";
import { Container } from "@/components/landing/container";
import { audiences, navLinks } from "./landing-content";
import Image from "next/image";
import logo from "@/assets/images/riin-logo.svg";
 
function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="RIINOX home">
      <span className="grid size-7 place-items-center rounded-md bg-white text-sm font-bold text-brand-600">
           <Image
          src={logo}
          alt="RIINOX logo"
          width={28}
          height={28}
          className="size-6 object-contain"
        />
      </span>
      <span className="text-sm font-bold tracking-wide text-white">RIINOX</span>
    </Link>
  );
}
 

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);
 
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <Container className="flex h-20 items-center justify-between">
        <BrandMark />
 
        {/* Desktop links */}
        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) =>
            link.hasMenu ? (
              <div key={link.label} ref={menuRef} className="relative">
                <button
                  type="button"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="flex items-center gap-1 text-sm text-white/90 transition-colors hover:text-white"
                >
                  {link.label}
                  <ChevronDown className={`size-4 transition-transform ${menuOpen ? "rotate-180" : ""}`} aria-hidden />
                </button>
 
                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute left-1/2 top-full mt-4 w-64 -translate-x-1/2 rounded-xl bg-white p-2 shadow-xl"
                  >
                    {audiences.map((audience) => (
                      <Link
                        key={audience.id}
                        href={link.href}
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-brand-50 hover:text-brand-700"
                      >
                        {audience.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-white/90 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
 
        {/* Desktop actions */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/signin" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
            Sign in
          </Link>
          <ButtonLink href="/signup" variant="white" size="sm">
            Start for free
          </ButtonLink>
        </div>
 
        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="grid size-10 place-items-center rounded-md text-white md:hidden"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>
 
      {/* Mobile panel */}
      {mobileOpen && (
        <div className="mx-4 rounded-2xl bg-white p-4 shadow-xl md:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-neutral-800 hover:bg-brand-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4">
            <ButtonLink href="/signin" variant="outline" size="md">
              Sign in
            </ButtonLink>
            <ButtonLink href="/signup" variant="primary" size="md">
              Start for free
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}