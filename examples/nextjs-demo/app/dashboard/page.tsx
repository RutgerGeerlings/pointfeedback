export default function DashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Dashboard</h1>
      <p style={{ color: "#6b7280", marginBottom: "32px" }}>
        This is a separate page. Feedback left here won&apos;t appear on the
        Home or Settings pages.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {["Users", "Revenue", "Orders", "Signups"].map((label) => (
          <div
            key={label}
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#6b7280" }}>{label}</div>
            <div style={{ fontSize: "28px", fontWeight: 700, marginTop: "4px" }}>
              {Math.floor(Math.random() * 900 + 100)}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "24px",
        }}
      >
        <h2 style={{ fontSize: "20px", marginTop: 0 }}>Recent Activity</h2>
        <p style={{ color: "#374151", lineHeight: 1.6 }}>
          Try leaving feedback on specific dashboard elements. For example,
          you could pin a comment on one of the stat cards above to suggest a
          layout change, or leave general feedback about the dashboard as a
          whole.
        </p>
      </div>
    </div>
  );
}
