'use client';
/*
 * Navigation Component — ProSWPPP Redesign
 * Design: Glassmorphism sticky nav with backdrop blur
 * - Orange background by default (brand color)
 * - Transitions to dark navy on scroll with blur effect
 * - Mobile hamburger menu with smooth slide-down
 * - "About Us" has a dropdown: About Us, Locations, SWPPP FAQ
 *
 * Source URLs verified against proswppp.com live site content dump.
 */

import { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";

const LOGO_URL = "https://proswppp.com/wp-content/uploads/2023/07/Asset-1-1-logo-2.png";

const navLinks = [
  { label: "HOME", href: "https://proswppp.com/" },
  { label: "GET MY SWPPP", href: "https://proswppp.com/get-your-swppp/" },
  { label: "DO I NEED A SWPPP?", href: "https://proswppp.com/quiz-form/" },
  {
    label: "ABOUT US",
    href: "https://proswppp.com/about/",
    dropdown: [
      { label: "About Us", href: "https://proswppp.com/about/" },
      { label: "Locations", href: "https://proswppp.com/locations/" },
      { label: "SWPPP FAQ", href: "https://proswppp.com/faq/" },
    ],
  },
  { label: "MAKE A PAYMENT", href: "https://proswppp.com/make-a-payment/" },
  { label: "BLOG", href: "https://proswppp.com/blog/" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <span>Your SWPPP Delivered in 72 Hours or it's FREE</span>
      </div>

      {/* Main Navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "nav-scrolled" : "nav-glass"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="https://proswppp.com/" className="flex-shrink-0">
              <img
                src={LOGO_URL}
                alt="Pro SWPPP Logo"
                className="h-12 lg:h-14 w-auto object-contain"
              />
            </a>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setAboutOpen(!aboutOpen)}
                      className="text-white font-semibold text-sm px-3 py-2 rounded hover:bg-white/15 transition-colors duration-200 whitespace-nowrap tracking-wide flex items-center gap-1"
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {aboutOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-[#1A3A4A] rounded-lg shadow-xl overflow-hidden min-w-[160px] border border-white/10">
                        {link.dropdown.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            className="block px-4 py-2.5 text-white text-sm font-medium hover:bg-[#EF7C3B] transition-colors"
                            onClick={() => setAboutOpen(false)}
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
                    className="text-white font-semibold text-sm px-3 py-2 rounded hover:bg-white/15 transition-colors duration-200 whitespace-nowrap tracking-wide"
                  >
                    {link.label}
                  </a>
                )
              )}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="https://proswppp.com/get-your-swppp/#order_swppp_form"
                className="bg-white text-[#EF7C3B] font-bold text-sm uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-orange-50 transition-all duration-200 hover:shadow-lg"
              >
                ORDER NOW
              </a>
              <a
                href="tel:8334387977"
                className="flex items-center gap-2 bg-[#6B9ED1] text-white font-bold text-sm uppercase tracking-wider px-4 py-2.5 rounded-full hover:bg-[#5a8ec1] transition-all duration-200"
              >
                <Phone size={14} />
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
                  href="https://proswppp.com/get-your-swppp/#order_swppp_form"
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
