import { useState, useEffect, useRef } from "react";

/* ── Button ─────────────────────────────────── */
export function Btn({
  children,
  variant = "primary",
  size = "md",
  loading,
  icon,
  className = "",
  ...props
}) {
  const base = `btn btn-${variant} btn-${size} ${className}`;
  return (
    <button className={base} disabled={loading || props.disabled} {...props}>
      {loading && <Spinner size={14} />}
      {!loading && icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
}

/* ── Input ──────────────────────────────────── */
export function Input({ label, error, icon, className = "", ...props }) {
  return (
    <div className={`field ${className}`}>
      {label && <label className="field-label">{label}</label>}
      <div className="field-wrap">
        {icon && <span className="field-icon">{icon}</span>}
        <input
          className={`field-input ${icon ? "field-input--icon" : ""} ${error ? "field-input--error" : ""}`}
          {...props}
        />
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

/* ── Select ─────────────────────────────────── */
export function Select({
  label,
  error,
  options = [],
  className = "",
  ...props
}) {
  return (
    <div className={`field ${className}`}>
      {label && <label className="field-label">{label}</label>}
      <select
        className={`field-input field-select ${error ? "field-input--error" : ""}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

/* ── Badge ──────────────────────────────────── */
export function Badge({ children, color = "default" }) {
  return <span className={`badge badge-${color}`}>{children}</span>;
}

export function StatusBadge({ status }) {
  const map = {
    Active: "success",
    Inactive: "default",
    Suspended: "danger",
    Paid: "success",
    Pending: "warning",
    Overdue: "danger",
  };
  return <Badge color={map[status] || "default"}>{status}</Badge>;
}

/* ── Spinner ─────────────────────────────────── */
export function Spinner({ size = 20, color = "var(--red)" }) {
  return (
    <svg
      className="spinner"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── PageLoader ──────────────────────────────── */
export function PageLoader() {
  return (
    <div className="page-loader">
      <Spinner size={36} />
    </div>
  );
}

/* ── Card ────────────────────────────────────── */
export function Card({ children, className = "", ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

/* ── Stat Card ───────────────────────────────── */
export function StatCard({ label, value, icon, color = "red", trend }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__body">
        <div className="stat-card__value">{value ?? "—"}</div>
        <div className="stat-card__label">{label}</div>
        {trend !== undefined && (
          <div className={`stat-card__trend ${trend >= 0 ? "up" : "down"}`}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Modal ───────────────────────────────────── */
export function Modal({ open, onClose, title, children, width = 540 }) {
  const ref = useRef();
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal" ref={ref} style={{ maxWidth: width }}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ── Confirm Modal ───────────────────────────── */
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  danger,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} width={420}>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>{message}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>
          Cancel
        </Btn>
        <Btn variant={danger ? "danger" : "primary"} onClick={onConfirm}>
          Confirm
        </Btn>
      </div>
    </Modal>
  );
}

/* ── Table ───────────────────────────────────── */
export function Table({
  cols,
  rows,
  loading,
  emptyText = "No records found",
  onRow,
}) {
  if (loading)
    return (
      <div className="table-loading">
        <Spinner />
      </div>
    );
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={cols.length} className="table-empty">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={row._id || i}
                onClick={() => onRow?.(row)}
                className={onRow ? "table-row--click" : ""}
              >
                {cols.map((c) => (
                  <td key={c.key}>
                    {c.render ? c.render(row[c.key], row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ── Toast ───────────────────────────────────── */
let _setToasts;
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  _setToasts = setToasts;
  return (
    <>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
export function toast(message, type = "success", duration = 3500) {
  const id = Date.now();
  _setToasts?.((prev) => [...prev, { id, message, type }]);
  setTimeout(
    () => _setToasts?.((prev) => prev.filter((t) => t.id !== id)),
    duration,
  );
}

/* ── Search Bar ──────────────────────────────── */
export function SearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <div className="search-bar">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

/* ── Empty State ─────────────────────────────── */
export function Empty({ icon = "📭", title = "Nothing here yet", subtitle }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      {subtitle && <div className="empty-sub">{subtitle}</div>}
    </div>
  );
}
