"use client";

import { useState } from "react";
import { useWindowSize, useCopyToClipboard } from "./hooks";

const installCmd = "npm install pointfeedback";

export default function HeroSection() {
  const { isMobile } = useWindowSize();
  const { copied, copy } = useCopyToClipboard();
  const [copyHover, setCopyHover] = useState(false);

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "80px 20px 60px" : "80px 40px 60px",
        background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #f5f0ff 100%)",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Decorative gradient orbs */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "720px" }}>
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "100px",
            backgroundColor: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.15)",
            fontSize: "13px",
            fontWeight: 500,
            color: "#6366f1",
            marginBottom: "32px",
          }}
        >
          <span style={{ fontSize: "16px" }}>&#128204;</span>
          Visual feedback for Next.js
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: isMobile ? "36px" : "56px",
            fontWeight: 800,
            lineHeight: 1.1,
            margin: "0 0 20px",
            color: "#0f172a",
            letterSpacing: "-0.03em",
          }}
        >
          Drop feedback pins{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #6366f1, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            anywhere
          </span>{" "}
          on your page
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: isMobile ? "17px" : "20px",
            color: "#475569",
            lineHeight: 1.6,
            margin: "0 0 40px",
            maxWidth: "560px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          A lightweight feedback widget that lets users click anywhere to leave
          pinned comments. Built for Next.js, zero dependencies, fully
          customizable.
        </p>

        {/* Install block */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0",
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            overflow: "hidden",
            marginBottom: "40px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          }}
        >
          <code
            style={{
              padding: "14px 20px",
              color: "#e2e8f0",
              fontSize: isMobile ? "14px" : "16px",
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: "#94a3b8" }}>$</span> {installCmd}
          </code>
          <button
            onClick={() => copy(installCmd)}
            onMouseOver={() => setCopyHover(true)}
            onMouseOut={() => setCopyHover(false)}
            style={{
              padding: "14px 18px",
              backgroundColor: copyHover ? "#334155" : "#273549",
              border: "none",
              borderLeft: "1px solid #334155",
              color: copied ? "#34d399" : "#94a3b8",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "inherit",
              transition: "background-color 0.15s",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Trust badges */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: isMobile ? "16px" : "32px",
            flexWrap: "wrap",
            fontSize: "13px",
            color: "#64748b",
          }}
        >
          {[
            { icon: "&#9878;", label: "MIT Licensed" },
            { icon: "&#9826;", label: "TypeScript" },
            { icon: "&#10024;", label: "Zero Dependencies" },
          ].map(({ icon, label }) => (
            <span
              key={label}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <span dangerouslySetInnerHTML={{ __html: icon }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Animated arrow pointing to bottom-left widget */}
      <div
        style={{
          position: "absolute",
          bottom: isMobile ? "40px" : "60px",
          left: isMobile ? "20px" : "60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          animation: "bounce 2s ease-in-out infinite",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#6366f1",
            whiteSpace: "nowrap",
          }}
        >
          Try the widget &#8595;
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          style={{ transform: "rotate(225deg)" }}
        >
          <path
            d="M5 12h14M12 5l7 7-7 7"
            stroke="#6366f1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Bounce keyframes injected via style tag */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
          `,
        }}
      />
    </section>
  );
}
