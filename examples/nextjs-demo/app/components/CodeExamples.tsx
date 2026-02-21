"use client";

import { useState } from "react";
import { useWindowSize, useInView, useCopyToClipboard } from "./hooks";

type Token = { text: string; color?: string };
type Line = Token[];

function tokenize(code: string): Line[] {
  const keywords = ["import", "export", "default", "function", "return", "const", "from", "async", "await", "new", "as", "any"];
  const types = ["NextRequest", "React", "FeedbackWidget", "feedbackHandler", "PointFeedbackProvider"];

  return code.split("\n").map((line) => {
    const tokens: Token[] = [];
    const parts = line.split(/(\s+|[{}();<>,=:."'`/])/);

    for (const part of parts) {
      if (!part) continue;
      if (keywords.includes(part)) {
        tokens.push({ text: part, color: "#c792ea" });
      } else if (types.includes(part)) {
        tokens.push({ text: part, color: "#82aaff" });
      } else if (part.startsWith('"') || part.startsWith("'") || part.startsWith("`")) {
        tokens.push({ text: part, color: "#c3e88d" });
      } else if (part.startsWith("//")) {
        tokens.push({ text: part, color: "#546e7a" });
      } else if (/^[{}();<>,=:]$/.test(part)) {
        tokens.push({ text: part, color: "#89ddff" });
      } else {
        tokens.push({ text: part });
      }
    }
    return tokens;
  });
}

function SyntaxBlock({ code }: { code: string }) {
  const lines = tokenize(code);
  const { copied, copy } = useCopyToClipboard();
  const [hover, setHover] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => copy(code)}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          padding: "4px 12px",
          borderRadius: "6px",
          border: "1px solid #334155",
          backgroundColor: hover ? "#334155" : "#1e293b",
          color: copied ? "#34d399" : "#94a3b8",
          fontSize: "12px",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.15s",
          zIndex: 1,
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre
        style={{
          margin: 0,
          padding: "20px",
          overflowX: "auto",
          fontSize: "13px",
          lineHeight: 1.7,
          fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
        }}
      >
        {lines.map((line, i) => (
          <div key={i}>
            <span style={{ color: "#546e7a", marginRight: "16px", userSelect: "none", display: "inline-block", width: "20px", textAlign: "right" }}>
              {i + 1}
            </span>
            {line.map((token, j) => (
              <span key={j} style={{ color: token.color || "#e2e8f0" }}>
                {token.text}
              </span>
            ))}
          </div>
        ))}
      </pre>
    </div>
  );
}

const tabs = [
  {
    label: "Quick Start",
    files: [
      {
        name: "app/layout.tsx",
        code: `import { FeedbackWidget } from "pointfeedback";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <FeedbackWidget />
      </body>
    </html>
  );
}`,
      },
      {
        name: "app/api/feedback/route.ts",
        code: `import { NextRequest } from "next/server";
import { feedbackHandler } from "pointfeedback/api";

export async function GET(request: NextRequest) {
  return feedbackHandler.GET(request as any);
}

export async function POST(request: NextRequest) {
  return feedbackHandler.POST(request as any);
}`,
      },
    ],
  },
  {
    label: "Customization",
    files: [
      {
        name: "Custom theme & callbacks",
        code: `<FeedbackWidget
  // Position & appearance
  position="bottom-left"
  theme={{
    primaryColor: "#6366f1",
    backgroundColor: "#ffffff",
    textColor: "#1e293b",
    borderRadius: "12px",
  }}

  // Labels
  labels={{
    pinButton: "Leave Feedback",
    commentPlaceholder: "What do you think?",
    saveButton: "Submit",
  }}

  // Callbacks
  onFeedbackSubmit={(feedback) => {
    console.log("New feedback:", feedback);
    analytics.track("feedback_submitted");
  }}

  // Features
  showRoundsButton={true}
  feedbackPageUrl="/admin/feedback"
/>`,
      },
    ],
  },
  {
    label: "Storage",
    files: [
      {
        name: "Memory storage (default)",
        code: `// No configuration needed — works out of the box
// Data lives in server memory, resets on restart
import { feedbackHandler } from "pointfeedback/api";`,
      },
      {
        name: "Custom storage adapter",
        code: `import { createFeedbackHandler } from "pointfeedback/api";

const handler = createFeedbackHandler({
  storage: {
    async get(page) { /* fetch from your DB */ },
    async save(page, feedbacks) { /* persist */ },
    async delete(page, id) { /* remove */ },
    async getGeneral(page) { /* fetch general */ },
    async saveGeneral(page, feedbacks) { /* persist */ },
    async deleteGeneral(page, id) { /* remove */ },
  },
});`,
      },
    ],
  },
];

export default function CodeExamples() {
  const [activeTab, setActiveTab] = useState(0);
  const { isMobile } = useWindowSize();
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      style={{
        padding: isMobile ? "80px 20px" : "100px 40px",
        maxWidth: "900px",
        margin: "0 auto",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.6s ease-out",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h2
          style={{
            fontSize: isMobile ? "28px" : "40px",
            fontWeight: 800,
            color: "#0f172a",
            margin: "0 0 16px",
            letterSpacing: "-0.02em",
          }}
        >
          Simple to integrate
        </h2>
        <p style={{ fontSize: "17px", color: "#64748b", margin: 0 }}>
          Two files to get started. Customize everything as you grow.
        </p>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          backgroundColor: "#f1f5f9",
          borderRadius: "10px",
          padding: "4px",
          marginBottom: "0",
        }}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === i ? "#ffffff" : "transparent",
              color: activeTab === i ? "#0f172a" : "#64748b",
              fontWeight: activeTab === i ? 600 : 400,
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: activeTab === i ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code blocks */}
      <div
        style={{
          backgroundColor: "#0f172a",
          borderRadius: "0 0 12px 12px",
          overflow: "hidden",
          border: "1px solid #1e293b",
        }}
      >
        {tabs[activeTab].files.map((file, i) => (
          <div key={file.name}>
            {i > 0 && <div style={{ borderTop: "1px solid #1e293b" }} />}
            <div
              style={{
                padding: "10px 20px",
                backgroundColor: "#1e293b",
                fontSize: "12px",
                color: "#94a3b8",
                fontFamily: "monospace",
                borderBottom: "1px solid #0f172a",
              }}
            >
              {file.name}
            </div>
            <SyntaxBlock code={file.code} />
          </div>
        ))}
      </div>
    </section>
  );
}
