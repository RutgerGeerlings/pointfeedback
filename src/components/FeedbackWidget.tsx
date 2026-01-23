"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

// ============================================================================
// Types
// ============================================================================

export interface FeedbackPoint {
  id: string;
  x: number;
  y: number;
  comment: string;
  page: string;
  timestamp: string;
  resolved?: boolean;
  resolution?: string;
}

export interface GeneralFeedback {
  id: string;
  comment: string;
  page: string;
  timestamp: string;
  resolved?: boolean;
  resolution?: string;
  author?: string;
}

export interface FeedbackRound {
  id: string;
  name: string;
  date: string;
  status: "active" | "completed" | "archived";
  items: FeedbackPoint[];
}

export interface FeedbackWidgetConfig {
  /** API endpoint for feedback CRUD operations */
  apiEndpoint?: string;
  /** API endpoint for feedback rounds */
  roundsEndpoint?: string;
  /** API endpoint for general feedback */
  generalFeedbackEndpoint?: string;
  /** Position of the floating button */
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  /** Theme colors */
  theme?: {
    primary?: string;
    secondary?: string;
    success?: string;
    warning?: string;
    danger?: string;
  };
  /** Custom labels for internationalization */
  labels?: {
    addFeedback?: string;
    stopFeedback?: string;
    placeholder?: string;
    save?: string;
    cancel?: string;
    delete?: string;
    resolve?: string;
    resolved?: string;
    newFeedback?: string;
    clickToAdd?: string;
    feedbackSaved?: string;
    feedbackDeleted?: string;
    rounds?: string;
    noRounds?: string;
    viewAll?: string;
    generalFeedback?: string;
    noGeneralFeedback?: string;
    addGeneralFeedback?: string;
    generalPlaceholder?: string;
  };
  /** Disable the widget */
  disabled?: boolean;
  /** Show rounds panel button */
  showRoundsButton?: boolean;
  /** Show general feedback button */
  showGeneralFeedback?: boolean;
  /** URL to feedback overview page */
  feedbackPageUrl?: string | null;
  /** Z-index for the widget */
  zIndex?: number;
  /** Callback when feedback is added */
  onFeedbackAdd?: (feedback: FeedbackPoint) => void;
  /** Callback when feedback is deleted */
  onFeedbackDelete?: (id: string) => void;
  /** Callback when general feedback is added */
  onGeneralFeedbackAdd?: (feedback: GeneralFeedback) => void;
}

// ============================================================================
// Default Configuration
// ============================================================================

const defaultConfig: Required<FeedbackWidgetConfig> = {
  apiEndpoint: "/api/feedback",
  roundsEndpoint: "/api/feedback/rounds",
  generalFeedbackEndpoint: "/api/feedback/general",
  position: "bottom-left",
  theme: {
    primary: "#3b82f6",
    secondary: "#6b7280",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
  },
  labels: {
    addFeedback: "Add Feedback",
    stopFeedback: "Stop",
    placeholder: "Describe your feedback...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    resolve: "Mark Resolved",
    resolved: "Resolved",
    newFeedback: "New Feedback",
    clickToAdd: "Click anywhere to add feedback",
    feedbackSaved: "Feedback saved!",
    feedbackDeleted: "Feedback deleted!",
    rounds: "Feedback Rounds",
    noRounds: "No rounds found",
    viewAll: "View all feedback",
    generalFeedback: "General Feedback",
    noGeneralFeedback: "No general feedback yet",
    addGeneralFeedback: "Add Feedback",
    generalPlaceholder: "Share your thoughts or suggestions...",
  },
  disabled: false,
  showRoundsButton: true,
  showGeneralFeedback: true,
  feedbackPageUrl: "/feedback",
  zIndex: 99999,
  onFeedbackAdd: () => {},
  onFeedbackDelete: () => {},
  onGeneralFeedbackAdd: () => {},
};

// ============================================================================
// Styles (inline for zero dependencies)
// ============================================================================

const styles = {
  overlay: (zIndex: number): React.CSSProperties => ({
    position: "fixed",
    inset: 0,
    zIndex: zIndex - 10,
    cursor: "crosshair",
  }),
  buttonContainer: (position: string, zIndex: number): React.CSSProperties => {
    const pos = position.split("-");
    return {
      position: "fixed",
      display: "flex",
      gap: "12px",
      zIndex,
      [pos[0]]: "24px",
      [pos[1]]: "24px",
    };
  },
  button: (color: string, size = 56): React.CSSProperties => ({
    width: size,
    height: size,
    borderRadius: "50%",
    border: "none",
    backgroundColor: color,
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: "transform 0.2s, box-shadow 0.2s",
  }),
  marker: (x: number, y: number, zIndex: number): React.CSSProperties => ({
    position: "absolute",
    left: `${x}%`,
    top: `${y}px`,
    transform: "translate(-50%, -50%)",
    zIndex,
    pointerEvents: "auto",
  }),
  markerDot: (color: string): React.CSSProperties => ({
    width: 28,
    height: 28,
    borderRadius: "50%",
    backgroundColor: color,
    border: "3px solid white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    cursor: "pointer",
  }),
  tooltip: (zIndex: number): React.CSSProperties => ({
    position: "absolute",
    left: 40,
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "white",
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    minWidth: 280,
    maxWidth: 360,
    overflow: "hidden",
    zIndex: zIndex + 1,
  }),
  tooltipHeader: (color: string): React.CSSProperties => ({
    padding: "10px 14px",
    backgroundColor: color,
    color: "white",
    fontSize: 12,
    fontWeight: 600,
  }),
  tooltipBody: {
    padding: 14,
  } as React.CSSProperties,
  tooltipFooter: {
    padding: "10px 14px",
    backgroundColor: "#f9fafb",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 12,
    color: "#6b7280",
  } as React.CSSProperties,
  inputContainer: (zIndex: number): React.CSSProperties => ({
    position: "absolute",
    left: 40,
    top: 0,
    backgroundColor: "white",
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    padding: 16,
    width: 300,
    zIndex: zIndex + 1,
  }),
  textarea: {
    width: "100%",
    padding: 10,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 14,
    resize: "none" as const,
    outline: "none",
    fontFamily: "inherit",
  } as React.CSSProperties,
  buttonRow: {
    display: "flex",
    gap: 8,
    marginTop: 12,
  } as React.CSSProperties,
  submitButton: (color: string): React.CSSProperties => ({
    flex: 1,
    padding: "10px 16px",
    backgroundColor: color,
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  }),
  cancelButton: {
    padding: "10px 16px",
    backgroundColor: "transparent",
    color: "#6b7280",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
  } as React.CSSProperties,
  toast: (zIndex: number): React.CSSProperties => ({
    position: "fixed",
    top: 24,
    right: 24,
    backgroundColor: "#22c55e",
    color: "white",
    padding: "12px 20px",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: zIndex + 10,
    fontSize: 14,
    fontWeight: 500,
  }),
  helperText: (position: string, zIndex: number): React.CSSProperties => {
    const pos = position.split("-");
    return {
      position: "fixed",
      [pos[0]]: "96px",
      [pos[1]]: "24px",
      backgroundColor: "rgba(0,0,0,0.8)",
      color: "white",
      padding: "10px 16px",
      borderRadius: 8,
      fontSize: 14,
      zIndex,
    };
  },
  panel: (position: string, zIndex: number): React.CSSProperties => {
    const pos = position.split("-");
    return {
      position: "fixed",
      [pos[0]]: "96px",
      [pos[1]]: "24px",
      backgroundColor: "white",
      borderRadius: 12,
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      width: 300,
      overflow: "hidden",
      zIndex,
    };
  },
  panelHeader: {
    padding: "14px 16px",
    backgroundColor: "#111827",
    color: "white",
    fontSize: 14,
    fontWeight: 600,
  } as React.CSSProperties,
  panelBody: {
    padding: 12,
    maxHeight: 280,
    overflowY: "auto" as const,
  } as React.CSSProperties,
  roundItem: (isActive: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 8,
    cursor: "pointer",
    backgroundColor: isActive ? "#f3f4f6" : "transparent",
    transition: "background-color 0.15s",
  }),
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    cursor: "pointer",
  } as React.CSSProperties,
  badge: (color: string): React.CSSProperties => ({
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 4,
    backgroundColor: color + "20",
    color: color,
    fontWeight: 500,
  }),
  panelFooter: {
    padding: 12,
    borderTop: "1px solid #e5e7eb",
    textAlign: "center" as const,
  } as React.CSSProperties,
  link: (color: string): React.CSSProperties => ({
    color: color,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
  }),
  deleteButton: {
    color: "#ef4444",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
  } as React.CSSProperties,
  resolutionBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
  } as React.CSSProperties,
};

// ============================================================================
// Icons (inline SVGs)
// ============================================================================

const Icons = {
  feedback: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  ),
  close: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  rounds: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  list: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
  general: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" />
      <path d="M7 7h10M7 11h10M7 15h6" />
    </svg>
  ),
  check: "✓",
  exclamation: "!",
};

// ============================================================================
// Sub-Components
// ============================================================================

function Marker({
  point,
  color,
  label,
  showTooltip,
  tooltipContent,
  zIndex,
  onDelete,
}: {
  point: FeedbackPoint;
  color: string;
  label: string;
  showTooltip: boolean;
  tooltipContent: React.ReactNode;
  zIndex: number;
  onDelete?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      style={styles.marker(point.x, point.y, zIndex)}
      className="point-feedback-marker"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.markerDot(color)}>{label}</div>
      {(isHovered || showTooltip) && (
        <div style={styles.tooltip(zIndex)}>
          {tooltipContent}
        </div>
      )}
    </div>,
    document.body
  );
}

function InputPopup({
  position,
  comment,
  setComment,
  onSubmit,
  onCancel,
  labels,
  theme,
  zIndex,
}: {
  position: { x: number; y: number };
  comment: string;
  setComment: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  labels: Required<FeedbackWidgetConfig>["labels"];
  theme: Required<FeedbackWidgetConfig>["theme"];
  zIndex: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      style={styles.marker(position.x, position.y, zIndex)}
      className="point-feedback-marker"
    >
      <div style={styles.markerDot(theme.danger!)}>+</div>
      <div style={styles.inputContainer(zIndex)}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={labels.placeholder}
          style={styles.textarea}
          rows={3}
          autoFocus
        />
        <div style={styles.buttonRow}>
          <button
            onClick={onSubmit}
            disabled={!comment.trim()}
            style={{
              ...styles.submitButton(theme.primary!),
              opacity: comment.trim() ? 1 : 0.5,
              cursor: comment.trim() ? "pointer" : "not-allowed",
            }}
          >
            {labels.save}
          </button>
          <button onClick={onCancel} style={styles.cancelButton}>
            {labels.cancel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function FeedbackWidget(props: FeedbackWidgetConfig = {}) {
  const config = { ...defaultConfig, ...props };
  const {
    apiEndpoint,
    roundsEndpoint,
    generalFeedbackEndpoint,
    position,
    theme,
    labels,
    disabled,
    showRoundsButton,
    showGeneralFeedback,
    feedbackPageUrl,
    zIndex,
    onFeedbackAdd,
    onFeedbackDelete,
    onGeneralFeedbackAdd,
  } = config;

  const [isActive, setIsActive] = useState(false);
  const [points, setPoints] = useState<FeedbackPoint[]>([]);
  const [rounds, setRounds] = useState<FeedbackRound[]>([]);
  const [generalFeedbackList, setGeneralFeedbackList] = useState<GeneralFeedback[]>([]);
  const [visibleRounds, setVisibleRounds] = useState<Set<string>>(new Set());
  const [activePoint, setActivePoint] = useState<{ x: number; y: number } | null>(null);
  const [comment, setComment] = useState("");
  const [generalComment, setGeneralComment] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [showRoundPanel, setShowRoundPanel] = useState(false);
  const [showGeneralPanel, setShowGeneralPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState("");

  // Get current page path
  useEffect(() => {
    setCurrentPage(window.location.pathname);
  }, []);

  // Load feedback points
  useEffect(() => {
    if (disabled || !currentPage) return;

    const loadFeedback = async () => {
      try {
        const res = await fetch(`${apiEndpoint}?page=${encodeURIComponent(currentPage)}`);
        if (res.ok) {
          const data = await res.json();
          setPoints(data.feedback || data.points || data || []);
        }
      } catch (e) {
        console.error("[PointFeedback] Failed to load feedback:", e);
      }
    };
    loadFeedback();
  }, [apiEndpoint, currentPage, disabled]);

  // Load feedback rounds
  useEffect(() => {
    if (disabled || !currentPage || !showRoundsButton) return;

    const loadRounds = async () => {
      try {
        const res = await fetch(`${roundsEndpoint}?page=${encodeURIComponent(currentPage)}`);
        if (res.ok) {
          const data = await res.json();
          setRounds(data.rounds || []);
        }
      } catch (e) {
        console.error("[PointFeedback] Failed to load rounds:", e);
      }
    };
    loadRounds();
  }, [roundsEndpoint, currentPage, disabled, showRoundsButton]);

  // Load general feedback
  useEffect(() => {
    if (disabled || !currentPage || !showGeneralFeedback) return;

    const loadGeneralFeedback = async () => {
      try {
        const res = await fetch(`${generalFeedbackEndpoint}?page=${encodeURIComponent(currentPage)}`);
        if (res.ok) {
          const data = await res.json();
          setGeneralFeedbackList(data.feedback || data || []);
        }
      } catch (e) {
        console.error("[PointFeedback] Failed to load general feedback:", e);
      }
    };
    loadGeneralFeedback();
  }, [generalFeedbackEndpoint, currentPage, disabled, showGeneralFeedback]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handlePageClick = useCallback((e: React.MouseEvent) => {
    if (!isActive) return;
    const target = e.target as HTMLElement;
    if (target.closest(".point-feedback-marker") || target.closest(".point-feedback-widget")) {
      return;
    }

    const x = (e.clientX / window.innerWidth) * 100;
    const y = e.clientY + window.scrollY;

    setActivePoint({ x, y });
    setComment("");
  }, [isActive]);

  const handleSubmit = useCallback(async () => {
    if (!activePoint || !comment.trim()) return;

    const feedback: FeedbackPoint = {
      id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      x: activePoint.x,
      y: activePoint.y,
      comment: comment.trim(),
      page: currentPage,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback),
      });

      if (res.ok) {
        const data = await res.json();
        const savedFeedback = data.feedback || data.point || feedback;
        setPoints((prev) => [...prev, savedFeedback]);
        setActivePoint(null);
        setComment("");
        showToast(labels.feedbackSaved!);
        onFeedbackAdd?.(savedFeedback);
      }
    } catch (e) {
      console.error("[PointFeedback] Failed to save feedback:", e);
    }
  }, [activePoint, comment, currentPage, apiEndpoint, labels.feedbackSaved, showToast, onFeedbackAdd]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${apiEndpoint}?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPoints((prev) => prev.filter((p) => p.id !== id));
        showToast(labels.feedbackDeleted!);
        onFeedbackDelete?.(id);
      }
    } catch (e) {
      console.error("[PointFeedback] Failed to delete feedback:", e);
    }
  }, [apiEndpoint, labels.feedbackDeleted, showToast, onFeedbackDelete]);

  const toggleRound = useCallback((roundId: string) => {
    setVisibleRounds((prev) => {
      const next = new Set(prev);
      if (next.has(roundId)) {
        next.delete(roundId);
      } else {
        next.add(roundId);
      }
      return next;
    });
  }, []);

  const handleGeneralSubmit = useCallback(async () => {
    if (!generalComment.trim()) return;

    const feedback: GeneralFeedback = {
      id: `gf_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      comment: generalComment.trim(),
      page: currentPage,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(generalFeedbackEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback),
      });

      if (res.ok) {
        const data = await res.json();
        const savedFeedback = data.feedback || feedback;
        setGeneralFeedbackList((prev) => [savedFeedback, ...prev]);
        setGeneralComment("");
        showToast(labels.feedbackSaved!);
        onGeneralFeedbackAdd?.(savedFeedback);
      }
    } catch (e) {
      console.error("[PointFeedback] Failed to save general feedback:", e);
    }
  }, [generalComment, currentPage, generalFeedbackEndpoint, labels.feedbackSaved, showToast, onGeneralFeedbackAdd]);

  const handleDeleteGeneralFeedback = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${generalFeedbackEndpoint}?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setGeneralFeedbackList((prev) => prev.filter((f) => f.id !== id));
        showToast(labels.feedbackDeleted!);
      }
    } catch (e) {
      console.error("[PointFeedback] Failed to delete general feedback:", e);
    }
  }, [generalFeedbackEndpoint, labels.feedbackDeleted, showToast]);

  if (disabled) return null;

  const visibleRoundItems = rounds
    .filter((r) => visibleRounds.has(r.id))
    .flatMap((r) =>
      r.items.map((item) => ({
        ...item,
        roundId: r.id,
        roundName: r.name,
        roundStatus: r.status,
      }))
    );

  return (
    <>
      {/* Click overlay */}
      {isActive && (
        <div
          style={styles.overlay(zIndex)}
          onClick={handlePageClick}
          className="point-feedback-widget"
        />
      )}

      {/* Live feedback markers (blue) */}
      {points.map((point) => (
        <Marker
          key={point.id}
          point={point}
          color={point.resolved ? theme.success! : theme.primary!}
          label={point.resolved ? Icons.check : Icons.exclamation}
          showTooltip={false}
          zIndex={zIndex}
          onDelete={() => handleDelete(point.id)}
          tooltipContent={
            <>
              <div style={styles.tooltipHeader(point.resolved ? theme.success! : theme.primary!)}>
                {point.resolved ? labels.resolved : labels.newFeedback}
              </div>
              <div style={styles.tooltipBody}>
                <p style={{ margin: 0, fontSize: 14, color: "#374151" }}>{point.comment}</p>
                {point.resolved && point.resolution && (
                  <div style={styles.resolutionBox}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#15803d" }}>
                      Resolution:
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#166534" }}>
                      {point.resolution}
                    </p>
                  </div>
                )}
              </div>
              <div style={styles.tooltipFooter}>
                <span>{new Date(point.timestamp).toLocaleString()}</span>
                <button style={styles.deleteButton} onClick={() => handleDelete(point.id)}>
                  {labels.delete}
                </button>
              </div>
            </>
          }
        />
      ))}

      {/* Round feedback markers (green/orange) */}
      {visibleRoundItems.map((item) => (
        <Marker
          key={`${item.roundId}-${item.id}`}
          point={item}
          color={item.roundStatus === "completed" ? theme.success! : theme.warning!}
          label={item.roundStatus === "completed" ? Icons.check : Icons.exclamation}
          showTooltip={false}
          zIndex={zIndex}
          tooltipContent={
            <>
              <div style={styles.tooltipHeader(item.roundStatus === "completed" ? theme.success! : theme.warning!)}>
                {item.roundName} {item.roundStatus === "completed" && `- ${labels.resolved}`}
              </div>
              <div style={styles.tooltipBody}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>
                  Feedback
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 14, color: "#374151" }}>
                  {item.comment || (item as any).feedback}
                </p>
                {((item as any).solution || item.resolution) && (
                  <div style={styles.resolutionBox}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#15803d" }}>
                      Solution
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#166534" }}>
                      {(item as any).solution || item.resolution}
                    </p>
                  </div>
                )}
              </div>
              <div style={styles.tooltipFooter}>
                <span>{new Date(item.timestamp).toLocaleString()}</span>
              </div>
            </>
          }
        />
      ))}

      {/* Active input popup */}
      {activePoint && (
        <InputPopup
          position={activePoint}
          comment={comment}
          setComment={setComment}
          onSubmit={handleSubmit}
          onCancel={() => {
            setActivePoint(null);
            setComment("");
          }}
          labels={labels}
          theme={theme}
          zIndex={zIndex}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <div style={styles.toast(zIndex)} className="point-feedback-widget">
          {toast}
        </div>
      )}

      {/* Rounds panel */}
      {showRoundPanel && (
        <div style={styles.panel(position, zIndex)} className="point-feedback-widget">
          <div style={styles.panelHeader}>{labels.rounds}</div>
          <div style={styles.panelBody}>
            {rounds.length === 0 ? (
              <p style={{ textAlign: "center", color: "#6b7280", padding: "20px 0", fontSize: 14 }}>
                {labels.noRounds}
              </p>
            ) : (
              rounds.map((round) => (
                <div
                  key={round.id}
                  style={styles.roundItem(visibleRounds.has(round.id))}
                  onClick={() => toggleRound(round.id)}
                >
                  <input
                    type="checkbox"
                    checked={visibleRounds.has(round.id)}
                    onChange={() => {}}
                    style={styles.checkbox}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 500, fontSize: 14, color: "#111827" }}>
                        {round.name}
                      </span>
                      <span
                        style={styles.badge(
                          round.status === "completed"
                            ? theme.success!
                            : round.status === "active"
                            ? theme.warning!
                            : theme.secondary!
                        )}
                      >
                        {round.status}
                      </span>
                    </div>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
                      {round.items.length} items
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          {feedbackPageUrl && (
            <div style={styles.panelFooter}>
              <a href={feedbackPageUrl} style={styles.link(theme.primary!)}>
                {labels.viewAll} →
              </a>
            </div>
          )}
        </div>
      )}

      {/* General feedback panel */}
      {showGeneralPanel && (
        <div style={styles.panel(position, zIndex)} className="point-feedback-widget">
          <div style={styles.panelHeader}>{labels.generalFeedback}</div>
          <div style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>
            <textarea
              value={generalComment}
              onChange={(e) => setGeneralComment(e.target.value)}
              placeholder={labels.generalPlaceholder}
              style={{ ...styles.textarea, marginBottom: 8 }}
              rows={3}
            />
            <button
              onClick={handleGeneralSubmit}
              disabled={!generalComment.trim()}
              style={{
                ...styles.submitButton(theme.primary!),
                width: "100%",
                opacity: generalComment.trim() ? 1 : 0.5,
                cursor: generalComment.trim() ? "pointer" : "not-allowed",
              }}
            >
              {labels.addGeneralFeedback}
            </button>
          </div>
          <div style={styles.panelBody}>
            {generalFeedbackList.length === 0 ? (
              <p style={{ textAlign: "center", color: "#6b7280", padding: "20px 0", fontSize: 14 }}>
                {labels.noGeneralFeedback}
              </p>
            ) : (
              generalFeedbackList.map((feedback) => (
                <div
                  key={feedback.id}
                  style={{
                    padding: 12,
                    backgroundColor: "#f9fafb",
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                >
                  <p style={{ margin: 0, fontSize: 14, color: "#374151" }}>{feedback.comment}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>
                      {new Date(feedback.timestamp).toLocaleString()}
                    </span>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDeleteGeneralFeedback(feedback.id)}
                    >
                      {labels.delete}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Control buttons */}
      <div style={styles.buttonContainer(position, zIndex)} className="point-feedback-widget">
        <button
          onClick={() => setIsActive(!isActive)}
          style={styles.button(isActive ? theme.danger! : theme.primary!)}
          title={isActive ? labels.stopFeedback : labels.addFeedback}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {isActive ? Icons.close : Icons.feedback}
        </button>

        {showRoundsButton && (
          <button
            onClick={() => {
              setShowRoundPanel(!showRoundPanel);
              setShowGeneralPanel(false);
            }}
            style={styles.button(showRoundPanel ? "#059669" : theme.success!)}
            title={labels.rounds}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {Icons.rounds}
          </button>
        )}

        {showGeneralFeedback && (
          <button
            onClick={() => {
              setShowGeneralPanel(!showGeneralPanel);
              setShowRoundPanel(false);
            }}
            style={styles.button(showGeneralPanel ? "#7c3aed" : "#8b5cf6")}
            title={labels.generalFeedback}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {Icons.general}
          </button>
        )}

        {feedbackPageUrl && (
          <a
            href={feedbackPageUrl}
            style={{ ...styles.button(theme.secondary!), textDecoration: "none" }}
            title={labels.viewAll}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {Icons.list}
          </a>
        )}
      </div>

      {/* Helper text */}
      {isActive && !showRoundPanel && !activePoint && (
        <div style={styles.helperText(position, zIndex)} className="point-feedback-widget">
          {labels.clickToAdd}
        </div>
      )}
    </>
  );
}

export default FeedbackWidget;
