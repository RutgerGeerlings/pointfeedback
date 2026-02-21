"use client";

import { useWindowSize, useInView } from "./hooks";

const backends = [
  {
    name: "Memory",
    bestFor: "Local dev & demos",
    persistence: "Until restart",
    serverless: "Yes",
    isDefault: true,
  },
  {
    name: "File",
    bestFor: "Self-hosted / VPS",
    persistence: "Disk",
    serverless: "No",
  },
  {
    name: "Vercel Blob",
    bestFor: "Vercel deployments",
    persistence: "Cloud",
    serverless: "Yes",
  },
  {
    name: "Supabase",
    bestFor: "Full-stack apps",
    persistence: "PostgreSQL",
    serverless: "Yes",
  },
  {
    name: "Custom",
    bestFor: "Any database",
    persistence: "Your choice",
    serverless: "Your choice",
  },
];

function MobileCard({
  backend,
}: {
  backend: (typeof backends)[number];
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <span style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
          {backend.name}
        </span>
        {backend.isDefault && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: "100px",
              backgroundColor: "#eff6ff",
              color: "#3b82f6",
            }}
          >
            Default
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
        {[
          { label: "Best for", value: backend.bestFor },
          { label: "Persistence", value: backend.persistence },
          { label: "Serverless", value: backend.serverless },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#64748b" }}>{label}</span>
            <span style={{ color: "#0f172a", fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StorageTable() {
  const { isMobile } = useWindowSize();
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      style={{
        padding: isMobile ? "80px 20px" : "100px 40px",
        backgroundColor: "#f8fafc",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.6s ease-out",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
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
            Flexible storage
          </h2>
          <p style={{ fontSize: "17px", color: "#64748b", margin: 0 }}>
            Works with any backend — or bring your own
          </p>
        </div>

        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {backends.map((b) => (
              <MobileCard key={b.name} backend={b} />
            ))}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 2fr 1.5fr 1.2fr",
                padding: "14px 24px",
                backgroundColor: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                fontSize: "12px",
                fontWeight: 600,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <span>Backend</span>
              <span>Best For</span>
              <span>Persistence</span>
              <span>Serverless</span>
            </div>

            {/* Rows */}
            {backends.map((b, i) => (
              <div
                key={b.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 2fr 1.5fr 1.2fr",
                  padding: "16px 24px",
                  borderBottom: i < backends.length - 1 ? "1px solid #f1f5f9" : "none",
                  fontSize: "14px",
                  color: "#334155",
                  alignItems: "center",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontWeight: 600, color: "#0f172a" }}>{b.name}</span>
                  {b.isDefault && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "100px",
                        backgroundColor: "#eff6ff",
                        color: "#3b82f6",
                      }}
                    >
                      Default
                    </span>
                  )}
                </span>
                <span>{b.bestFor}</span>
                <span>{b.persistence}</span>
                <span
                  style={{
                    color: b.serverless === "Yes" ? "#10b981" : b.serverless === "No" ? "#ef4444" : "#64748b",
                    fontWeight: 500,
                  }}
                >
                  {b.serverless}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
