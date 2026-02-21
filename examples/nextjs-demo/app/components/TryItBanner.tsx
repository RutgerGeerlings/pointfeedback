"use client";

import { useState, useEffect } from "react";

export default function TryItBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        left: "16px",
        zIndex: 9998,
        backgroundColor: "#1e293b",
        color: "#f1f5f9",
        padding: "10px 16px",
        borderRadius: "10px",
        fontSize: "13px",
        fontWeight: 500,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        animation: "fadeSlideUp 0.4s ease-out",
      }}
    >
      <span>&#128073; This widget is live — try clicking it!</span>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: "none",
          border: "none",
          color: "#94a3b8",
          cursor: "pointer",
          fontSize: "16px",
          padding: "0 0 0 4px",
          lineHeight: 1,
        }}
      >
        &times;
      </button>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeSlideUp {
              from { opacity: 0; transform: translateY(12px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `,
        }}
      />
    </div>
  );
}
