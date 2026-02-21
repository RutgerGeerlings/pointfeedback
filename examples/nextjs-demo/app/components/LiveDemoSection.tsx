"use client";

import { useWindowSize, useInView } from "./hooks";

function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div
      style={{
        backgroundColor: "#1e293b",
        borderRadius: "10px",
        padding: "20px",
        border: "1px solid #334155",
      }}
    >
      <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
      <div style={{ fontSize: "28px", fontWeight: 700, color: "#f1f5f9" }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#34d399", marginTop: "4px" }}>{change}</div>
    </div>
  );
}

function TableRow({ cells, isHeader }: { cells: string[]; isHeader?: boolean }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
        padding: "10px 16px",
        borderBottom: "1px solid #334155",
        fontSize: "13px",
        color: isHeader ? "#94a3b8" : "#cbd5e1",
        fontWeight: isHeader ? 600 : 400,
      }}
    >
      {cells.map((cell, i) => (
        <span key={i}>{cell}</span>
      ))}
    </div>
  );
}

export default function LiveDemoSection() {
  const { isMobile } = useWindowSize();
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      style={{
        padding: isMobile ? "80px 20px" : "100px 40px",
        backgroundColor: "#0f172a",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.6s ease-out",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            style={{
              fontSize: isMobile ? "28px" : "40px",
              fontWeight: 800,
              color: "#f1f5f9",
              margin: "0 0 16px",
              letterSpacing: "-0.02em",
            }}
          >
            See it in action
          </h2>
          <p style={{ fontSize: "17px", color: "#94a3b8", margin: 0 }}>
            Drop a pin on anything below — the widget is live on this entire page
          </p>
        </div>

        {/* Fake browser chrome */}
        <div
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #1e293b",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              backgroundColor: "#1e293b",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderBottom: "1px solid #334155",
            }}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#f59e0b" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: "#0f172a",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "12px",
                color: "#64748b",
                fontFamily: "monospace",
                marginLeft: "8px",
              }}
            >
              https://your-app.com/dashboard
            </div>
          </div>

          {/* Dashboard mockup */}
          <div style={{ backgroundColor: "#0f172a", padding: isMobile ? "20px" : "28px" }}>
            {/* Dashboard header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "#f1f5f9" }}>Dashboard</div>
                <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                  Welcome back, here&apos;s your overview
                </div>
              </div>
              <div
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#6366f1",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                Export
              </div>
            </div>

            {/* Stat cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <StatCard label="Total Users" value="2,847" change="+12.5% from last month" />
              <StatCard label="Revenue" value="$48.2K" change="+8.2% from last month" />
              <StatCard label="Orders" value="1,024" change="+23.1% from last month" />
              <StatCard label="Conversion" value="3.24%" change="+0.8% from last month" />
            </div>

            {/* Table */}
            <div
              style={{
                backgroundColor: "#1e293b",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #334155",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  borderBottom: "1px solid #334155",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#f1f5f9",
                }}
              >
                Recent Orders
              </div>
              <TableRow cells={["Customer", "Amount", "Status", "Date"]} isHeader />
              <TableRow cells={["Alice Chen", "$245.00", "Completed", "Feb 21"]} />
              <TableRow cells={["Bob Smith", "$189.50", "Processing", "Feb 20"]} />
              <TableRow cells={["Carol Johnson", "$432.00", "Completed", "Feb 19"]} />
              <TableRow cells={["David Park", "$87.25", "Pending", "Feb 18"]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
