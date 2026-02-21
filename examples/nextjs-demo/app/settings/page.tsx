export default function SettingsPage() {
  return (
    <div>
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Settings</h1>
      <p style={{ color: "#6b7280", marginBottom: "32px" }}>
        Another page to demonstrate page-scoped feedback. Pins dropped here
        stay on this page.
      </p>

      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ fontSize: "20px", marginTop: 0 }}>Profile</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { label: "Name", value: "Jane Doe" },
            { label: "Email", value: "jane@example.com" },
            { label: "Role", value: "Admin" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
                {label}
              </div>
              <div
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "24px",
        }}
      >
        <h2 style={{ fontSize: "20px", marginTop: 0 }}>Notifications</h2>
        {["Email alerts", "Push notifications", "Weekly digest"].map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid #f3f4f6",
            }}
          >
            <span style={{ fontSize: "14px" }}>{item}</span>
            <span style={{ color: "#22c55e", fontSize: "13px" }}>Enabled</span>
          </div>
        ))}
      </div>
    </div>
  );
}
