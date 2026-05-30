import { useState, useEffect, useMemo } from "react";
import Layout from "../../components/Layout/Layout";
import {
  Btn,
  Input,
  Card,
  Table,
  StatusBadge,
  SearchBar,
  toast,
} from "../../components/common/UI";
import { reportsAPI } from "../../api/services";
import { useRef, useLayoutEffect } from "react";

const STYLE_ID = "ui-tabs-styles";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = `
    .ui-tabs button:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
    .ui-tabs button[aria-selected="false"]:hover { color: var(--text); }
  `;
  document.head.appendChild(el);
}

function Tabs({
  value,
  onChange,
  options = [],
  ariaLabel,
  size = "md",
  fluid = false,
}) {
  const items = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );
  const optionsKey = items.map((o) => o.value).join("|");
  const activeIndex = items.findIndex((o) => o.value === value);

  const btnRefs = useRef({});
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  // Measure the active button and move the indicator under it
  const measure = () => {
    const el = btnRefs.current[value];
    if (el)
      setPill((p) => ({
        left: el.offsetLeft,
        width: el.offsetWidth,
        ready: p.ready,
      }));
    else setPill((p) => ({ ...p, width: 0 })); // no match (e.g. "custom") → hide pill
  };

  useLayoutEffect(() => {
    measure();
    // mark ready on the next frame so the first placement doesn't animate from 0
    const id = requestAnimationFrame(() =>
      setPill((p) => ({ ...p, ready: true })),
    );
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, optionsKey]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, optionsKey]);

  const onKeyDown = (e) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key) || items.length === 0) return;
    e.preventDefault();
    const i = activeIndex < 0 ? 0 : activeIndex;
    let next = i;
    if (e.key === "ArrowLeft") next = (i - 1 + items.length) % items.length;
    else if (e.key === "ArrowRight") next = (i + 1) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    const target = items[next];
    onChange?.(target.value);
    btnRefs.current[target.value]?.focus();
  };

  const pad = size === "sm" ? "6px 14px" : "8px 18px";
  const font = size === "sm" ? 12 : 13;

  return (
    <div
      className="ui-tabs"
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      style={{
        position: "relative",
        display: fluid ? "flex" : "inline-flex",
        width: fluid ? "100%" : "auto",
        gap: 2,
        padding: 3,
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        borderRadius: 10,
      }}
    >
      {/* Sliding indicator */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 3,
          bottom: 3,
          left: pill.left,
          width: pill.width,
          background:
            "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
          borderRadius: 7,
          boxShadow: "0 2px 6px var(--shadow)",
          opacity: pill.width ? 1 : 0,
          transition: pill.ready
            ? "left .25s cubic-bezier(.4,0,.2,1), width .25s cubic-bezier(.4,0,.2,1), opacity .2s ease"
            : "none",
          zIndex: 0,
        }}
      />

      {items.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              btnRefs.current[o.value] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange?.(o.value)}
            style={{
              position: "relative",
              zIndex: 1,
              flex: fluid ? 1 : "0 0 auto",
              padding: pad,
              border: "none",
              background: "transparent",
              color: active ? "#fff" : "var(--text-muted)",
              fontSize: font,
              fontWeight: 600,
              fontFamily: "var(--font-display)",
              textTransform: "capitalize",
              borderRadius: 7,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "color .2s ease",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Date range presets ─────────────────────────────────────────────────────
const PRESETS = [
  { value: "month", label: "This month" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "year", label: "This year" },
  { value: "all", label: "All time" },
];

const toISO = (d) => d.toISOString().slice(0, 10);

function rangeFor(key) {
  const end = new Date();
  if (key === "all") return { start: "", end: "" };
  let start;
  if (key === "month") start = new Date(end.getFullYear(), end.getMonth(), 1);
  else if (key === "30d") start = new Date(Date.now() - 30 * 864e5);
  else if (key === "90d") start = new Date(Date.now() - 90 * 864e5);
  else if (key === "year") start = new Date(end.getFullYear(), 0, 1);
  else return { start: "", end: "" };
  return { start: toISO(start), end: toISO(end) };
}

// ── Small summary card ──────────────────────────────────────────────────────
function StatCard({ label, value, accent = "var(--primary)" }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${accent}`,
        borderRadius: 12,
        padding: "14px 16px",
        boxShadow: "0 2px 8px var(--shadow)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
          letterSpacing: ".05em",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>
        {value}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [tab, setTab] = useState("payments");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ran, setRan] = useState(false);
  const [dates, setDates] = useState({ start: "", end: "" });
  const [preset, setPreset] = useState("all");
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");

  const invalidRange = dates.start && dates.end && dates.start > dates.end;

  const run = async (range = dates) => {
    if (range.start && range.end && range.start > range.end) {
      toast("Start date must be before end date", "error");
      return;
    }
    setLoading(true);
    setRan(true);
    try {
      if (tab === "payments") {
        const params = {};
        if (range.start) params.startDate = range.start;
        if (range.end) params.endDate = range.end;
        const { data: d } = await reportsAPI.payments(params);
        setData(d.payments || []);
        setTotal(d.total || 0);
      } else {
        const { data: d } = await reportsAPI.members();
        setData(d.members || []);
        setTotal(0);
      }
    } catch {
      toast("Report failed", "error");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-run on first load and whenever the tab changes
  useEffect(() => {
    setQ("");
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const applyPreset = (key) => {
    setPreset(key);
    const r = rangeFor(key);
    setDates(r);
    run(r);
  };

  const onDateChange = (which) => (e) => {
    setPreset("custom");
    setDates((d) => ({ ...d, [which]: e.target.value }));
  };

  // ── Columns ───────────────────────────────────────────────────────────────
  const paymentCols = [
    {
      key: "invoiceNumber",
      label: "Invoice",
      render: (v) => (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          {v}
        </span>
      ),
    },
    { key: "member", label: "Member", render: (v) => v?.name || "—" },
    { key: "plan", label: "Plan", render: (v) => v?.name || "—" },
    {
      key: "amount",
      label: "Amount",
      render: (v) => (
        <span style={{ fontWeight: 600 }}>Rs {v?.toLocaleString()}</span>
      ),
    },
    {
      key: "method",
      label: "Method",
      render: (v) => (
        <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{v}</span>
      ),
    },
    {
      key: "paidAt",
      label: "Paid",
      render: (v) => (v ? new Date(v).toLocaleDateString("en-PK") : "—"),
    },
  ];

  const memberCols = [
    {
      key: "name",
      label: "Name",
      render: (v) => <span style={{ fontWeight: 600 }}>{v}</span>,
    },
    {
      key: "email",
      label: "Email",
      render: (v) => (
        <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{v}</span>
      ),
    },
    { key: "plan", label: "Plan", render: (v) => v?.name || "—" },
    {
      key: "gymCardNumber",
      label: "Card No.",
      render: (v) => (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          {v}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (v) => <StatusBadge status={v} />,
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (v) => new Date(v).toLocaleDateString("en-PK"),
    },
  ];

  const cols = tab === "payments" ? paymentCols : memberCols;

  // ── Client-side search over the loaded result set ──────────────────────────
  const filtered = useMemo(() => {
    if (!q.trim()) return data;
    const t = q.trim().toLowerCase();
    return data.filter((row) => {
      const hay = [
        row.name,
        row.email,
        row.invoiceNumber,
        row.gymCardNumber,
        row.method,
        row.member?.name,
        row.plan?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(t);
    });
  }, [q, data]);

  // ── Summary numbers (respect the search filter) ────────────────────────────
  const summary = useMemo(() => {
    if (tab === "payments") {
      const sum = q.trim()
        ? filtered.reduce((s, r) => s + (r.amount || 0), 0)
        : total;
      const count = filtered.length;
      const avg = count ? Math.round(sum / count) : 0;
      return { sum, count, avg };
    }
    const by = (st) =>
      filtered.filter((m) => String(m.status || "").toLowerCase() === st)
        .length;
    return {
      count: filtered.length,
      active: by("active"),
      inactive: by("inactive"),
      suspended: by("suspended"),
    };
  }, [tab, filtered, total, q]);

  // ── CSV export (exports what's currently shown) ────────────────────────────
  const exportCSV = () => {
    const headers = cols.map((c) => c.label);
    const lines = filtered.map((row) =>
      cols
        .map((c) => {
          let val = row[c.key];
          if (val && typeof val === "object")
            val = val.name ?? val.invoiceNumber ?? "";
          if (c.key === "paidAt" || c.key === "createdAt")
            val = val ? new Date(val).toLocaleDateString("en-PK") : "";
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        })
        .join(","),
    );
    const csv = [headers.join(","), ...lines].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tab}-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout title="Reports">
      {/* Controls */}
      <Card style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Tabs
            value={tab}
            onChange={setTab}
            options={["payments", "members"]}
            ariaLabel="Report type"
          />
          <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
            <Btn
              variant="primary"
              onClick={() => run()}
              loading={loading}
              disabled={invalidRange}
            >
              {tab === "payments" ? "Run Report" : "Refresh"}
            </Btn>
            {filtered.length > 0 && (
              <Btn variant="ghost" onClick={exportCSV}>
                ↓ Export CSV
              </Btn>
            )}
          </div>
        </div>

        {tab === "payments" && (
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "flex-end",
              marginTop: 16,
            }}
          >
            <Tabs
              value={preset}
              onChange={applyPreset}
              options={PRESETS}
              ariaLabel="Date range"
            />
            <Input
              label="Start date"
              type="date"
              value={dates.start}
              onChange={onDateChange("start")}
            />
            <Input
              label="End date"
              type="date"
              value={dates.end}
              onChange={onDateChange("end")}
            />
            {invalidRange && (
              <span
                style={{
                  fontSize: 12,
                  color: "var(--error)",
                  alignSelf: "center",
                  paddingBottom: 10,
                }}
              >
                Start date is after end date
              </span>
            )}
          </div>
        )}
      </Card>

      {/* Loading skeleton */}
      {loading && <Table cols={cols} rows={[]} loading />}

      {/* Results */}
      {!loading && data.length > 0 && (
        <>
          {/* Summary cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {tab === "payments" ? (
              <>
                <StatCard
                  label="Total Revenue"
                  value={`Rs ${summary.sum.toLocaleString()}`}
                  accent="var(--success)"
                />
                <StatCard label="Payments" value={summary.count} />
                <StatCard
                  label="Average"
                  value={`Rs ${summary.avg.toLocaleString()}`}
                  accent="var(--warning)"
                />
              </>
            ) : (
              <>
                <StatCard label="Total" value={summary.count} />
                <StatCard
                  label="Active"
                  value={summary.active}
                  accent="var(--success)"
                />
                <StatCard
                  label="Inactive"
                  value={summary.inactive}
                  accent="var(--text-muted)"
                />
                <StatCard
                  label="Suspended"
                  value={summary.suspended}
                  accent="var(--error)"
                />
              </>
            )}
          </div>

          {/* Search + count */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            <div style={{ flex: 1, minWidth: 220, maxWidth: 360 }}>
              <SearchBar
                value={q}
                onChange={setQ}
                placeholder={`Search ${tab}…`}
              />
            </div>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Showing {filtered.length} of {data.length}
            </span>
          </div>

          {filtered.length > 0 ? (
            <Table cols={cols} rows={filtered} />
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: 48,
                color: "var(--text-muted)",
                fontSize: 14,
              }}
            >
              No matches for “{q}”.
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!loading && data.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            color: "var(--text-muted)",
            fontSize: 14,
          }}
        >
          {ran ? (
            "No results for the selected filters."
          ) : (
            <>
              Select filters and click{" "}
              <strong style={{ color: "var(--text)" }}>Run Report</strong> to
              see results.
            </>
          )}
        </div>
      )}
    </Layout>
  );
}
