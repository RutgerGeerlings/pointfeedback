"use client";

import { FeedbackWidget } from "pointfeedback";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const subPageLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/settings", label: "Settings" },
];

function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [ghHover, setGhHover] = useState(false);
  const [npmHover, setNpmHover] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: "56px",
        backgroundColor: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(226,232,240,0.6)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <Link
        href="/"
        style={{
          fontWeight: 800,
          fontSize: "17px",
          color: "#0f172a",
          textDecoration: "none",
          letterSpacing: "-0.02em",
        }}
      >
        PointFeedback
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <a
          href="https://github.com/AkselRivworworlds/pointfeedback"
          target="_blank"
          rel="noopener noreferrer"
          onMouseOver={() => setGhHover(true)}
          onMouseOut={() => setGhHover(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "8px",
            backgroundColor: ghHover ? "#f1f5f9" : "transparent",
            color: "#475569",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: 500,
            transition: "background-color 0.15s",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "8px",
            backgroundColor: npmHover ? "#f1f5f9" : "transparent",
            color: "#475569",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: 500,
            transition: "background-color 0.15s",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0h-2.666V8.667h2.666v5.331zm12 0h-1.332v-4h-1.335v4h-1.332v-4h-1.335v4h-2.666V8.667h8v5.331z" />
          </svg>
          npm
        </a>
      </div>
    </nav>
  );
}

function SubPageNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
        padding: "16px 24px",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#fff",
      }}
    >
      <Link
        href="/"
        style={{
          fontWeight: 800,
          fontSize: "17px",
          color: "#0f172a",
          textDecoration: "none",
          letterSpacing: "-0.02em",
        }}
      >
        PointFeedback
      </Link>
      <div style={{ display: "flex", gap: "16px" }}>
        {subPageLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              color: pathname === href ? "#6366f1" : "#6b7280",
              textDecoration: "none",
              fontWeight: pathname === href ? 600 : 400,
              fontSize: "14px",
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <html lang="en">
      <head>
        <title>PointFeedback — Visual Feedback for Next.js</title>
        <meta name="description" content="Drop feedback pins anywhere on your page. A lightweight, zero-dependency feedback widget for Next.js." />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: "#111827",
          backgroundColor: isLanding ? "#ffffff" : "#f9fafb",
        }}
      >
        {isLanding ? <LandingHeader /> : <SubPageNav />}
        {isLanding ? (
          <main>{children}</main>
        ) : (
          <main style={{ padding: "32px 24px", maxWidth: "960px" }}>
            {children}
          </main>
        )}
        <FeedbackWidget
          showRoundsButton={false}
          feedbackPageUrl={null}
        />
      </body>
    </html>
  );
}
