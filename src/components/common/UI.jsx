import { useState, useEffect, useRef, useId } from "react";

const _MASS_GYM_STYLES = `/* ============================================================
   Mass Gym — UI Component Library Styles
   Theme-matched to Sidebar/Layout (#373255 primary, Rajdhani/Space Mono)
   Fully responsive: 1024 / 768 / 480 breakpoints
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

/* ── Design Tokens ─────────────────────────────────────────── */
:root {
  --primary: #373255;
  --primary-dark: #2a2641;
  --primary-light: #4a4470;
  --accent: #0099FF;

  --bg: #F8F9FA;
  --surface: #FFFFFF;
  --surface-2: #F1F3F5;
  --surface-3: #E9ECEF;

  --text: #1A1D29;
  --text-muted: #6C757D;
  --border: #E0E4E8;

  --error: #DC3545;
  --success: #28A745;
  --warning: #F59E0B;
  --blue: #3B82F6;

  /* Aliases so component defaults (var(--red), var(--muted)) stay on-theme */
  --red: var(--primary);
  --muted: var(--text-muted);

  --shadow-sm: 0 1px 2px rgba(26, 29, 41, 0.06);
  --shadow: 0 2px 8px rgba(26, 29, 41, 0.08);
  --shadow-md: 0 6px 20px rgba(26, 29, 41, 0.10);
  --shadow-lg: 0 12px 40px rgba(26, 29, 41, 0.16);

  --font-display: 'Rajdhani', system-ui, sans-serif;
  --font-mono: 'Space Mono', monospace;

  --r-sm: 6px;
  --r-md: 10px;
  --r-lg: 14px;
  --r-pill: 999px;

  --ease: cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Button ────────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: 0.01em;
  border: 1px solid transparent;
  border-radius: var(--r-md);
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.12s var(--ease), box-shadow 0.2s var(--ease),
    background 0.2s var(--ease), border-color 0.2s var(--ease), color 0.2s var(--ease);
  user-select: none;
}
.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(55, 50, 85, 0.25);
}
.btn:active:not(:disabled) { transform: translateY(1px); }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }

/* sizes */
.btn-sm { padding: 7px 14px; font-size: 13px; }
.btn-md { padding: 10px 18px; font-size: 15px; }
.btn-lg { padding: 13px 24px; font-size: 16px; }

/* variants */
.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #fff;
  box-shadow: var(--shadow-sm);
}
.btn-primary:hover:not(:disabled) {
  box-shadow: 0 6px 18px rgba(55, 50, 85, 0.35);
  transform: translateY(-1px);
}
.btn-secondary {
  background: var(--surface-2);
  color: var(--text);
  border-color: var(--border);
}
.btn-secondary:hover:not(:disabled) { background: var(--surface-3); }
.btn-danger {
  background: var(--error);
  color: #fff;
}
.btn-danger:hover:not(:disabled) {
  background: #c12a39;
  box-shadow: 0 6px 18px rgba(220, 53, 69, 0.35);
  transform: translateY(-1px);
}
.btn-ghost {
  background: transparent;
  color: var(--text-muted);
}
.btn-ghost:hover:not(:disabled) {
  background: var(--surface-2);
  color: var(--text);
}
.btn-icon { display: inline-flex; align-items: center; }

/* ── Field (Input / Select shared) ─────────────────────────── */
.field { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.field-label {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0.01em;
}
.field-wrap { position: relative; display: flex; align-items: center; }
.field-icon {
  position: absolute;
  left: 12px;
  display: flex;
  color: var(--text-muted);
  pointer-events: none;
}
.field-input {
  width: 100%;
  font-family: var(--font-display);
  font-size: 15px;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 11px 14px;
  transition: border-color 0.2s var(--ease), box-shadow 0.2s var(--ease);
}
.field-input::placeholder { color: var(--text-muted); opacity: 0.7; }
.field-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(55, 50, 85, 0.12);
}
.field-input--icon { padding-left: 40px; }
.field-input--error {
  border-color: var(--error);
}
.field-input--error:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);
}
.field-error {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 500;
  color: var(--error);
}
.field-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236C757D' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 40px;
  cursor: pointer;
}

/* ── Badge ─────────────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 4px 10px;
  border-radius: var(--r-pill);
  line-height: 1.4;
}
.badge-default { background: var(--surface-3); color: var(--text-muted); }
.badge-success { background: rgba(40, 167, 69, 0.12); color: #1e7e34; }
.badge-warning { background: rgba(245, 158, 11, 0.15); color: #b06d00; }
.badge-danger  { background: rgba(220, 53, 69, 0.12); color: var(--error); }

/* ── Spinner ───────────────────────────────────────────────── */
.spinner { animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Page Loader ───────────────────────────────────────────── */
.page-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  width: 100%;
}

/* ── Card ──────────────────────────────────────────────────── */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
  padding: 24px;
  transition: box-shadow 0.2s var(--ease);
}

/* ── Stat Card ─────────────────────────────────────────────── */
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  transition: transform 0.18s var(--ease), box-shadow 0.18s var(--ease);
}
.stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.stat-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  background: var(--primary);
}
.stat-card__icon {
  width: 52px;
  height: 52px;
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--primary);
  background: rgba(55, 50, 85, 0.10);
}
.stat-card__body { flex: 1; min-width: 0; }
.stat-card__value {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.1;
}
.stat-card__label {
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-top: 4px;
}
.stat-card__trend {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 6px;
}
.stat-card__trend.up { color: var(--success); }
.stat-card__trend.down { color: var(--error); }

/* color variants — accent stripe + icon tint */
.stat-card--primary::before { background: var(--primary); }
.stat-card--primary .stat-card__icon { color: var(--primary); background: rgba(55,50,85,0.10); }
.stat-card--red::before    { background: var(--primary); }
.stat-card--red .stat-card__icon { color: var(--primary); background: rgba(55,50,85,0.10); }
.stat-card--blue::before   { background: var(--blue); }
.stat-card--blue .stat-card__icon { color: var(--blue); background: rgba(59,130,246,0.12); }
.stat-card--green::before  { background: var(--success); }
.stat-card--green .stat-card__icon { color: var(--success); background: rgba(40,167,69,0.12); }
.stat-card--orange::before { background: var(--warning); }
.stat-card--orange .stat-card__icon { color: var(--warning); background: rgba(245,158,11,0.15); }
.stat-card--accent::before { background: var(--accent); }
.stat-card--accent .stat-card__icon { color: var(--accent); background: rgba(0,153,255,0.12); }

/* ── Modal ─────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 29, 41, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
  animation: overlayIn 0.2s var(--ease);
}
@keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
.modal {
  width: 100%;
  background: var(--surface);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-lg);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: modalIn 0.25s var(--ease);
}
@keyframes modalIn {
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}
.modal-title {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 700;
  color: var(--text);
}
.modal-close {
  width: 32px;
  height: 32px;
  border-radius: var(--r-sm);
  border: none;
  background: var(--surface-2);
  color: var(--text-muted);
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s var(--ease);
}
.modal-close:hover { background: var(--error); color: #fff; }
.modal-body {
  padding: 24px;
  overflow-y: auto;
}

/* ── Table ─────────────────────────────────────────────────── */
.table-wrap {
  width: 100%;
  overflow-x: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
  -webkit-overflow-scrolling: touch;
}
.table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-display);
  min-width: 560px;
}
.table thead th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  background: var(--surface-2);
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
.table tbody td {
  padding: 14px 18px;
  font-size: 14px;
  color: var(--text);
  border-bottom: 1px solid var(--border);
}
.table tbody tr:last-child td { border-bottom: none; }
.table tbody tr { transition: background 0.15s var(--ease); }
.table-row--click { cursor: pointer; }
.table-row--click:hover { background: var(--surface-2); }
.table-empty {
  text-align: center !important;
  color: var(--text-muted);
  padding: 40px 18px !important;
  font-size: 14px;
}
.table-loading {
  display: flex;
  justify-content: center;
  padding: 48px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
}

/* ── Toast ─────────────────────────────────────────────────── */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 2000;
  max-width: calc(100vw - 40px);
}
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 240px;
  max-width: 360px;
  padding: 13px 16px;
  border-radius: var(--r-md);
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 4px solid var(--text-muted);
  box-shadow: var(--shadow-md);
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  animation: toastIn 0.25s var(--ease);
}
@keyframes toastIn {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}
.toast-success { border-left-color: var(--success); }
.toast-error   { border-left-color: var(--error); }
.toast-warning { border-left-color: var(--warning); }
.toast-info    { border-left-color: var(--accent); }

/* ── Search Bar ────────────────────────────────────────────── */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  padding: 9px 16px;
  width: 100%;
  max-width: 360px;
  transition: border-color 0.2s var(--ease), box-shadow 0.2s var(--ease);
}
.search-bar:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(55, 50, 85, 0.12);
}
.search-bar svg { color: var(--text-muted); flex-shrink: 0; }
.search-bar input {
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--text);
  width: 100%;
}
.search-bar input::placeholder { color: var(--text-muted); opacity: 0.7; }
.search-bar__clear {
  border: none;
  background: var(--surface-2);
  color: var(--text-muted);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s var(--ease);
}
.search-bar__clear:hover { background: var(--error); color: #fff; }

/* ── Empty State ───────────────────────────────────────────── */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 56px 24px;
  color: var(--text-muted);
}
.empty-icon { font-size: 44px; margin-bottom: 12px; line-height: 1; }
.empty-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
}
.empty-sub { font-size: 14px; margin-top: 4px; max-width: 320px; }

/* ============================================================
   RESPONSIVE
   ============================================================ */

/* Tablet */
@media (max-width: 1024px) {
  .card { padding: 20px; }
  .stat-card { padding: 16px; gap: 12px; }
  .stat-card__value { font-size: 24px; }
  .stat-card__icon { width: 46px; height: 46px; }
}

/* Small tablet / large phone */
@media (max-width: 768px) {
  .modal-header { padding: 16px 18px; }
  .modal-body { padding: 18px; }
  .modal-title { font-size: 17px; }
  .table thead th, .table tbody td { padding: 12px 14px; }
  .search-bar { max-width: 100%; }
  .toast { min-width: 0; max-width: 100%; }
}

/* Phone */
@media (max-width: 480px) {
  .btn-md { padding: 10px 16px; font-size: 14px; }
  .btn-lg { padding: 12px 20px; font-size: 15px; }
  /* full-bleed modal feel on small screens */
  .modal-overlay { padding: 0; align-items: flex-end; }
  .modal {
    max-width: 100% !important;
    border-radius: var(--r-lg) var(--r-lg) 0 0;
    max-height: 92vh;
    animation: modalSheetIn 0.28s var(--ease);
  }
  @keyframes modalSheetIn {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  .card { padding: 16px; }
  .stat-card__value { font-size: 22px; }
  .field-input, .search-bar input { font-size: 16px; } /* prevents iOS zoom-on-focus */
  .empty { padding: 40px 16px; }
}

/* Stacked table on small screens (cards instead of horizontal scroll) */
@media (max-width: 640px) {
  .table--responsive { min-width: 0; }
  .table--responsive thead { display: none; }
  .table--responsive tbody tr {
    display: block;
    padding: 6px 0;
    border-bottom: 1px solid var(--border);
  }
  .table--responsive tbody tr:last-child { border-bottom: none; }
  .table--responsive tbody td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 8px 16px;
    border-bottom: none;
    text-align: right;
  }
  .table--responsive tbody td::before {
    content: attr(data-label);
    font-family: var(--font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-muted);
    text-align: left;
    flex-shrink: 0;
  }
  .table--responsive .table-empty { display: block; text-align: center !important; }
  .table--responsive .table-empty::before { content: none; }
}

/* Respect reduced-motion preferences */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
`;

if (typeof document !== "undefined" && !document.getElementById("mass-gym-ui-styles")) {
  const _styleEl = document.createElement("style");
  _styleEl.id = "mass-gym-ui-styles";
  _styleEl.textContent = _MASS_GYM_STYLES;
  document.head.appendChild(_styleEl);
}


/* ── Button ─────────────────────────────────── */
export function Btn({
  children,
  variant = "primary",
  size = "md",
  loading,
  icon,
  type = "button",
  className = "",
  ...props
}) {
  const base = `btn btn-${variant} btn-${size} ${className}`;
  return (
    <button
      type={type}
      className={base}
      disabled={loading || props.disabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner size={14} color="currentColor" />}
      {!loading && icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
}

/* ── Input ──────────────────────────────────── */
export function Input({ label, error, icon, className = "", id, ...props }) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="field-wrap">
        {icon && <span className="field-icon">{icon}</span>}
        <input
          id={inputId}
          className={`field-input ${icon ? "field-input--icon" : ""} ${
            error ? "field-input--error" : ""
          }`}
          aria-invalid={error ? true : undefined}
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
  id,
  ...props
}) {
  const autoId = useId();
  const selectId = id || autoId;
  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field-label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`field-input field-select ${
          error ? "field-input--error" : ""
        }`}
        aria-invalid={error ? true : undefined}
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
export function Spinner({ size = 20, color = "var(--primary)" }) {
  return (
    <svg
      className="spinner"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
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
export function StatCard({ label, value, icon, color = "primary", trend }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      {icon && <div className="stat-card__icon">{icon}</div>}
      <div className="stat-card__body">
        <div className="stat-card__value">{value ?? "—"}</div>
        <div className="stat-card__label">{label}</div>
        {trend !== undefined && trend !== null && (
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
  const titleId = useId();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div
        className="modal"
        ref={ref}
        style={{ maxWidth: width }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-header">
          <h3 className="modal-title" id={titleId}>
            {title}
          </h3>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
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
  confirmLabel = "Confirm",
  loading,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} width={420}>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{message}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="ghost" onClick={onClose} disabled={loading}>
          Cancel
        </Btn>
        <Btn
          variant={danger ? "danger" : "primary"}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
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
  responsive = true,
}) {
  if (loading)
    return (
      <div className="table-loading">
        <Spinner />
      </div>
    );
  return (
    <div className="table-wrap">
      <table className={`table ${responsive ? "table--responsive" : ""}`}>
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
                  <td key={c.key} data-label={c.label}>
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
/* Subscriber pattern: toasts queue correctly even before/across providers */
const _listeners = new Set();
let _toasts = [];

function _emit() {
  _listeners.forEach((fn) => fn(_toasts));
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState(_toasts);
  useEffect(() => {
    _listeners.add(setToasts);
    setToasts(_toasts);
    return () => _listeners.delete(setToasts);
  }, []);
  return (
    <>
      {children}
      <div  role="region" aria-live="polite">
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
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  _toasts = [..._toasts, { id, message, type }];
  _emit();
  setTimeout(() => {
    _toasts = _toasts.filter((t) => t.id !== id);
    _emit();
  }, duration);
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
        aria-label={placeholder}
      />
      {value && (
        <button
          className="search-bar__clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
          type="button"
        >
          ✕
        </button>
      )}
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