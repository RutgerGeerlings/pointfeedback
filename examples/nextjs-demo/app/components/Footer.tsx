"use client";

import { useState } from "react";
import { useWindowSize, useCopyToClipboard } from "./hooks";

const installCmd = "npm install pointfeedback";

export default function Footer() {
  const { isMobile } = useWindowSize();
  const { copied, copy } = useCopyToClipboard();
  const [copyHover, setCopyHover] = useState(false);
  const [ghHover, setGhHover] = useState(false);
  const [npmHover, setNpmHover] = useState(false);

  return (
    <footer
      style={{
        backgroundColor: "#0f172a",
        padding: isMobile ? "80px 20px 40px" : "100px 40px 48px",
      }}
    >
      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "28px" : "40px",
            fontWeight: 800,
            color: "#f1f5f9",
            margin: "0 0 16px",
            letterSpacing: "-0.02em",
          }}
        >
          Ready to add visual feedback?
        </h2>
        <p
          style={{
            fontSize: "17px",
            color: "#94a3b8",
            margin: "0 0 40px",
            lineHeight: 1.6,
          }}
        >
          Get started in under 2 minutes. Drop the widget into your layout and
          you&apos;re done.
        </p>

        {/* Install block */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            overflow: "hidden",
            marginBottom: "40px",
            border: "1px solid #334155",
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

        {/* Links */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "56px",
          }}
        >
          <a
            href="https://github.com/AkselRivworworlds/pointfeedback"
            target="_blank"
            rel="noopener noreferrer"
            onMouseOver={() => setGhHover(true)}
            onMouseOut={() => setGhHover(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "10px",
              backgroundColor: ghHover ? "#1e293b" : "transparent",
              border: "1px solid #334155",
              color: "#e2e8f0",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
              transition: "background-color 0.15s",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/pointfeedback"
            target="_blank"
            rel="noopener noreferrer"
            onMouseOver={() => setNpmHover(true)}
            onMouseOut={() => setNpmHover(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "10px",
              backgroundColor: npmHover ? "#1e293b" : "transparent",
              border: "1px solid #334155",
              color: "#e2e8f0",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
              transition: "background-color 0.15s",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0h-2.666V8.667h2.666v5.331zm12 0h-1.332v-4h-1.335v4h-1.332v-4h-1.335v4h-2.666V8.667h8v5.331z" />
            </svg>
            npm
          </a>
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: "1px solid #1e293b",
            paddingTop: "24px",
            fontSize: "13px",
            color: "#475569",
          }}
        >
          MIT License &middot; Built for the Next.js ecosystem
        </div>
      </div>
    </footer>
  );
}
