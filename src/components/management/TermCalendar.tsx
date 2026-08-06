import React, { useMemo, useState } from "react";

interface Term {
  _id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  status: string;
  isEvent?: boolean;
}

interface TermCalendarProps {
  terms: Term[];
  selectedYear: number;
}

// ── Deterministic color generator ────────────────────────────────────────────
// Seeds a hue from the term's _id so every term always gets the same
// distinct color, regardless of how many terms exist.
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

// Spreads hues using the golden-ratio increment (137.508°) to maximise
// visual distance between consecutive terms.
const GOLDEN_ANGLE = 137.508;

function getTermColor(id: string, index: number) {
  // Use index * golden-angle for base hue, fine-tuned by id hash
  const idOffset = (hashString(id) % 30) - 15; // ±15° jitter per unique id
  const hue = ((index * GOLDEN_ANGLE) + idOffset + 360) % 360;
  const sat = 65 + (hashString(id + "s") % 20); // 65–85%
  const lum = 42 + (hashString(id + "l") % 10); // 42–52% (dark enough for bg)

  const bg = `hsl(${hue}, ${sat}%, ${lum}%)`;
  const light = `hsl(${hue}, ${sat - 10}%, 93%)`;
  const text = `hsl(${hue}, ${sat}%, ${lum - 12}%)`;
  const border = `hsl(${hue}, ${sat - 15}%, 75%)`;

  return { bg, light, text, border };
}

const MONTH_NAMES = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseLocalDate(dateStr: string, isEnd = false): Date {
  if (!dateStr) return new Date();
  const dateOnly = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const parts = dateOnly.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed
    const day = parseInt(parts[2], 10);
    if (isEnd) {
      return new Date(year, month, day, 23, 59, 59, 999);
    }
    return new Date(year, month, day, 0, 0, 0, 0);
  }
  const date = new Date(dateStr);
  if (isEnd) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return date;
}

const TermCalendar: React.FC<TermCalendarProps> = ({ terms, selectedYear }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Build date → array of term indices
  const dateMap = useMemo(() => {
    const map: Record<string, number[]> = {};
    terms.forEach((term, idx) => {
      const start = parseLocalDate(term.startDate, false);
      const end = parseLocalDate(term.endDate, true);
      const cur = new Date(start);
      while (cur <= end) {
        const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
        if (!map[key]) map[key] = [];
        map[key].push(idx);
        cur.setDate(cur.getDate() + 1);
      }
    });
    return map;
  }, [terms]);

  const todayKey = toKey(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  return (
    <div className="flex flex-col gap-4">

      {/* ── Legend ── */}
      {terms.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1 pb-1">
          {terms.map((term, idx) => {
            const c = getTermColor(term._id, idx);
            const active = hoveredId === term._id;
            return (
              <div
                key={term._id}
                onMouseEnter={() => setHoveredId(term._id)}
                onMouseLeave={() => setHoveredId(null)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-none border text-[11px] font-bold cursor-default transition-all duration-150 select-none"
                style={{
                  backgroundColor: active ? c.bg : c.light,
                  borderColor: c.border,
                  color: active ? "#fff" : c.text,
                }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: active ? "#fff" : c.bg }} />
                {term.name}
                {term.isEvent && (
                  <span className="ml-1 text-[8px] uppercase tracking-wider opacity-70">
                    Holiday
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── 12-Month Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {MONTH_NAMES.map((monthName, monthIdx) => {
          const daysInMonth = new Date(selectedYear, monthIdx + 1, 0).getDate();
          const firstDay = new Date(selectedYear, monthIdx, 1).getDay();

          const cells: React.ReactNode[] = [];

          // Empty padding cells
          for (let i = 0; i < firstDay; i++) {
            cells.push(<div key={`e${i}`} className="h-7" />);
          }

          // Day cells
          for (let d = 1; d <= daysInMonth; d++) {
            const key = toKey(selectedYear, monthIdx, d);
            const indices = dateMap[key] || [];
            const isToday = key === todayKey;
            const primaryIdx = indices[0];
            const primaryTerm = primaryIdx !== undefined ? terms[primaryIdx] : null;
            const c = primaryTerm ? getTermColor(primaryTerm._id, primaryIdx) : null;
            const termId = primaryTerm?._id ?? null;
            const isHovered = termId !== null && hoveredId === termId;

            // Is this a start/end day of the term in this month?
            let isStart = false;
            let isEnd = false;
            if (c && primaryIdx !== undefined) {
              const prevKey = d > 1
                ? toKey(selectedYear, monthIdx, d - 1)
                : `${selectedYear}-${String(monthIdx).padStart(2, "0")}-99`;
              const nextKey = d < daysInMonth
                ? toKey(selectedYear, monthIdx, d + 1)
                : `${selectedYear}-${String(monthIdx + 2).padStart(2, "0")}-00`;
              isStart = !(dateMap[prevKey] || []).includes(primaryIdx) || d === 1;
              isEnd = !(dateMap[nextKey] || []).includes(primaryIdx) || d === daysInMonth;
            }

            cells.push(
              <div
                key={d}
                className="relative flex items-center justify-center h-7"
                onMouseEnter={() => termId && setHoveredId(termId)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Continuous stripe for mid-range days */}
                {c && !isStart && !isEnd && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: isHovered ? c.bg : c.light,
                      opacity: 0.9,
                    }}
                  />
                )}
                {/* Half-stripe leading from start circle */}
                {c && isStart && !isEnd && (
                  <div
                    className="absolute top-0 bottom-0"
                    style={{
                      left: "50%", right: 0,
                      backgroundColor: isHovered ? c.bg : c.light,
                      opacity: 0.9,
                    }}
                  />
                )}
                {/* Half-stripe ending at end circle */}
                {c && isEnd && !isStart && (
                  <div
                    className="absolute top-0 bottom-0"
                    style={{
                      left: 0, right: "50%",
                      backgroundColor: isHovered ? c.bg : c.light,
                      opacity: 0.9,
                    }}
                  />
                )}
                {/* Filled circle for start/end/single day */}
                {c && (isStart || isEnd) && (
                  <div
                    className="absolute w-7 h-7 rounded-full z-10"
                    style={{ backgroundColor: c.bg }}
                  />
                )}
                {/* Today ring (when not in a term) */}
                {isToday && !c && (
                  <div className="absolute w-7 h-7 rounded-full border-2 border-[#1d4ed8] z-10" />
                )}
                {/* Day number */}
                <span
                  className="relative z-20 text-[11px] font-semibold select-none leading-none"
                  style={{
                    color: c
                      ? (isStart || isEnd)
                        ? "#ffffff"
                        : isHovered ? c.bg : c.text
                      : isToday
                        ? "#1d4ed8"
                        : "#94a3b8",
                    fontWeight: (isStart || isEnd || isToday) ? 700 : 500,
                  }}
                >
                  {d}
                </span>
              </div>
            );
          }

          return (
            <div
              key={monthName}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-none p-3 shadow-sm"
            >
              {/* Month title */}
              <div className="text-[10px] font-black uppercase tracking-widest text-[#031549] dark:text-slate-300 mb-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                {monthName} <span className="text-slate-400 font-semibold">{selectedYear}</span>
              </div>
              {/* Day-of-week header */}
              <div className="grid grid-cols-7 mb-0.5">
                {DAY_LABELS.map((lbl, i) => (
                  <div key={i} className="flex items-center justify-center h-5">
                    <span className="text-[9px] font-bold uppercase text-slate-400">{lbl}</span>
                  </div>
                ))}
              </div>
              {/* Day cells */}
              <div className="grid grid-cols-7">{cells}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TermCalendar;
