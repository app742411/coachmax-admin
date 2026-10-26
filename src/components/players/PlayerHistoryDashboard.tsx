import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { Activity, CalendarDays, CheckCircle2, Clock3, ExternalLink, FileText, Users } from "lucide-react";
import { useTerms } from "../../hooks/useTerms";
import { findCurrentTerm } from "../../hooks/useCurrentTerm";
import { formatDateOnly, formatDateTime, toDateOnly, APP_TIME_ZONE } from "../../utils/dateTime";
import { useCoachNotes } from "../../hooks/usePlayers";

type AnyRecord = Record<string, any>;
const EMPTY_RECORDS: AnyRecord[] = [];

const dateLabel = (value?: string | Date | null) => {
  if (!value) return "—";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return formatDateOnly(value) || "—";
  return formatDateTime(value, { day: "numeric", month: "short", year: "numeric" }, APP_TIME_ZONE) || "—";
};

const dateOnlyInAppZone = (value: string | Date) => toDateOnly(value);
const yearMonthInAppZone = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIME_ZONE, year: "numeric", month: "2-digit" }).formatToParts(date);
  return `${parts.find((part) => part.type === "year")?.value}-${parts.find((part) => part.type === "month")?.value}`;
};

const money = (value?: number) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 2 }).format(Number(value) || 0);

const typeLabel: Record<string, string> = {
  CLASS: "Class", TEAM: "Team", LEAGUE: "League", HOLIDAY_PROGRAM: "Holiday program",
  EVENT: "Event", STORE_ORDER: "Store purchase", INVOICE: "Invoice",
};

const statusClass = (status = "") => {
  const value = status.toUpperCase();
  if (["PAID", "APPROVED", "ACTIVE"].includes(value)) return "bg-emerald-50 text-emerald-700";
  if (["PENDING", "PAYMENT_PENDING", "UNPAID", "OVER_DUE", "REJECTED"].includes(value)) return "bg-amber-50 text-amber-800";
  if (value === "HANDSHAKE") return "bg-cyan-50 text-cyan-800";
  return "bg-gray-100 text-gray-700";
};

export default function PlayerHistoryDashboard({ data, player }: { data: AnyRecord; player: AnyRecord }) {
  const navigate = useNavigate();
  const { terms } = useTerms({ isEvent: "all" });
  const [range, setRange] = useState("CURRENT");
  const [attendanceType, setAttendanceType] = useState("ALL");
  const [paymentType, setPaymentType] = useState("ALL");
  const [classId, setClassId] = useState("ALL");
  const [notesPage, setNotesPage] = useState(1);
  const [historyTab, setHistoryTab] = useState<"attendance" | "payments" | "leagues" | "notes">("attendance");

  const currentTerm = useMemo(() => findCurrentTerm(terms, { isEvent: undefined }), [terms]);
  const allTerms = data.availableTerms?.length ? data.availableTerms : terms;
  const termById = useMemo(() => new Map<string, AnyRecord>(allTerms.map((term: AnyRecord) => [String(term._id), term])), [allTerms]);
  const years: string[] = useMemo(() => [...new Set<string>(allTerms.map((term: AnyRecord) => String(term.year || "")).filter(Boolean))].sort((a, b) => Number(b) - Number(a)), [allTerms]);
  const noteScope = useMemo(() => {
    if (range === "NO_TERM") return { noTerm: true };
    if (range === "CURRENT") return { termId: currentTerm?._id || "__no_current_term__" };
    if (range.startsWith("TERM:")) return { termId: range.slice(5) };
    if (range.startsWith("YEAR:")) return { year: range.slice(5) };
    return undefined;
  }, [range, currentTerm]);
  const { data: notesResponse, isLoading: notesLoading } = useCoachNotes(String(player._id), notesPage, 10, noteScope);
  const notes: AnyRecord[] = notesResponse?.data || [];

  const inRange = useCallback((item: AnyRecord) => {
    if (range === "ALL") return true;
    const termId = String(item.termId || item.term?._id || item.event?.termId?._id || "");
    const term = termById.get(termId);
    if (range === "NO_TERM") return !termId;
    if (range === "CURRENT") return currentTerm ? termId === currentTerm._id : false;
    if (range.startsWith("TERM:")) return termId === range.slice(5);
    if (range.startsWith("YEAR:")) return String(item.year || term?.year || "") === range.slice(5);
    return false;
  }, [range, currentTerm, termById]);

  const allAttendance: AnyRecord[] = data.perDayAttendance || EMPTY_RECORDS;
  const attendance = useMemo(() => allAttendance.filter((item) =>
    inRange(item) && (attendanceType === "ALL" || item.contextType === attendanceType) &&
    (classId === "ALL" || String(item.class?._id || item.contextId || "") === classId)
  ), [allAttendance, attendanceType, classId, inRange]);
  const markedAttendance = attendance.filter((item) => ["PRESENT", "ABSENT", "LATE"].includes(String(item.status).toUpperCase()));
  const present = markedAttendance.filter((item) => item.status === "PRESENT").length;
  const late = markedAttendance.filter((item) => item.status === "LATE").length;
  const absent = markedAttendance.filter((item) => item.status === "ABSENT").length;
  const attendanceRate = markedAttendance.length ? Math.round(((present + late) / markedAttendance.length) * 100) : 0;

  const chartRows = useMemo(() => {
    const byDate = new Map<string, { present: number; late: number; absent: number }>();
    const aggregateByMonth = range === "ALL" || range.startsWith("YEAR:");
    markedAttendance.forEach((item) => {
      const dateOnly = dateOnlyInAppZone(item.sessionDate);
      if (!dateOnly) return;
      const key = aggregateByMonth ? dateOnly.slice(0, 7) : dateOnly;
      if (!byDate.has(key)) byDate.set(key, { present: 0, late: 0, absent: 0 });
      const bucket = byDate.get(key)!;
      const status = String(item.status).toLowerCase() as "present" | "late" | "absent";
      if (status in bucket) bucket[status] += 1;
    });
    return [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, counts]) => ({
      label: aggregateByMonth
        ? new Date(`${key}-01T12:00:00Z`).toLocaleDateString("en-AU", { month: "short", year: "2-digit", timeZone: "UTC" })
        : new Date(`${key}T12:00:00Z`).toLocaleDateString("en-AU", { day: "numeric", month: "short", timeZone: "UTC" }),
      ...counts,
    }));
  }, [markedAttendance, range]);

  const paymentHistory: AnyRecord[] = data.paymentFinancialSummary?.history || EMPTY_RECORDS;
  const payments = useMemo(() => paymentHistory.filter((item) => inRange(item) && (paymentType === "ALL" || item.type === paymentType)), [paymentHistory, paymentType, inRange]);
  const paymentTotals = payments.reduce((sum, item) => ({
    received: sum.received + (Number(item.amountReceived) || 0),
    pending: sum.pending + (Number(item.amountPending) || 0),
    awaiting: sum.awaiting + (Number(item.amountAwaitingApproval) || 0),
    discount: sum.discount + (Number(item.discount) || 0),
  }), { received: 0, pending: 0, awaiting: 0, discount: 0 });
  const paymentChartRows = useMemo(() => {
    const buckets = new Map<string, { received: number; pending: number }>();
    payments.forEach((item) => {
      const key = yearMonthInAppZone(item.createdAt || item.dueDate || "");
      if (!key) return;
      if (!buckets.has(key)) buckets.set(key, { received: 0, pending: 0 });
      const bucket = buckets.get(key)!;
      bucket.received += Number(item.amountReceived) || 0;
      bucket.pending += Number(item.amountPending) || 0;
    });
    return [...buckets.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => ({
      label: new Date(`${key}-01T12:00:00Z`).toLocaleDateString("en-AU", { month: "short", year: "2-digit", timeZone: "UTC" }),
      ...value,
    }));
  }, [payments]);

  const leagueStatsByContext = new Map<string, AnyRecord>();
  (data.assignedLeagueInfo || []).forEach((item: AnyRecord) => {
    const key = `${item.leagueId}:${item.teamId}`;
    leagueStatsByContext.set(key, { ...item, id: key, statistics: item.statistics || {} });
  });
  (data.leagueStatistics || []).forEach((item: AnyRecord) => {
    const key = `${item.leagueId}:${item.teamId}`;
    const existing = leagueStatsByContext.get(key);
    leagueStatsByContext.set(key, { ...existing, ...item, id: item.id || key, statistics: { ...(existing?.statistics || {}), ...(item.statistics || {}) } });
  });
  const leagueStatistics: AnyRecord[] = [...leagueStatsByContext.values()].filter((item) => inRange(item));
  const classesById = new Map<string, AnyRecord>();
  (data.assignedClassesPaymentInfo || []).forEach((item: AnyRecord) => classesById.set(String(item.classId), item));
  (data.perDayAttendance || []).filter((item: AnyRecord) => item.contextType === "CLASS").forEach((item: AnyRecord) => {
    const id = String(item.contextId || item.class?._id || "");
    if (id && !classesById.has(id)) classesById.set(id, { classId: id, className: item.contextName || item.className || "Class" });
  });
  const classes = [...classesById.values()];
  const filteredNotes = notes;

  const goToContext = (item: AnyRecord) => {
    if (item.classId) return navigate("/programs-2", { state: { classId: item.classId } });
    if (item.teamId) return navigate(`/teams/${item.teamId}`);
    if (item.leagueId) return navigate(`/leagues/${item.leagueId}`);
    if (item.eventId) return navigate(`/event-details/${item.eventId}`);
    if (item.invoiceId) return navigate(`/invoices/${item.invoiceId}`);
    if (item.orderId) return navigate(`/orders/${item.orderId}`);
  };

  const options: ApexOptions = {
    chart: { type: "area", toolbar: { show: false }, fontFamily: "Outfit, sans-serif", zoom: { enabled: false } },
    colors: ["#10b981", "#f59e0b", "#f43f5e"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.22, opacityTo: 0.02 } },
    markers: { size: 3, hover: { size: 5 } },
    xaxis: { categories: chartRows.map((row) => row.label), labels: { rotate: -25, hideOverlappingLabels: true }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { min: 0, forceNiceScale: true, labels: { formatter: (value) => Math.round(value).toString() } },
    legend: { position: "top", horizontalAlign: "right" },
    grid: { borderColor: "#eef2f7", strokeDashArray: 4 },
    tooltip: { shared: true, intersect: false },
    noData: { text: "No attendance recorded for this filter" },
  };

  const FilterSelect = ({ value, onChange, children, label }: any) => (
    <label className="flex flex-col gap-1 text-[11px] font-semibold text-gray-500">
      {label}<select value={value} onChange={(event) => onChange(event.target.value)} className="min-w-40 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500">{children}</select>
    </label>
  );

  return (
    <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-widest text-blue-700">Player history</p><h2 className="mt-1 text-xl font-bold text-gray-900">Attendance, competition, and payments</h2><p className="mt-1 text-sm text-gray-500">History follows the selected term. Rating and preferred foot remain global profile details.</p></div>
        <div className="flex flex-wrap gap-3">
          <FilterSelect label="Term / year" value={range} onChange={(value: string) => { setRange(value); setNotesPage(1); }}>
            <option value="CURRENT">Current term{currentTerm ? ` · ${currentTerm.name}` : ""}</option>
            {years.map((year) => <option key={year} value={`YEAR:${year}`}>{year} · all terms</option>)}
            {allTerms.map((term: AnyRecord) => <option key={term._id} value={`TERM:${term._id}`}>{term.name}{term.year ? ` ${term.year}` : ""}{term.isEvent ? " · Holiday" : ""}</option>)}
            <option value="NO_TERM">No term linked</option><option value="ALL">All history</option>
          </FilterSelect>
          {historyTab === "attendance" && <FilterSelect label="Activity" value={attendanceType} onChange={setAttendanceType}><option value="ALL">All activity</option><option value="CLASS">Classes</option><option value="TEAM">Teams</option><option value="LEAGUE">Leagues</option><option value="HOLIDAY_PROGRAM">Holiday programs</option><option value="EVENT">Events</option></FilterSelect>}
          {historyTab === "attendance" && classes.length > 0 && <FilterSelect label="Class" value={classId} onChange={setClassId}><option value="ALL">All classes</option>{classes.map((item) => <option key={item.classId} value={item.classId}>{item.className}</option>)}</FilterSelect>}
          {historyTab === "payments" && <FilterSelect label="Payment type" value={paymentType} onChange={setPaymentType}><option value="ALL">All payments</option>{Object.entries(typeLabel).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</FilterSelect>}
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto border-b border-gray-100 pb-2">
        {([ ["attendance", "Attendance"], ["payments", "Payments & purchases"], ["leagues", "League stats"], ["notes", "Notes"] ] as const).map(([key, label]) => <button key={key} onClick={() => setHistoryTab(key)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold ${historyTab === key ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>{label}</button>)}
      </div>

      {historyTab === "attendance" && <>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Marked sessions", markedAttendance.length, CalendarDays, "text-gray-900"],
            ["Present", present, CheckCircle2, "text-emerald-700"],
            ["Late", late, Clock3, "text-amber-700"],
            ["Attendance rate", `${attendanceRate}%`, Activity, "text-blue-700"],
          ].map(([label, value, Icon, color]: any) => <div key={label} className="rounded-xl border border-gray-100 bg-gray-50/80 p-4"><div className="flex items-center justify-between text-xs font-semibold text-gray-500">{label}<Icon size={16} className="text-blue-500" /></div><div className={`mt-2 text-2xl font-bold ${color}`}>{value}</div></div>)}
        </div>
        <div className="rounded-xl border border-gray-100 p-4">
          <div className="mb-2"><h3 className="font-bold text-gray-900">Attendance over time</h3><p className="text-xs text-gray-500">Present, late, and absent sessions for the selected scope</p></div>
          {chartRows.length ? <Chart options={options} series={[{ name: "Present", data: chartRows.map((row) => row.present) }, { name: "Late", data: chartRows.map((row) => row.late) }, { name: "Absent", data: chartRows.map((row) => row.absent) }]} type="area" height={280} /> : <div className="grid h-56 place-items-center text-sm text-gray-400">No marked attendance for this filter.</div>}
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3"><div><h3 className="font-bold text-gray-900">Attendance records</h3><p className="text-xs text-gray-500">{markedAttendance.length} marked session(s)</p></div><span className="text-xs text-gray-500">{absent} absent</span></div>
          <div className="max-h-[420px] overflow-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="sticky top-0 bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Class / activity</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Attendance</th><th className="px-4 py-3">Open</th></tr></thead><tbody className="divide-y divide-gray-100">{attendance.map((item) => <tr key={item.attendanceId} className="hover:bg-gray-50"><td className="px-4 py-3">{dateLabel(item.sessionDate)}</td><td className="px-4 py-3 font-semibold text-gray-800">{item.contextName || item.className || "Session"}<span className="block text-xs font-normal text-gray-400">{item.termName || "No term linked"}</span></td><td className="px-4 py-3 text-gray-600">{typeLabel[item.contextType] || item.contextType || "Class"}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(item.status)}`}>{String(item.status || "NOT_MARKED").replace(/_/g, " ")}</span></td><td className="px-4 py-3">{(item.contextId || item.class?._id) && <button onClick={() => goToContext({ classId: item.contextType === "CLASS" ? item.contextId : null, teamId: item.contextType === "TEAM" ? item.contextId : null, leagueId: item.contextType === "LEAGUE" ? item.contextId : null, eventId: ["EVENT", "HOLIDAY_PROGRAM"].includes(item.contextType) ? item.contextId : null })} className="inline-flex items-center gap-1 text-xs font-bold text-blue-700">Open <ExternalLink size={12} /></button>}</td></tr>)}{attendance.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No attendance records in this scope.</td></tr>}</tbody></table></div>
        </div>
      </>}

      {historyTab === "payments" && <>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[["Received", paymentTotals.received, "text-emerald-700"], ["Outstanding", paymentTotals.pending, "text-rose-700"], ["Awaiting approval", paymentTotals.awaiting, "text-amber-700"], ["Discounts", paymentTotals.discount, "text-blue-700"]].map(([label, value, color]: any) => <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 p-4"><p className="text-xs font-semibold text-gray-500">{label}</p><p className={`mt-1 text-xl font-bold ${color}`}>{money(value)}</p></div>)}
        </div>
        <div className="rounded-xl border border-gray-100 p-4">
          <div className="mb-2"><h3 className="font-bold text-gray-900">Payment history by month</h3><p className="text-xs text-gray-500">Recorded receipts and remaining amounts for the selected scope</p></div>
          {paymentChartRows.length ? <Chart options={{ ...options, chart: { ...options.chart, type: "bar" }, colors: ["#10b981", "#fb7185"], plotOptions: { bar: { columnWidth: "48%", borderRadius: 4, borderRadiusApplication: "end" } }, yaxis: { labels: { formatter: (value) => `$${Math.round(value)}` } }, tooltip: { y: { formatter: (value) => money(value) } } }} series={[{ name: "Received", data: paymentChartRows.map((row) => row.received) }, { name: "Outstanding", data: paymentChartRows.map((row) => row.pending) }]} type="bar" height={250} /> : <div className="grid h-48 place-items-center text-sm text-gray-400">No invoice or purchase dates for this filter.</div>}
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <div className="border-b border-gray-100 px-4 py-3"><h3 className="font-bold text-gray-900">Payment and purchase ledger</h3><p className="text-xs text-gray-500">Family store purchases are labeled household when the order is not assigned to one child.</p></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-4 py-3">Date / invoice</th><th className="px-4 py-3">Item</th><th className="px-4 py-3">Term</th><th className="px-4 py-3">Discount</th><th className="px-4 py-3">Received</th><th className="px-4 py-3">Outstanding</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Details</th></tr></thead><tbody className="divide-y divide-gray-100">{payments.map((item) => <tr key={item.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-xs text-gray-600">{dateLabel(item.createdAt || item.dueDate)}{item.invoiceNumber && <span className="mt-1 block font-semibold text-blue-700">{item.invoiceNumber}</span>}</td><td className="px-4 py-3"><span className="font-semibold text-gray-900">{item.name}</span><span className="block text-xs text-gray-500">{typeLabel[item.type] || item.type}{item.householdPurchase ? " · Family purchase" : ""}</span>{item.products?.length > 0 && <span className="block max-w-xs truncate text-xs text-gray-400">{item.products.map((product: AnyRecord) => `${product.name} ×${product.quantity}`).join(", ")}</span>}</td><td className="px-4 py-3 text-gray-600">{item.termName || "No term linked"}</td><td className="px-4 py-3 text-blue-700">{money(item.discount)}</td><td className="px-4 py-3 font-semibold text-emerald-700">{money(item.amountReceived)}</td><td className="px-4 py-3 font-semibold text-rose-700">{money(item.amountPending)}{item.amountAwaitingApproval > 0 && <span className="block text-[10px] font-normal text-amber-700">{money(item.amountAwaitingApproval)} awaiting approval</span>}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClass(item.paymentStatus)}`}>{String(item.paymentStatus || "UNKNOWN").replace(/_/g, " ")}</span></td><td className="px-4 py-3">{(item.invoiceId || item.orderId || item.classId || item.teamId || item.leagueId || item.eventId) && <button onClick={() => goToContext(item)} className="inline-flex items-center gap-1 text-xs font-bold text-blue-700">Open <ExternalLink size={12} /></button>}</td></tr>)}{payments.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No payments or purchases for this filter.</td></tr>}</tbody></table></div>
        </div>
      </>}

      {historyTab === "leagues" && <div className="overflow-hidden rounded-xl border border-gray-100"><div className="border-b border-gray-100 px-4 py-3"><h3 className="font-bold text-gray-900">Player league statistics</h3><p className="text-xs text-gray-500">Individual statistics recorded against each league</p></div><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-4 py-3">League / team</th><th className="px-4 py-3">Term</th><th className="px-4 py-3">Appearances</th><th className="px-4 py-3">Goals</th><th className="px-4 py-3">Assists</th><th className="px-4 py-3">Clean sheets</th><th className="px-4 py-3">Cards</th><th className="px-4 py-3">Minutes</th></tr></thead><tbody className="divide-y divide-gray-100">{leagueStatistics.map((item) => <tr key={item.id} className="hover:bg-gray-50"><td className="px-4 py-3"><button onClick={() => navigate(`/leagues/${item.leagueId}`)} className="font-semibold text-blue-700 hover:underline">{item.leagueName}</button><span className="block text-xs text-gray-500">{item.teamName}</span></td><td className="px-4 py-3">{item.termName}{item.year ? ` ${item.year}` : ""}</td><td className="px-4 py-3">{item.statistics.appearances}</td><td className="px-4 py-3">{item.statistics.goals}</td><td className="px-4 py-3">{item.statistics.assists}</td><td className="px-4 py-3">{item.statistics.cleanSheets}</td><td className="px-4 py-3">🟨 {item.statistics.yellowCards} · 🟥 {item.statistics.redCards}</td><td className="px-4 py-3">{item.statistics.minutesPlayed}</td></tr>)}{leagueStatistics.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No individual league statistics recorded for this filter.</td></tr>}</tbody></table></div></div>}

      {historyTab === "notes" && <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-gray-100 p-5"><div className="flex items-center gap-2"><FileText size={17} className="text-blue-600" /><h3 className="font-bold text-gray-900">Admin note</h3></div><p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{player.adminNote || "No admin note on this player record."}</p></article>
        <article className="rounded-xl border border-gray-100 p-5"><div className="mb-3 flex items-center gap-2"><Users size={17} className="text-violet-600" /><h3 className="font-bold text-gray-900">Coach notes</h3></div><div className="max-h-[460px] space-y-3 overflow-auto">{notesLoading ? <p className="py-8 text-center text-sm text-gray-400">Loading notes…</p> : filteredNotes.map((note) => <div key={note._id} className="rounded-lg bg-gray-50 p-4"><div className="flex justify-between gap-3"><span className="text-xs font-bold uppercase text-violet-700">{String(note.noteType || "Note").replace(/_/g, " ")}</span><time className="text-xs text-gray-500">{dateLabel(note.createdAt)}</time></div><p className="mt-2 text-sm text-gray-800">{note.description}</p><p className="mt-2 text-xs text-gray-500">{note.classId?.name || "No class linked"} · {note.coach?.name || "Coach"}</p></div>)}{!notesLoading && filteredNotes.length === 0 && <p className="py-8 text-center text-sm text-gray-400">No coach notes in this scope.</p>}</div><div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500"><span>{notesResponse?.total || 0} note(s) · page {notesResponse?.page || 1} of {Math.max(1, notesResponse?.totalPages || 1)}</span><div className="flex gap-2"><button disabled={notesPage <= 1} onClick={() => setNotesPage((page) => Math.max(1, page - 1))} className="rounded-md border border-gray-200 px-3 py-1.5 disabled:opacity-40">Previous</button><button disabled={notesPage >= (notesResponse?.totalPages || 1)} onClick={() => setNotesPage((page) => page + 1)} className="rounded-md border border-gray-200 px-3 py-1.5 disabled:opacity-40">Next</button></div></div></article>
      </div>}
    </section>
  );
}
