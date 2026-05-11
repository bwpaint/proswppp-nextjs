"use client";

/**
 * GetYourSWPPP.tsx — Multi-step SWPPP order form
 *
 * Next.js App Router:  src/app/get-your-swppp/page.tsx
 * Next.js Pages Router: src/pages/get-your-swppp.tsx
 *
 * Steps:
 *   1. Company Information
 *   2. Project Details  (project state → fetches live pricing)
 *   3. Services & Add-ons (live price calculator)
 *   4. Review & Payment  (mock Stripe — wire real key before launch)
 *
 * Env vars (.env.local):
 *   NEXT_PUBLIC_SOP_API_BASE = https://cms.proswppp.com/wp-json/psop/v1
 *   NEXT_PUBLIC_SOP_API_KEY  = from WP Admin > Storm Order Pro > Settings
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Building2,
  FileText,
  Shield,
  CreditCard,
  AlertTriangle,
  MapPin,
  Clock,
  Lock,
} from "lucide-react";

// ─── Config ────────────────────────────────────────────────────────────────────
const API_BASE =
  process.env.NEXT_PUBLIC_SOP_API_BASE ??
  "https://cms.proswppp.com/wp-json/psop/v1";
const API_KEY = process.env.NEXT_PUBLIC_SOP_API_KEY ?? "";

const USACE_BASE_PRICE = 4597;

// ─── US States ─────────────────────────────────────────────────────────────────
const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

// ─── Types ─────────────────────────────────────────────────────────────────────
interface FormData {
  // Step 1 – Company
  companyName: string;
  companyStreet: string;
  companyCity: string;
  companyState: string;
  companyZip: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Step 2 – Project
  projectTitle: string;
  projectStreet: string;
  projectCity: string;
  projectState: string;
  projectZip: string;
  startDate: string;
  endDate: string;
  drawingsLink: string;
  projectDescription: string;
  projectNotes: string;
  // Step 3 – Add-ons
  ePortal: boolean;
  ePortalMonths: number;
  cpesc: boolean;
  cpescMonths: number;
  usace: boolean;
  hardCopy: boolean;
}

interface RegionPricing {
  state_code: string;
  state_name: string;
  base_price: number;
  eportal_price_per_month?: number;
  cpesc_price_per_month?: number;
  binder_price?: number;
}

const EMPTY_FORM: FormData = {
  companyName: "",
  companyStreet: "",
  companyCity: "",
  companyState: "",
  companyZip: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  projectTitle: "",
  projectStreet: "",
  projectCity: "",
  projectState: "",
  projectZip: "",
  startDate: "",
  endDate: "",
  drawingsLink: "",
  projectDescription: "",
  projectNotes: "",
  ePortal: false,
  ePortalMonths: 3,
  cpesc: false,
  cpescMonths: 3,
  usace: false,
  hardCopy: false,
};

// ─── Pricing helpers ───────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const FALLBACK_PRICING: Omit<RegionPricing, "state_code" | "state_name"> = {
  base_price: 2497,
  eportal_price_per_month: 197,
  cpesc_price_per_month: 297,
  binder_price: 300,
};

function calcTotal(form: FormData, pricing: RegionPricing | null) {
  const p = pricing ?? { ...FALLBACK_PRICING, state_code: "", state_name: "" };
  const base = form.usace ? USACE_BASE_PRICE : p.base_price;
  const ePortal = form.ePortal
    ? (p.eportal_price_per_month ?? 197) * form.ePortalMonths
    : 0;
  const cpesc = form.cpesc
    ? (p.cpesc_price_per_month ?? 297) * form.cpescMonths
    : 0;
  const binder = form.hardCopy ? (p.binder_price ?? 300) : 0;
  return { base, ePortal, cpesc, binder, total: base + ePortal + cpesc + binder };
}

// ─── Shared UI atoms ───────────────────────────────────────────────────────────
const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white " +
  "placeholder:text-gray-600 focus:border-orange-500/50 focus:outline-none " +
  "focus:ring-1 focus:ring-orange-500/20 transition-all text-sm";

const selectCls =
  "w-full rounded-lg border border-white/10 px-4 py-3 text-white " +
  "focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/20 " +
  "transition-all text-sm appearance-none";

function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5"
    >
      {children}
      {required && <span className="text-orange-500 ml-1">*</span>}
    </label>
  );
}

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  hint,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
      />
      {hint && <p className="text-xs text-gray-600 mt-1">{hint}</p>}
    </div>
  );
}

function StateSelect({
  label,
  id,
  value,
  onChange,
  required,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectCls}
        style={{ background: "#1A1A1F" }}
      >
        <option value="">Select state…</option>
        {US_STATES.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function MonthSelect({
  label,
  id,
  value,
  onChange,
}: {
  label: string;
  id: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={selectCls}
        style={{ background: "#1A1A1F" }}
      >
        {[1, 2, 3, 4, 5, 6, 9, 12].map((m) => (
          <option key={m} value={m}>
            {m} month{m !== 1 ? "s" : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({
  label,
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls + " resize-none"}
      />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="border-t border-white/5 my-6" />;
}

// ─── Step 1 — Company Info ─────────────────────────────────────────────────────
function Step1({
  form,
  set,
}: {
  form: FormData;
  set: (k: keyof FormData, v: any) => void;
}) {
  return (
    <div className="space-y-4">
      <SectionLabel>Company Details</SectionLabel>
      <Field
        label="Company Name"
        id="companyName"
        value={form.companyName}
        onChange={(v) => set("companyName", v)}
        placeholder="ACME Construction Co."
        required
      />
      <Field
        label="Street Address"
        id="companyStreet"
        value={form.companyStreet}
        onChange={(v) => set("companyStreet", v)}
        placeholder="123 Main Street"
        required
      />
      <div className="grid grid-cols-5 gap-3">
        <div className="col-span-2">
          <Field
            label="City"
            id="companyCity"
            value={form.companyCity}
            onChange={(v) => set("companyCity", v)}
            placeholder="Austin"
            required
          />
        </div>
        <div className="col-span-2">
          <StateSelect
            label="State"
            id="companyState"
            value={form.companyState}
            onChange={(v) => set("companyState", v)}
            required
          />
        </div>
        <div className="col-span-1">
          <Field
            label="Zip"
            id="companyZip"
            value={form.companyZip}
            onChange={(v) => set("companyZip", v)}
            placeholder="78701"
            required
          />
        </div>
      </div>

      <Divider />
      <SectionLabel>Contact Person</SectionLabel>

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="First Name"
          id="firstName"
          value={form.firstName}
          onChange={(v) => set("firstName", v)}
          placeholder="John"
          required
        />
        <Field
          label="Last Name"
          id="lastName"
          value={form.lastName}
          onChange={(v) => set("lastName", v)}
          placeholder="Smith"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Email Address"
          id="email"
          type="email"
          value={form.email}
          onChange={(v) => set("email", v)}
          placeholder="john@acmeconstruction.com"
          required
        />
        <Field
          label="Phone Number"
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(v) => set("phone", v)}
          placeholder="(512) 555-0123"
          required
        />
      </div>
    </div>
  );
}

// ─── Step 2 — Project Details ──────────────────────────────────────────────────
function Step2({
  form,
  set,
  pricing,
  pricingLoading,
}: {
  form: FormData;
  set: (k: keyof FormData, v: any) => void;
  pricing: RegionPricing | null;
  pricingLoading: boolean;
}) {
  const stateName = US_STATES.find((s) => s.code === form.projectState)?.name;

  return (
    <div className="space-y-4">
      <Field
        label="Project Title"
        id="projectTitle"
        value={form.projectTitle}
        onChange={(v) => set("projectTitle", v)}
        placeholder="Lakeview Road Expansion — Phase 2"
        required
      />

      {/* Project address block — qualifying step */}
      <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 space-y-3">
        <div className="flex items-start gap-2 mb-1">
          <MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">Project Location</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Your project state determines pricing — we'll load your quote automatically.
            </p>
          </div>
        </div>

        <Field
          label="Street Address"
          id="projectStreet"
          value={form.projectStreet}
          onChange={(v) => set("projectStreet", v)}
          placeholder="456 Construction Blvd"
          required
        />
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-2">
            <Field
              label="City"
              id="projectCity"
              value={form.projectCity}
              onChange={(v) => set("projectCity", v)}
              placeholder="Houston"
              required
            />
          </div>
          <div className="col-span-2">
            <StateSelect
              label="State"
              id="projectState"
              value={form.projectState}
              onChange={(v) => set("projectState", v)}
              required
            />
          </div>
          <div className="col-span-1">
            <Field
              label="Zip"
              id="projectZip"
              value={form.projectZip}
              onChange={(v) => set("projectZip", v)}
              placeholder="77001"
              required
            />
          </div>
        </div>

        {/* Pricing feedback */}
        {pricingLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
            <div className="w-3 h-3 border border-orange-500 border-t-transparent rounded-full animate-spin" />
            Loading pricing for {stateName}…
          </div>
        )}
        {pricing && !pricingLoading && (
          <div className="flex items-center gap-2 pt-1">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-sm text-green-400">
              Base price for{" "}
              <strong className="text-green-300">{pricing.state_name}</strong>:{" "}
              <strong>{fmt(pricing.base_price)}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Project Start Date"
          id="startDate"
          type="date"
          value={form.startDate}
          onChange={(v) => set("startDate", v)}
          required
        />
        <Field
          label="Project End Date"
          id="endDate"
          type="date"
          value={form.endDate}
          onChange={(v) => set("endDate", v)}
          required
        />
      </div>

      <Field
        label="Link to Civil Drawings"
        id="drawingsLink"
        type="url"
        value={form.drawingsLink}
        onChange={(v) => set("drawingsLink", v)}
        placeholder="https://dropbox.com/sh/…"
        hint="Dropbox, Google Drive, or any file-sharing link"
      />

      <Textarea
        label="Project Description"
        id="projectDescription"
        value={form.projectDescription}
        onChange={(v) => set("projectDescription", v)}
        placeholder="Brief description of the construction project and scope of work…"
        rows={3}
      />

      <Textarea
        label="Project Notes"
        id="projectNotes"
        value={form.projectNotes}
        onChange={(v) => set("projectNotes", v)}
        placeholder="Any special requirements, questions, or additional notes…"
        rows={2}
      />
    </div>
  );
}

// ─── Step 3 — Add-ons ──────────────────────────────────────────────────────────
function Step3({
  form,
  set,
  pricing,
}: {
  form: FormData;
  set: (k: keyof FormData, v: any) => void;
  pricing: RegionPricing | null;
}) {
  const p = pricing ?? { ...FALLBACK_PRICING, state_code: "", state_name: "" };
  const totals = calcTotal(form, pricing);

  return (
    <div className="space-y-4">
      {/* USACE */}
      <label
        className={`block rounded-xl border p-5 cursor-pointer transition-all ${
          form.usace
            ? "border-orange-500/40 bg-orange-500/8"
            : "border-white/10 bg-white/3 hover:border-white/20"
        }`}
      >
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={form.usace}
            onChange={(e) => set("usace", e.target.checked)}
            className="mt-1 w-4 h-4 accent-orange-500 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-white text-sm">USACE Project</span>
              <span className="text-xs bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-full">
                Army Corps of Engineers
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Is this project associated with the US Army Corps of Engineers?
            </p>
            {form.usace && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-orange-500/10 border border-orange-500/20 px-3 py-2.5">
                <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-orange-300">
                  USACE projects require a specialized SWPPP. Base price adjusted to{" "}
                  <strong>{fmt(USACE_BASE_PRICE)}</strong>. Turnkey option not available.
                </p>
              </div>
            )}
          </div>
        </div>
      </label>

      {/* E-Portal */}
      <label
        className={`block rounded-xl border p-5 cursor-pointer transition-all ${
          form.ePortal
            ? "border-orange-500/40 bg-orange-500/8"
            : "border-white/10 bg-white/3 hover:border-white/20"
        }`}
      >
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={form.ePortal}
            onChange={(e) => set("ePortal", e.target.checked)}
            className="mt-1 w-4 h-4 accent-orange-500 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white text-sm">E-Portal Access</span>
              <span className="text-sm font-bold text-orange-400">
                {fmt(p.eportal_price_per_month ?? 197)}/mo
              </span>
            </div>
            <ul className="text-sm text-gray-400 space-y-0.5 mb-2">
              <li>• Custom inspection portal compatible with mobile devices</li>
              <li>• All docs stored in the cloud and emailed to pertinent parties</li>
            </ul>
            {form.ePortal && (
              <div className="mt-3 space-y-2" onClick={(e) => e.preventDefault()}>
                <MonthSelect
                  label="How many months?"
                  id="ePortalMonths"
                  value={form.ePortalMonths}
                  onChange={(v) => set("ePortalMonths", v)}
                />
                <p className="text-sm font-semibold text-orange-400">
                  Subtotal: {fmt(totals.ePortal)}
                </p>
              </div>
            )}
          </div>
        </div>
      </label>

      {/* CPESC */}
      <label
        className={`block rounded-xl border p-5 cursor-pointer transition-all ${
          form.cpesc
            ? "border-orange-500/40 bg-orange-500/8"
            : "border-white/10 bg-white/3 hover:border-white/20"
        }`}
      >
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={form.cpesc}
            onChange={(e) => set("cpesc", e.target.checked)}
            className="mt-1 w-4 h-4 accent-orange-500 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white text-sm">CPESC Certified Inspections</span>
              <span className="text-sm font-bold text-orange-400">
                {fmt(p.cpesc_price_per_month ?? 297)}/mo
              </span>
            </div>
            <ul className="text-sm text-gray-400 space-y-0.5 mb-2">
              <li>• Custom tailored inspection portal included</li>
              <li>• Inspections remotely coordinated with certified inspectors</li>
            </ul>
            {form.cpesc && (
              <div className="mt-3 space-y-2" onClick={(e) => e.preventDefault()}>
                <MonthSelect
                  label="How many months?"
                  id="cpescMonths"
                  value={form.cpescMonths}
                  onChange={(v) => set("cpescMonths", v)}
                />
                <p className="text-sm font-semibold text-orange-400">
                  Subtotal: {fmt(totals.cpesc)}
                </p>
              </div>
            )}
          </div>
        </div>
      </label>

      {/* Hard Copy */}
      <label
        className={`block rounded-xl border p-5 cursor-pointer transition-all ${
          form.hardCopy
            ? "border-orange-500/40 bg-orange-500/8"
            : "border-white/10 bg-white/3 hover:border-white/20"
        }`}
      >
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={form.hardCopy}
            onChange={(e) => set("hardCopy", e.target.checked)}
            className="mt-1 w-4 h-4 accent-orange-500 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white text-sm">Hard Copy Binders</span>
              <span className="text-sm font-bold text-orange-400">
                {fmt(p.binder_price ?? 300)}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              2 professionally printed and bound hard copies of the complete SWPPP document.
            </p>
          </div>
        </div>
      </label>

      {/* Live Price Summary */}
      <div className="rounded-xl border border-white/10 p-5" style={{ background: "#1A1A1F" }}>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
          Price Summary
        </p>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">
              Base SWPPP {form.usace ? "(USACE)" : ""}
            </span>
            <span className="text-white font-medium">{fmt(totals.base)}</span>
          </div>
          {form.ePortal && (
            <div className="flex justify-between">
              <span className="text-gray-400">
                E-Portal ({form.ePortalMonths} mo × {fmt(p.eportal_price_per_month ?? 197)})
              </span>
              <span className="text-white">{fmt(totals.ePortal)}</span>
            </div>
          )}
          {form.cpesc && (
            <div className="flex justify-between">
              <span className="text-gray-400">
                CPESC ({form.cpescMonths} mo × {fmt(p.cpesc_price_per_month ?? 297)})
              </span>
              <span className="text-white">{fmt(totals.cpesc)}</span>
            </div>
          )}
          {form.hardCopy && (
            <div className="flex justify-between">
              <span className="text-gray-400">Hard Copy Binders (×2)</span>
              <span className="text-white">{fmt(totals.binder)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-white/10 pt-3 mt-1">
            <span className="font-bold text-white">Total</span>
            <span className="text-2xl font-black text-orange-500">{fmt(totals.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4 — Review & Payment ─────────────────────────────────────────────────
function Step4({
  form,
  pricing,
  onSubmit,
  submitting,
}: {
  form: FormData;
  pricing: RegionPricing | null;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const totals = calcTotal(form, pricing);

  return (
    <div className="space-y-5">
      {/* Order Summary */}
      <div className="rounded-xl border border-white/10 p-5" style={{ background: "#1A1A1F" }}>
        <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4">
          Order Summary
        </p>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Company</p>
            <p className="text-white font-semibold">{form.companyName}</p>
            <p className="text-gray-400">
              {form.firstName} {form.lastName}
            </p>
            <p className="text-gray-400">
              {form.email} · {form.phone}
            </p>
          </div>

          <div className="border-t border-white/5 pt-4">
            <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Project</p>
            <p className="text-white font-semibold">{form.projectTitle}</p>
            <p className="text-gray-400">
              {form.projectCity}, {form.projectState} {form.projectZip}
            </p>
            {form.startDate && (
              <p className="text-gray-400">
                {new Date(form.startDate + "T00:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {" – "}
                {form.endDate
                  ? new Date(form.endDate + "T00:00:00").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "TBD"}
              </p>
            )}
          </div>

          <div className="border-t border-white/5 pt-4 space-y-2">
            <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Services</p>
            <div className="flex justify-between">
              <span className="text-gray-400">
                Base SWPPP {form.usace ? "(USACE)" : ""}
              </span>
              <span className="text-white">{fmt(totals.base)}</span>
            </div>
            {form.ePortal && (
              <div className="flex justify-between">
                <span className="text-gray-400">E-Portal ({form.ePortalMonths} mo)</span>
                <span className="text-white">{fmt(totals.ePortal)}</span>
              </div>
            )}
            {form.cpesc && (
              <div className="flex justify-between">
                <span className="text-gray-400">CPESC Inspections ({form.cpescMonths} mo)</span>
                <span className="text-white">{fmt(totals.cpesc)}</span>
              </div>
            )}
            {form.hardCopy && (
              <div className="flex justify-between">
                <span className="text-gray-400">Hard Copy Binders (×2)</span>
                <span className="text-white">{fmt(totals.binder)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between border-t border-orange-500/20 pt-4">
            <span className="font-bold text-white text-base">Total Due Today</span>
            <span className="text-2xl font-black text-orange-500">{fmt(totals.total)}</span>
          </div>
        </div>
      </div>

      {/* Mock Payment */}
      <div className="rounded-xl border border-white/10 p-5" style={{ background: "#1A1A1F" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500">Payment</p>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Lock className="w-3 h-3" />
            Secured by Stripe
          </div>
        </div>

        {/* Demo notice */}
        <div className="rounded-lg border border-dashed border-yellow-500/30 bg-yellow-500/5 p-3 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-semibold text-yellow-400">
              Demo Mode — Payment not processed
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 mb-1">Card Number</p>
              <div
                className="rounded-lg border border-white/10 bg-white/3 px-4 py-3 font-mono text-sm text-gray-600"
              >
                4242 4242 4242 4242
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">Expiry</p>
                <div className="rounded-lg border border-white/10 bg-white/3 px-4 py-3 font-mono text-sm text-gray-600">
                  12 / 28
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">CVC</p>
                <div className="rounded-lg border border-white/10 bg-white/3 px-4 py-3 font-mono text-sm text-gray-600">
                  •••
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={submitting}
          className="w-full rounded-lg text-white font-bold py-4 text-sm transition-all flex items-center justify-center gap-2"
          style={{
            background: submitting ? "rgba(249,115,22,0.5)" : "#f97316",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!submitting) (e.currentTarget as HTMLElement).style.background = "#ea6010";
          }}
          onMouseLeave={(e) => {
            if (!submitting) (e.currentTarget as HTMLElement).style.background = "#f97316";
          }}
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              Place Order — {fmt(totals.total)}
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-600 flex-wrap">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" /> 256-bit SSL
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> 72-hour delivery
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% compliant or free
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Confirmation ──────────────────────────────────────────────────────────────
function Confirmation({ form }: { form: FormData }) {
  return (
    <div className="text-center py-10">
      <div className="w-16 h-16 rounded-full border border-green-500/30 bg-green-500/10 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-8 h-8 text-green-400" />
      </div>
      <h2
        className="text-3xl font-black text-white mb-3"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "-0.5px" }}
      >
        Order Submitted!
      </h2>
      <p className="text-gray-400 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
        Thank you,{" "}
        <span className="font-semibold text-white">{form.firstName}</span>. We've
        received your order and will begin within 24 hours. A confirmation will be sent
        to{" "}
        <span className="font-semibold text-white">{form.email}</span>.
      </p>
      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        {[
          { icon: Clock, label: "72-Hour", sub: "Delivery guaranteed" },
          { icon: Shield, label: "100%", sub: "Compliance guaranteed" },
          { icon: CheckCircle2, label: "17+ Years", sub: "Industry experience" },
        ].map(({ icon: Icon, label, sub }) => (
          <div
            key={label}
            className="rounded-xl border border-white/10 bg-white/3 p-4"
          >
            <Icon className="w-5 h-5 text-orange-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-white leading-tight">{label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step Definitions ──────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Company", icon: Building2 },
  { id: 2, label: "Project", icon: FileText },
  { id: 3, label: "Add-ons", icon: Shield },
  { id: 4, label: "Payment", icon: CreditCard },
];

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function GetYourSWPPP() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [pricing, setPricing] = useState<RegionPricing | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Fetch pricing when project state changes
  useEffect(() => {
    if (!form.projectState) {
      setPricing(null);
      return;
    }
    const state = form.projectState;
    setPricingLoading(true);

    fetch(`${API_BASE}/regions/${state}`, {
      headers: API_KEY ? { "X-API-Key": API_KEY } : {},
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setPricing(
          data ?? {
            state_code: state,
            state_name: US_STATES.find((s) => s.code === state)?.name ?? state,
            ...FALLBACK_PRICING,
          }
        );
      })
      .catch(() => {
        setPricing({
          state_code: state,
          state_name: US_STATES.find((s) => s.code === state)?.name ?? state,
          ...FALLBACK_PRICING,
        });
      })
      .finally(() => setPricingLoading(false));
  }, [form.projectState]);

  const set = useCallback((k: keyof FormData, v: any) => {
    setForm((f) => ({ ...f, [k]: v }));
  }, []);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goNext = () => {
    scrollToTop();
    setStep((s) => s + 1);
  };
  const goBack = () => {
    scrollToTop();
    setStep((s) => s - 1);
  };

  const canProceed = () => {
    if (step === 1)
      return (
        form.companyName &&
        form.firstName &&
        form.lastName &&
        form.email &&
        form.phone
      );
    if (step === 2)
      return form.projectTitle && form.projectState && form.startDate;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/orders/lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(API_KEY ? { "X-API-Key": API_KEY } : {}),
        },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          company_name: form.companyName,
          state_code: form.projectState,
          project_title: form.projectTitle,
        }),
      });
    } catch {
      // Continue — lead capture failure is non-blocking for demo
    }
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    setSubmitted(true);
    scrollToTop();
  };

  const stepTitle = [
    "",
    "Company Information",
    "Project Details",
    "Services & Add-ons",
    "Review & Payment",
  ][step];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#0A0A0C",
        color: "#F2F2F0",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div ref={topRef} className="pt-10 pb-6 px-4 text-center">
        <div
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5"
          style={{
            borderColor: "rgba(249,115,22,0.3)",
            background: "rgba(249,115,22,0.08)",
            color: "#fb923c",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#fb923c" }}
          />
          72-Hour SWPPP Delivery
        </div>
        <h1
          className="text-4xl sm:text-5xl font-black text-white mb-3"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: "-0.5px",
            lineHeight: 1.15,
          }}
        >
          Get Your{" "}
          <span style={{ color: "#f97316" }}>SWPPP</span> Now
        </h1>
        <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
          Complete the form below — your compliant SWPPP delivered within 72 hours,
          guaranteed.
        </p>
      </div>

      {/* ── Step Indicator ─────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <div className="flex items-center">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = step === s.id;
            const done = step > s.id || submitted;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                    style={{
                      borderColor: done
                        ? "#f97316"
                        : active
                        ? "#f97316"
                        : "rgba(255,255,255,0.12)",
                      background: done
                        ? "#f97316"
                        : active
                        ? "rgba(249,115,22,0.12)"
                        : "rgba(255,255,255,0.03)",
                    }}
                  >
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <Icon
                        className="w-4 h-4"
                        style={{ color: active ? "#fb923c" : "#4b5563" }}
                      />
                    )}
                  </div>
                  <span
                    className="text-xs mt-1.5 font-semibold"
                    style={{
                      color: active ? "#fb923c" : done ? "#9ca3af" : "#4b5563",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="h-0.5 flex-1 mx-2 transition-all duration-500"
                    style={{
                      background:
                        step > s.id || submitted
                          ? "#f97316"
                          : "rgba(255,255,255,0.08)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Form Card ──────────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 pb-20">
        <div
          className="rounded-2xl border border-white/8 p-6 sm:p-8"
          style={{ background: "#111115" }}
        >
          {submitted ? (
            <Confirmation form={form} />
          ) : (
            <>
              {/* Step header */}
              <div className="mb-6">
                <h2
                  className="text-xl font-black text-white"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {stepTitle}
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Step {step} of {STEPS.length}
                </p>
              </div>

              {/* Step content */}
              {step === 1 && <Step1 form={form} set={set} />}
              {step === 2 && (
                <Step2
                  form={form}
                  set={set}
                  pricing={pricing}
                  pricingLoading={pricingLoading}
                />
              )}
              {step === 3 && <Step3 form={form} set={set} pricing={pricing} />}
              {step === 4 && (
                <Step4
                  form={form}
                  pricing={pricing}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                />
              )}

              {/* Navigation */}
              {step < 4 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                  {step > 1 ? (
                    <button
                      onClick={goBack}
                      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={goNext}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 rounded-lg text-white font-bold px-6 py-3 text-sm transition-all"
                    style={{
                      background: canProceed()
                        ? "#f97316"
                        : "rgba(249,115,22,0.35)",
                      cursor: canProceed() ? "pointer" : "not-allowed",
                    }}
                    onMouseEnter={(e) => {
                      if (canProceed())
                        (e.currentTarget as HTMLElement).style.background =
                          "#ea6010";
                    }}
                    onMouseLeave={(e) => {
                      if (canProceed())
                        (e.currentTarget as HTMLElement).style.background =
                          "#f97316";
                    }}
                  >
                    {step === 3 ? "Review Order" : "Continue"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Trust footer */}
        {!submitted && (
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-600 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-gray-500" />
              SSL Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              72-Hour Delivery
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-gray-500" />
              100% Compliant or FREE
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
