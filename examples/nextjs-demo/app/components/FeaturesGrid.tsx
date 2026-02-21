"use client";

import { useState } from "react";
import { useWindowSize, useInView } from "./hooks";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="10" r="3" stroke="#6366f1" strokeWidth="2" />
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#6366f1" strokeWidth="2" fill="rgba(99,102,241,0.1)" />
      </svg>
    ),
    title: "Click-to-Pin",
    desc: "Users click anywhere on the page to drop a feedback pin at that exact spot. Coordinates are stored precisely.",
    color: "#6366f1",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#3b82f6" strokeWidth="2" fill="rgba(59,130,246,0.1)" strokeLinejoin="round" />
      </svg>
    ),
    title: "General Feedback",
    desc: "A dedicated button for page-level comments that aren't tied to a specific element. Perfect for overall impressions.",
    color: "#3b82f6",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#8b5cf6" strokeWidth="2" fill="rgba(139,92,246,0.1)" />
        <path d="M12 7v5l3 3" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Feedback Rounds",
    desc: "Group feedback into rounds — design review v1, v2, etc. Clear old rounds to keep things organized.",
    color: "#8b5cf6",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="#0ea5e9" strokeWidth="2" fill="rgba(14,165,233,0.1)" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="#0ea5e9" strokeWidth="2" fill="rgba(14,165,233,0.1)" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="#0ea5e9" strokeWidth="2" fill="rgba(14,165,233,0.1)" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="#0ea5e9" strokeWidth="2" fill="rgba(14,165,233,0.1)" />
      </svg>
    ),
    title: "Page-Aware",
    desc: "Feedback is automatically scoped to the current URL path. Pins on /dashboard stay on /dashboard.",
    color: "#0ea5e9",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" fill="rgba(16,185,129,0.05)" />
      </svg>
    ),
    title: "Zero Dependencies",
    desc: "No CSS libraries, no state management addons — just React. Keeps your bundle lean and your build fast.",
    color: "#10b981",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="#f59e0b" strokeWidth="2" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="#f59e0b" strokeWidth="1.5" fill="rgba(245,158,11,0.08)" />
      </svg>
    ),
    title: "Fully Customizable",
    desc: "Theme colors, button labels, positions, callbacks — override everything via props to match your brand.",
    color: "#f59e0b",
  },
];

function FeatureCard({
  icon,
  title,
  desc,
  color,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? "#ffffff" : "#f8fafc",
        border: `1px solid ${hovered ? color + "30" : "#e2e8f0"}`,
        borderRadius: "16px",
        padding: "32px 28px",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 12px 32px ${color}15, 0 4px 12px rgba(0,0,0,0.05)`
          : "0 1px 3px rgba(0,0,0,0.04)",
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          backgroundColor: color + "0d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: "17px",
          fontWeight: 700,
          margin: "0 0 8px",
          color: "#0f172a",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "14px",
          lineHeight: 1.6,
          color: "#64748b",
          margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

export default function FeaturesGrid() {
  const { isMobile } = useWindowSize();
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      style={{
        padding: isMobile ? "80px 20px" : "100px 40px",
        maxWidth: "1120px",
        margin: "0 auto",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.6s ease-out",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <h2
          style={{
            fontSize: isMobile ? "28px" : "40px",
            fontWeight: 800,
            color: "#0f172a",
            margin: "0 0 16px",
            letterSpacing: "-0.02em",
          }}
        >
          Everything you need
        </h2>
        <p
          style={{
            fontSize: "18px",
            color: "#64748b",
            margin: 0,
            maxWidth: "480px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          A complete feedback toolkit in one lightweight package
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {features.map((f, i) => (
          <FeatureCard key={f.title} {...f} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}
