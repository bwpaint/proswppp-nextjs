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
import { Menu, X, Phone, ChevronDown } from "lucide-react";

const LOGO_URL = "https://proswppp.com/wp-content/uploads/2023/07/Asset-1-1-logo-2.png";

type NavItem = {
  label: string;
  href: string;
  dropdown?: { label: string; href: string }[];
};

const navLinks: NavItem[] = [
  { label: "HOME", href: "/" },
  { label: "GET MY SWPPP", href: "/get-your-swppp/" },
  { label: "DO I NEED A SWPPP?", href: "/quiz-form/" },
  { label: "ABOUT US", href: "/about/" },
  { label: "LOCATIONS", href: "/locations/" },
  {
    label: "RESOURCES",
    href: "#",
    dropdown: [
      { label: "SWPPP Glossary", href: "/swppp-glossary/" },
      { label: "SWPPP Documents", href: "/resources/documents/" },
      { label: "SWPPP Links", href: "/resources/links/" },
    ],
  },
  { label: "MAKE A PAYMENT", href: "/make-a-payment/" },
  { label: "BLOG", href: "/blog/" },
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
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <span>Your SWPPP Delivered in 72 Hours or it&apos;s FREE</span>
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
                      className={`text-white font-semibold text-xs px-2.5 py-2 rounded transition-colors duration-200 whitespace-nowrap tracking-wide flex items-center gap-0.5 ${
                        scrolled
                          ? "hover:bg-white/10"
                          : "hover:bg-white/20 hover:text-white"
                      }`}
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
                      <div className="absolute top-full left-0 mt-1 bg-[#1A3A4A] rounded-lg shadow-xl overflow-hidden min-w-[180px] border border-white/10 z-50">
                        {link.dropdown.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            className="block px-4 py-2.5 text-white text-sm font-medium hover:bg-[#EF7C3B] hover:text-white transition-colors"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`text-white font-semibold text-xs px-2.5 py-2 rounded transition-colors duration-200 whitespace-nowrap tracking-wide ${
                      scrolled
                        ? "hover:bg-white/10"
                        : "hover:bg-white/20 hover:text-white"
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
                className="nav-order-btn bg-white text-[#EF7C3B] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full hover:bg-orange-50 transition-all duration-200 hover:shadow-lg whitespace-nowrap"
              >
                ORDER NOW
              </a>
              <a
                href="tel:8334387977"
                className="flex items-center gap-1.5 bg-[#6B9ED1] text-white font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-full hover:bg-[#5a8ec1] transition-all duration-200 whitespace-nowrap"
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
          <div className="lg:hidden bg-[#1A3A4A] border-t border-white/10">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label}>
                    <p className="text-white/60 font-semibold text-xs py-2 px-4 uppercase tracking-widest">
                      {link.label}
                    </p>
                    {link.dropdown.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="block text-white font-medium text-sm py-2 px-8 rounded hover:bg-white/10 transition-colors"
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
                    className="block text-white font-semibold text-sm py-3 px-4 rounded hover:bg-white/10 transition-colors tracking-wide"
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
                  ORDER NOW
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
