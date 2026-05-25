'use client';
/*
 * Footer Component — ProSWPPP Redesign
 * Design: Black background, 5-column layout
 * Col 1: Company Info (logo + address + phone)
 * Col 2: SWPPP Services links
 * Col 3: Where We Serve links
 * Col 4–5 (span 2): Contact Form — First/Last, Company, Email/Phone, Interest
 *         No labels — placeholder text only inside inputs
 */

import { MapPin, Phone } from "lucide-react";
import { useState } from "react";

const INTEREST_OPTIONS = [
  "New SWPPP",
  "SWPPP Revision",
  "SWPPP Inspection",
  "Annual Report",
  "General Question",
];

export default function Footer() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    interest: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Fluent Footer Form (#1) has no `company` field — pack it into `message` so it's preserved.
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_slug: 'footer',
          fields: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            interest: form.interest,
            message: form.company ? `Company: ${form.company}` : '',
          },
        }),
      });
      if (res.ok) {
        alert("Thanks — we'll be in touch shortly!");
        setForm({ firstName: "", lastName: "", company: "", email: "", phone: "", interest: "" });
      } else {
        alert("Sorry, something went wrong. Please call us at 833-GET-SWPP or try again.");
      }
    } catch {
      alert("Sorry, something went wrong. Please call us at 833-GET-SWPP or try again.");
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/15 rounded-lg text-white text-sm placeholder-white/40 px-3 py-2.5 outline-none focus:border-[#DE863F] focus:bg-white/10 transition-all";

  return (
    <footer className="bg-black text-white">
      <div className="container py-12 lg:py-16">

        {/* 5-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* ── Col 1: Company Info ── */}
          <div className="lg:col-span-1">
            <a href="/" aria-label="Pro SWPPP — Home" className="inline-block mb-4">
              <img
                src="https://proswppp.com/wp-content/uploads/2023/07/Asset-1-1-logo-2.png"
                alt="Pro SWPPP Logo"
                className="h-10 w-auto"
              />
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              America's #1 SWPPP. Your SWPPP in 72 hours, or it's FREE.
            </p>
            <div className="space-y-2 text-sm">
              <a
                href="tel:8334387977"
                className="flex items-center gap-2 text-gray-400 hover:text-[#DE863F] transition-colors"
              >
                <Phone size={13} className="text-[#7B9CD1] flex-shrink-0" />
                833-GET-SWPP
              </a>
              <a
                href="https://maps.app.goo.gl/rKcDY3vvTKsJTqnQ9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-gray-400 hover:text-[#DE863F] transition-colors"
              >
                <MapPin size={13} className="text-[#7B9CD1] flex-shrink-0 mt-0.5" />
                <span>
                  17904 W Lake Houston Pkwy.<br />
                  STE 303<br />
                  Atascocita, TX 77346
                </span>
              </a>
            </div>
          </div>

          {/* ── Col 2: Site Links ── */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-xs uppercase tracking-widest text-[#7B9CD1] mb-4">
              Site Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Get My SWPPP", href: "/get-your-swppp/" },
                { label: "SWPPP Quiz", href: "/quiz-form/" },
                { label: "About Us", href: "/about/" },
                { label: "Locations", href: "/locations/" },
                { label: "Blog", href: "/blog/" },
                { label: "Contact Us", href: "/contact-us/" },
                { label: "Home", href: "/" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#DE863F] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Resource Links ── */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-xs uppercase tracking-widest text-[#7B9CD1] mb-4">
              Resource Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Order Form PDF", href: "/swppp-order-form.pdf" },
                { label: "SWPPP Glossary", href: "/swppp-glossary/" },
                { label: "SWPPP Documents", href: "/resources/documents/" },
                { label: "SWPPP Links", href: "/resources/links/" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#DE863F] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4–5: Contact Form (span 2) ── */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-xs uppercase tracking-widest text-[#7B9CD1] mb-4">
              Get In Touch
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">

              {/* Row 1: First + Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className={inputClass}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className={inputClass}
                  required
                />
              </div>

              {/* Row 2: Company (full width) */}
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company"
                className={inputClass}
              />

              {/* Row 3: Email + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={inputClass}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className={inputClass}
                />
              </div>

              {/* Row 4: Interest (full width) */}
              <select
                name="interest"
                value={form.interest}
                onChange={handleChange}
                className={inputClass}
                style={{
                  color: form.interest ? "white" : "rgba(255,255,255,0.4)",
                }}
              >
                <option value="" disabled style={{ color: "#888", background: "#111" }}>
                  Interest
                </option>
                {INTEREST_OPTIONS.map((opt) => (
                  <option
                    key={opt}
                    value={opt}
                    style={{ color: "white", background: "#111" }}
                  >
                    {opt}
                  </option>
                ))}
              </select>

              {/* Submit */}
              <button
                type="submit"
                className="w-full btn-orange text-sm py-3 rounded-lg"
              >
                Send Message
              </button>

            </form>
          </div>

        </div>

        {/* Badge row — BBB + Procore, flush left */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-wrap items-center gap-6">
          {/* BBB Badge — official Accredited Business seal, links to profile */}
          <a
            href="https://www.bbb.org/us/tx/kingwood/profile/water-pollution-control/pro-swppp-llc-0915-90073436"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="BBB Accredited Business (opens in a new tab)"
            className="inline-flex items-center"
          >
            <img
              src="/images/Accredited_Business_Seal_NoRating_RGB.svg.svg"
              alt="BBB Accredited Business"
              style={{ height: "60px", width: "auto", display: "block" }}
            />
          </a>

          {/* Procore Badge */}
          <div className="bg-white rounded-lg px-4 py-2.5">
            <img
              src="/images/procore-black-badge.svg"
              alt="Procore Network Member"
              style={{ height: '32px', width: 'auto' }}
            />
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-white/10 mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Pro SWPPP. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-[#DE863F] transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-[#DE863F] transition-colors">
              Terms
            </a>
          </div>
        </div>

        {/* Designer credit */}
        <div className="pt-3 text-center text-xs">
          <a
            href="https://www.webwize.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1A1A1A' }}
            className="hover:underline"
          >
            Houston Website Design | WebWize
          </a>
        </div>

      </div>
    </footer>
  );
}
