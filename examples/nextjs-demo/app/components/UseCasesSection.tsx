"use client";

import { useState } from "react";
import { useWindowSize, useInView } from "./hooks";

const useCases = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#6366f1" strokeWidth="2" fill="rgba(99,102,241,0.08)" />
        <path d="M3 9h18M9 21V9" stroke="#6366f1" strokeWidth="2" />
      </svg>
    ),
    title: "Design Reviews",
    desc: "Designers pin comments directly on UI elements — no more annotated screenshots or vague Slack messages.",
    color: "#6366f1",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="#3b82f6" strokeWidth="2" fill="rgba(59,130,246,0.08)" />
        <rect x="9" y="3" width="6" height="4" rx="1" stroke="#3b82f6" strokeWidth="2" />
        <path d="M9 14l2 2 4-4" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "QA Testing",
    desc: "QA testers report bugs with pixel-precise locations. No need to describe where the issue is — just click it.",
    color: "#3b82f6",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#8b5cf6" strokeWidth="2" fill="rgba(139,92,246,0.08)" />
        <circle cx="9" cy="7" r="4" stroke="#8b5cf6" strokeWidth="2" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Client Feedback",
    desc: "Clients review staging sites and leave feedback without needing a separate tool. Everything stays in context.",
    color: "#8b5cf6",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="#0ea5e9" strokeWidth="2" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" fill="rgba(14,165,233,0.08)" />
      </svg>
    ),
    title: "Internal Tools",
    desc: "Add a feedback layer to internal dashboards so teams can flag issues during daily workflows.",
    color: "#0ea5e9",
  },
];

function UseCaseCard({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
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
      }}
    >
      <div style={{ marginBottom: "20px" }}>{icon}</div>
      <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 10px", color: "#0f172a" }}>
        {title}
      </h3>
      <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#64748b", margin: 0 }}>
        {desc}
      </p>
    </div>
  );
}

export default function UseCasesSection() {
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
          Built for every team
        </h2>
        <p style={{ fontSize: "17px", color: "#64748b", margin: 0 }}>
          From design sprints to client handoffs
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          gap: "20px",
        }}
      >
        {useCases.map((uc) => (
          <UseCaseCard key={uc.title} {...uc} />
        ))}
      </div>
    </section>
  );
}
