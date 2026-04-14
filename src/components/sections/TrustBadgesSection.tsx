'use client';
/**
 * TrustBadgesSection — ProSWPPP Redesign
 * Design: Webwize-style horizontal auto-scrolling review cards
 * - Dark near-black card backgrounds with subtle border, rounded corners
 * - Continuous CSS marquee scroll (same as client logo ticker)
 * - Stars at top, italic quote, white reviewer name, orange company
 * - "CLIENT REVIEWS" section label with orange decorative lines
 * - Left/right edge fade masks for polished infinite loop feel
 * - "READ ALL REVIEWS" CTA below
 * - Certification badge boxes REMOVED per user request
 * - Section background: black
 */

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jeff Martin",
    company: "General Contractor",
    initials: "JM",
    color: "#154FC1",
    time: "6 months ago",
    text: "Great help to get my projects started!!",
    rating: 5,
  },
  {
    name: "Travis Robl",
    company: "Site Superintendent",
    initials: "TR",
    color: "#EF7C3B",
    time: "6 months ago",
    text: "Great service overall. They were very quick with the first version of the SWPPP. Our engineer required a revision to the plan and SWPPP Pros had it back in less than an hour.",
    rating: 5,
  },
  {
    name: "Rick Herrick",
    company: "Project Manager",
    initials: "RH",
    color: "#2D7D46",
    time: "6 months ago",
    text: "Doing SWPPP are becoming extremely cumbersome as a contractor, these guys destroyed the task in a day. Highly recommend this service.",
    rating: 5,
  },
  {
    name: "Will M",
    company: "Construction Owner",
    initials: "WM",
    color: "#8B4513",
    time: "6 months ago",
    text: "Pro SWPP lives up to their name! They are truly pros! Superfast turnaround, and they were able to modify the documents needed within 24 hours due to a last minute change in on site personnel. Could not be happier with their service and performance.",
    rating: 5,
  },
  {
    name: "Griselda Solis",
    company: "Contractor",
    initials: "GS",
    color: "#C0392B",
    time: "6 months ago",
    text: "Great service, communicated in a timely manner, and a very easy process. Thank you!",
    rating: 5,
  },
  {
    name: "Kit Sheffield",
    company: "Site Manager",
    initials: "KS",
    color: "#FF9800",
    time: "6 months ago",
    text: "My job was shutdown and I needed this to get back up and running. Michael had a SWPPP in my inbox within 3 hours. Incredible!",
    rating: 5,
  },
  {
    name: "Aaron Martinez",
    company: "First-Time Client",
    initials: "AM",
    color: "#00838F",
    time: "6 months ago",
    text: "These guys have helped me out a ton as I needed a swppp for the first time. Pro SWPPP answered all my questions in a timely manner and provided my swppp within just a couple days. You cannot go wrong with them!",
    rating: 5,
  },
  {
    name: "Emerie Dupuis",
    company: "Developer",
    initials: "ED",
    color: "#607D8B",
    time: "7 months ago",
    text: "Fast, efficient and cost effective SWPPP services!",
    rating: 5,
  },
  {
    name: "Lane Fouts",
    company: "General Contractor",
    initials: "LF",
    color: "#795548",
    time: "7 months ago",
    text: "Professional, fast, and thorough. Highly recommend Pro SWPPP for any stormwater compliance needs.",
    rating: 5,
  },
];

// Duplicate for seamless infinite loop
const allReviews = [...testimonials, ...testimonials];

export default function TrustBadgesSection() {
  return (
    <section
      style={{
        background: "#000000",
        padding: "5rem 0",
        overflow: "hidden",
      }}
    >
      {/* Section label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "3rem",
        }}
      >
        <span
          style={{
            display: "block",
            width: "3rem",
            height: "2px",
            background: "#EF7C3B",
          }}
        />
        <span
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 900,
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            color: "#EF7C3B",
            textTransform: "uppercase",
          }}
        >
          Client Reviews
        </span>
        <span
          style={{
            display: "block",
            width: "3rem",
            height: "2px",
            background: "#EF7C3B",
          }}
        />
      </div>

      {/* Scrolling review cards */}
      <div
        style={{ position: "relative", overflow: "hidden" }}
      >
        {/* Left fade mask */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "8rem",
            background: "linear-gradient(to right, #000000, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        {/* Right fade mask */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "8rem",
            background: "linear-gradient(to left, #000000, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            width: "max-content",
            animation: "reviewTicker 55s linear infinite",
            paddingBottom: "0.5rem",
            paddingLeft: "1.5rem",
          }}
        >
          {allReviews.map((review, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "11px",
                padding: "2rem",
                width: "340px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: "3px" }}>
                {Array.from({ length: review.rating }).map((_, s) => (
                  <Star
                    key={s}
                    size={18}
                    style={{ fill: "#FFB800", color: "#FFB800" }}
                  />
                ))}
              </div>

              {/* Quote */}
              <p
                style={{
                  fontFamily: "'Roboto', Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: "0.9375rem",
                  lineHeight: "1.65",
                  color: "rgba(255,255,255,0.88)",
                  fontStyle: "italic",
                  flex: 1,
                  margin: 0,
                }}
              >
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Reviewer info */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {/* Avatar */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: review.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                      fontWeight: 900,
                      fontSize: "0.7rem",
                      color: "#fff",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {review.initials}
                  </span>
                </div>

                <div>
                  <p
                    style={{
                      fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "#ffffff",
                      margin: 0,
                    }}
                  >
                    {review.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Roboto', Arial, sans-serif",
                      fontWeight: 400,
                      fontSize: "0.8rem",
                      color: "#EF7C3B",
                      margin: 0,
                    }}
                  >
                    {review.company}
                  </p>
                </div>

                {/* Google G icon */}
                <div style={{ marginLeft: "auto" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA below */}
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <a
          href="https://www.google.com/search?q=proswppp&oq=proswppp&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIKCAEQABiABBiiBDIKCAIQABiABBiiBDIGCAMQRRg9MgYIBBBFGD3SAQgxMzA0ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8#lrd=0x8640ac2d6bdc430d:0x746cb5aa6bc76e9,1,,,,"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 700,
            fontSize: "0.8125rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#EF7C3B",
            border: "1.5px solid #EF7C3B",
            borderRadius: "11px",
            padding: "0.75rem 2rem",
            textDecoration: "none",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = "#EF7C3B";
            (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.color = "#EF7C3B";
          }}
        >
          Read All Google Reviews →
        </a>
      </div>
    </section>
  );
}
