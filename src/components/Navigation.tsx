'use client';
/*
 * Navigation Component — ProSWPPP Redesign
 * Design: Glassmorphism sticky nav with backdrop blur
 * - Orange background by default (brand color)
 * - Transitions to dark navy on scroll with blur effect
 * - Mobile hamburger menu with smooth slide-down
 * - Full-width layout to prevent wrapping
 * - Multiple dropdowns: About Us, Resources
 * - Top-level Locations link
 */

import { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, ChevronDown, Mail } from "lucide-react";

const IconLinkedIn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);
const IconFacebook = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const IconInstagram = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
const IconYoutube = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);

const LOGO_URL = "https://proswppp.com/wp-content/uploads/2023/07/Asset-1-1-logo-2.png";

type NavItem = {
  label: string;
  href: string;
  dropdown?: { label: string; href: string }[];
};

const navLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Get Your SWPPP", href: "/get-your-swppp/" },
  { label: "About Us", href: "/about/" },
  { label: "Do You Even Need a SWPPP?", href: "/quiz-form/" },
  { label: "Locations", href: "/locations/" },
  {
    label: "Resources",
    href: "#",
    dropdown: [
      { label: "SWPPP Glossary", href: "/swppp-glossary/" },
      { label: "SWPPP Documents", href: "/resources/documents/" },
      { label: "SWPPP Links", href: "/resources/links/" },
    ],
  },
  { label: "Blog", href: "/blog/" },
  { label: "Contact Us", href: "/contact-us/" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (label: string) =>
    setOpenDropdown(openDropdown === label ? null : label);

  return (
    <>
      {/* Announcement Bar — static text, no rotation, no flash. The
          slow gradient background sweep on .announcement-bar (defined
          in globals.css) is the only animation that remains. */}
      <div className="announcement-bar">
        <div className="w-full px-4 lg:px-6 flex items-center justify-between gap-4">

          {/* Left: Phone + Email */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <a href="tel:8334387977" className="flex items-center gap-1.5 hover:text-white transition-colors text-xs whitespace-nowrap font-bold" style={{ color: "#7B9CD1" }}>
              <Phone size={12} />
              833.Get.SWPPP
            </a>
            <a href="mailto:bids@proswppp.com" className="hidden sm:flex items-center gap-1.5 text-white/90 hover:text-white transition-colors text-xs whitespace-nowrap">
              <Mail size={12} />
              bids@proswppp.com
            </a>
          </div>

          {/* Center: Static tagline — two phrases joined by a bullet */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-4">
            <span className="text-xs font-semibold text-center whitespace-nowrap">
              America&apos;s #1 SWPPP &nbsp;&bull;&nbsp; Family Owned and Operated
            </span>
          </div>

          {/* Right: Social Icons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <a href="https://www.linkedin.com/company/pro-swppp/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white/80 hover:text-white transition-colors">
              <IconLinkedIn />
            </a>
            <a href="https://www.facebook.com/p/Pro-SWPPP-LLC-61576065660377/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/80 hover:text-white transition-colors">
              <IconFacebook />
            </a>
            <a href="https://www.instagram.com/proswppp/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/80 hover:text-white transition-colors">
              <IconInstagram />
            </a>
            <a href="https://www.youtube.com/@ProSWPPP" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white/80 hover:text-white transition-colors">
              <IconYoutube />
            </a>
            <a href="https://x.com/Pro_SWPPP" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="text-white/80 hover:text-white transition-colors">
              <IconX />
            </a>
          </div>

        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "nav-scrolled" : "nav-glass"
        }`}
        style={{ overflow: 'visible' }}
      >
        <div className="w-full px-4 lg:px-6" ref={navRef}>
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo — overflows above and below the nav bar */}
            <a href="/" className="flex-shrink-0 relative z-10" style={{ marginTop: '-12px', marginBottom: '-12px' }}>
              <img
                src={LOGO_URL}
                alt="Pro SWPPP Logo"
                className="w-auto object-contain"
                style={{ height: '72px' }}
              />
            </a>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-0">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label} className="relative">
                    <button
                      onClick={() => toggleDropdown(link.label)}
                      className="text-[#DE863F] font-semibold text-xs px-2.5 py-2 rounded transition-colors duration-200 whitespace-nowrap tracking-wide flex items-center gap-0.5 hover:bg-[#DE863F]/15 hover:text-[#DE863F]"
                    >
                      {link.label}
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${
                          openDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openDropdown === link.label && (
                      <div className="absolute top-full left-0 mt-1 bg-black rounded-lg shadow-xl overflow-hidden min-w-[180px] border border-[#DE863F]/30 z-50">
                        {link.dropdown.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            className="block px-4 py-2.5 text-[#DE863F] text-sm font-medium hover:bg-[#DE863F] hover:text-black transition-colors"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : link.href === "/get-your-swppp/" ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-[#DE863F] font-semibold text-xs px-3 py-2 rounded-full transition-all duration-200 whitespace-nowrap tracking-wide hover:bg-[#7B9CD1] hover:text-white hover:shadow-md"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`text-[#DE863F] font-semibold text-xs px-2.5 py-2 rounded transition-colors duration-200 whitespace-nowrap tracking-wide ${
                      scrolled
                        ? "hover:bg-[#DE863F]/15"
                        : "hover:bg-[#DE863F]/15 hover:text-[#DE863F]"
                    }`}
                  >
                    {link.label}
                  </a>
                )
              )}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <a
                href="/get-your-swppp/#order_swppp_form"
                className="nav-order-btn bg-white text-[#0D1F2B] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full hover:bg-[#7B9CD1] hover:text-white transition-all duration-200 hover:shadow-lg whitespace-nowrap"
              >
                GET MY SWPPP
              </a>
              <a
                href="tel:8334387977"
                className="flex items-center gap-1.5 bg-[#7B9CD1] text-white font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-full hover:bg-[#5a7ab0] transition-all duration-200 whitespace-nowrap"
              >
                <Phone size={12} />
                833-GET-SWPP
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-white p-2 rounded-md hover:bg-white/15 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-black border-t border-white/10">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label}>
                    <p className="text-[#DE863F]/70 font-semibold text-xs py-2 px-4 uppercase tracking-widest">
                      {link.label}
                    </p>
                    {link.dropdown.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="block text-[#DE863F] font-medium text-sm py-2 px-8 rounded hover:bg-[#DE863F]/15 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-[#DE863F] font-semibold text-sm py-3 px-4 rounded hover:bg-[#DE863F]/15 transition-colors tracking-wide"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              )}
              <div className="pt-4 flex flex-col gap-3">
                <a
                  href="/get-your-swppp/#order_swppp_form"
                  className="btn-orange text-center"
                >
                  GET MY SWPPP
                </a>
                <a
                  href="tel:8334387977"
                  className="btn-blue text-center flex items-center justify-center gap-2"
                >
                  <Phone size={14} />
                  833-GET-SWPP
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
