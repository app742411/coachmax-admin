import React, { useState, useMemo } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { useCurrentTerm } from "../../hooks/useCurrentTerm";
import { useTermEarnings } from "../../hooks/useTermEarnings";
import {
  DollarSign,
  CheckCircle2,
  Clock,
  Calendar,
  Users,
  Search,
  RefreshCw,
  FileSpreadsheet,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  PAID: {
    label: "Paid",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800/60",
    dot: "bg-emerald-500",
  },
  COMPLETED: {
    label: "Paid",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800/60",
    dot: "bg-emerald-500",
  },
  PENDING: {
    label: "Pending",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800/60",
    dot: "bg-amber-500",
  },
  UNPAID: {
    label: "Unpaid",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800/60",
    dot: "bg-rose-500",
  },
  PARTIAL: {
    label: "Partial",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800/60",
    dot: "bg-blue-500",
  },
  OVERDUE: {
    label: "Overdue",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800/60",
    dot: "bg-rose-500",
  },
  REFUNDED: {
    label: "Refunded",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800/60",
    dot: "bg-purple-500",
  },
};

export default function TermEarningsPage() {
  const [selectedClassId, setSelectedClassId] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedClassIds, setExpandedClassIds] = useState<Record<string, boolean>>({});

  // Centralized Term & Year selection
  const {
    terms,
    isLoading: isTermsLoading,
    availableYears,
    selectedYear,
    setSelectedYear,
    selectedTerm: selectedTermId,
    setSelectedTerm: setSelectedTermId,
  } = useCurrentTerm();

  const yearOptions = useMemo(() => {
    return availableYears.map((y) => Number(y));
  }, [availableYears]);

  // 2. Fetch Term Earnings Data
  const {
    data: earningsResponse,
    isLoading: isEarningsLoading,
    isRefetching,
    refetch,
  } = useTermEarnings(selectedTermId, {
    classId: selectedClassId,
    status: selectedStatus,
  });

  const apiData = earningsResponse?.data || earningsResponse || {};
  const currentTermInfo = apiData?.term || null;
  const summary = apiData?.summary || {};
  const rawClasses: any[] = Array.isArray(apiData?.classes) ? apiData.classes : [];

  // Initialize expanded state so all classes start open by default
  React.useEffect(() => {
    if (rawClasses.length > 0) {
      const initial: Record<string, boolean> = {};
      rawClasses.forEach((cls: any) => {
        const id = cls.classId || cls._id;
        initial[id] = true;
      });
      setExpandedClassIds(initial);
    }
  }, [rawClasses.length]);

  const toggleClassExpand = (classId: string) => {
    setExpandedClassIds((prev) => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    rawClasses.forEach((cls: any) => {
      all[cls.classId || cls._id] = true;
    });
    setExpandedClassIds(all);
  };

  const collapseAll = () => {
    setExpandedClassIds({});
  };

  // Available classes for dropdown selector
  const availableClasses = useMemo(() => {
    return rawClasses.map((c: any) => ({
      id: c.classId || c._id || c.id,
      name: c.className || c.name || "Class",
      program: c.program || "",
      category: c.category || "",
    }));
  }, [rawClasses]);

  // Filter classes & nested players by search query and filters
  const filteredClasses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return rawClasses
      .filter((cls: any) => {
        if (selectedClassId !== "ALL" && (cls.classId || cls._id) !== selectedClassId) {
          return false;
        }
        return true;
      })
      .map((cls: any) => {
        let players = Array.isArray(cls.players) ? cls.players : [];

        // Filter by status if selected
        if (selectedStatus !== "ALL") {
          players = players.filter(
            (p: any) => (p.paymentStatus || "UNPAID").toUpperCase() === selectedStatus.toUpperCase()
          );
        }

        // Filter by search query
        if (q) {
          const classMatch =
            (cls.className || "").toLowerCase().includes(q) ||
            (cls.program || "").toLowerCase().includes(q) ||
            (cls.category || "").toLowerCase().includes(q) ||
            (cls.coach?.name || "").toLowerCase().includes(q);

          if (!classMatch) {
            players = players.filter((p: any) => {
              const name = (p.playerName || "").toLowerCase();
              const email = (p.playerEmail || "").toLowerCase();
              return name.includes(q) || email.includes(q);
            });
          }
        }

        return {
          ...cls,
          filteredPlayers: players,
        };
      })
      .filter((cls: any) => {
        if (!q && selectedStatus === "ALL") return true;
        return cls.filteredPlayers.length > 0;
      });
  }, [rawClasses, selectedClassId, selectedStatus, searchQuery]);

  // Format currency helper
  const formatCurrency = (val: number | undefined | null) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  // Summary Metrics
  const totalExpected = summary.totalExpected ?? 0;
  const totalPaid = summary.totalPaid ?? 0;
  const totalPending = summary.totalPending ?? summary.totalOutstanding ?? 0;
  const totalRefunded = summary.totalRefunded ?? 0;
  const totalClassesCount = summary.totalClasses ?? rawClasses.length;
  const totalPlayersCount = summary.totalPlayers ?? 0;
  const collectionRate = totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0;

  // CSV Export Handler
  const handleExportCSV = () => {
    const allExportPlayers: any[] = [];
    filteredClasses.forEach((cls: any) => {
      cls.filteredPlayers.forEach((p: any) => {
        allExportPlayers.push({
          ...p,
          className: cls.className,
          program: cls.program,
          category: cls.category,
          coachName: cls.coach?.name || "Unassigned",
        });
      });
    });

    if (allExportPlayers.length === 0) {
      toast.error("No player records to export.");
      return;
    }

    const headers = [
      "Player ID",
      "Player Name",
      "Player Email",
      "Class Name",
      "Program",
      "Category",
      "Coach",
      "Term",
      "Expected ($)",
      "Paid ($)",
      "Pending ($)",
      "Refunded ($)",
      "Payment Status",
    ];

    const termName = currentTermInfo?.name || "Term Report";

    const rows = allExportPlayers.map((p: any) => {
      return [
        `"${p.playerId || ""}"`,
        `"${p.playerName || ""}"`,
        `"${p.playerEmail || ""}"`,
        `"${p.className || ""}"`,
        `"${p.program || ""}"`,
        `"${p.category || ""}"`,
        `"${p.coachName || ""}"`,
        `"${termName}"`,
        (p.expectedAmount || 0).toFixed(2),
        (p.paidAmount || 0).toFixed(2),
        (p.pendingAmount || 0).toFixed(2),
        (p.refundedAmount || 0).toFixed(2),
        `"${p.paymentStatus || "UNPAID"}"`,
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Term_Earnings_${termName.replace(/\s+/g, "_")}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Earnings report exported successfully!");
  };

  const activeTermDisplay =
    currentTermInfo?.name ||
    terms.find((t: any) => (t._id || t.id) === selectedTermId)?.name ||
    "Academic Term";

  return (
    <>
      <PageMeta
        title={`CoachMax | Finance - ${activeTermDisplay}`}
        description="Term earnings report, classes revenue, and student payment rosters"
      />

      <div className="space-y-6">
        {/* TOP BAR / BREADCRUMB */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <PageBreadcrumb pageTitle="Term Earnings Report" items={[{ name: "Finance", path: "/invoices" }]} />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Finance & Term Earnings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Financial breakdown per class session with nested student payment rosters.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => refetch()}
              disabled={isEarningsLoading || isRefetching}
              className="px-3.5 py-2 text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin text-[#0047FF]" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-xs font-bold bg-[#0047FF] hover:bg-blue-700 text-white rounded-none transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* HERO EXECUTIVE CARD & TERM SELECTOR */}
        <div className="bg-[#0A1930] text-white p-6 lg:p-8 rounded-none border-l-4 border-[#0047FF] shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-5 pointer-events-none">
            <DollarSign className="w-80 h-80 text-white" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-600/30 text-blue-300 border border-blue-400/30">
                  Academic Term Finance Report
                </span>
                <span className="text-xs font-semibold text-gray-400">
                  {totalClassesCount} Classes • {totalPlayersCount} Students
                </span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
                {activeTermDisplay}
              </h2>
              <p className="text-xs text-gray-300 mt-1 max-w-xl">
                Class-by-class financial breakdown showing expected, collected, and pending player fees.
              </p>
            </div>

            {/* Year & Term Selection Controls */}
            <div className="flex items-center gap-3 flex-wrap shrink-0">
              {/* Year Selector */}
              <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-none backdrop-blur-xs border border-white/15">
                <Calendar className="w-5 h-5 text-blue-400 shrink-0" />
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-300">
                    Select Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => {
                      setSelectedYear(e.target.value);
                      setSelectedClassId("ALL");
                    }}
                    className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer pr-4 py-0.5 border-b border-white/20 focus:border-blue-400"
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y} className="text-gray-900">
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Term Selection Control */}
              <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-none backdrop-blur-xs border border-white/15">
                <Calendar className="w-5 h-5 text-blue-400 shrink-0" />
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-300">
                    Select Academic Term
                  </label>
                  <select
                    value={selectedTermId}
                    onChange={(e) => {
                      setSelectedTermId(e.target.value);
                      setSelectedClassId("ALL");
                    }}
                    disabled={isTermsLoading}
                    className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer pr-4 py-0.5 border-b border-white/20 focus:border-blue-400 min-w-[150px]"
                  >
                    {isTermsLoading ? (
                      <option value="" className="text-gray-900">Loading terms...</option>
                    ) : terms.length === 0 ? (
                      <option value="" className="text-gray-900">No terms in {selectedYear}</option>
                    ) : (
                      terms.map((t: any) => (
                        <option key={t._id || t.id} value={t._id || t.id} className="text-gray-900">
                          {t.name} {t.year ? `(${t.year})` : ""}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 SUMMARY STATS KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Expected */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Expected
              </span>
              <div className="w-8 h-8 rounded-none bg-blue-50 dark:bg-blue-950/40 text-[#0047FF] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {formatCurrency(totalExpected)}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Gross Invoiced for {totalPlayersCount} Players
              </p>
            </div>
          </div>

          {/* Total Paid */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Total Paid
              </span>
              <div className="w-8 h-8 rounded-none bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                {formatCurrency(totalPaid)}
              </h3>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <span>Collection Rate</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {collectionRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Total Pending */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Total Pending
              </span>
              <div className="w-8 h-8 rounded-none bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
                {formatCurrency(totalPending)}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {totalRefunded > 0 ? `Refunded: ${formatCurrency(totalRefunded)}` : "Outstanding Balance"}
              </p>
            </div>
          </div>

          {/* Classes & Enrollment Breakdown */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Class Enrollments
              </span>
              <div className="w-8 h-8 rounded-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {totalClassesCount} <span className="text-sm font-semibold text-slate-400">Classes</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {totalPlayersCount} Registered Student Enrollments
              </p>
            </div>
          </div>
        </div>

        {/* TOOLBAR CONTROLS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap flex-1">
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search player, email, class, coach..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Class Filter Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
                  Filter Class:
                </span>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none font-bold text-slate-700 dark:text-slate-200 focus:border-[#0047FF] outline-none"
                >
                  <option value="ALL">All Classes ({availableClasses.length})</option>
                  {availableClasses.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.program ? `• ${c.program}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Status Filter Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
                  Status:
                </span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none font-bold text-slate-700 dark:text-slate-200 focus:border-[#0047FF] outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="UNPAID">Unpaid</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
            </div>

            {/* Expand / Collapse All Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={expandAll}
                className="px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>

        {/* MAIN VIEW: CLASSES FIRST, WITH PLAYERS DIRECTLY INSIDE */}
        {isEarningsLoading ? (
          <div className="py-24 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-3 border-[#0047FF] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 animate-pulse">
              Computing Term Earnings Report...
            </p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                No Classes or Earnings Found
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? `No classes or players matching "${searchQuery}". Try clearing the search.`
                  : "No class earnings records found for this term."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredClasses.map((cls: any, classIndex: number) => {
              const classId = cls.classId || cls._id || `cls-${classIndex}`;
              const isExpanded = expandedClassIds[classId] ?? true;
              const classPlayers = cls.filteredPlayers || [];
              const clsRate =
                cls.expectedAmount > 0 ? Math.round((cls.paidAmount / cls.expectedAmount) * 100) : 0;

              return (
                <div
                  key={classId}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden"
                >
                  {/* CLASS HEADER BAR */}
                  <div
                    onClick={() => toggleClassExpand(classId)}
                    className="p-5 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 cursor-pointer border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors"
                  >
                    {/* Class Info */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-10 h-10 bg-[#0047FF] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                        {classIndex + 1}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                            {cls.className}
                          </h3>
                          {cls.program && (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-50 text-[#0047FF] dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
                              {cls.program}
                            </span>
                          )}
                          {cls.category && (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-slate-200/80 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                              {cls.category}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                          {cls.coach?.name && (
                            <span className="flex items-center gap-1 font-medium">
                              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                              Coach: <strong className="text-slate-700 dark:text-slate-200">{cls.coach.name}</strong>
                            </span>
                          )}
                          <span>
                            Price: <strong className="text-slate-700 dark:text-slate-200">{formatCurrency(cls.price)}</strong>
                          </span>
                          <span>
                            Students: <strong className="text-slate-700 dark:text-slate-200">{cls.totalPlayers ?? classPlayers.length}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Class Financial Counters & Progress */}
                    <div className="flex items-center gap-4 sm:gap-6 flex-wrap shrink-0">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Expected
                        </span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {formatCurrency(cls.expectedAmount)}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                          Paid
                        </span>
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(cls.paidAmount)}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                          Pending
                        </span>
                        <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                          {formatCurrency(cls.pendingAmount ?? cls.outstandingAmount)}
                        </span>
                      </div>

                      {/* Mini Progress */}
                      <div className="w-24 hidden sm:block">
                        <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                          <span className="text-slate-500">Collected</span>
                          <span className={clsRate >= 80 ? "text-emerald-600" : "text-amber-600"}>{clsRate}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              clsRate >= 80 ? "bg-emerald-500" : clsRate >= 50 ? "bg-[#0047FF]" : "bg-amber-500"
                            }`}
                            style={{ width: `${Math.min(clsRate, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Expand / Collapse Chevron Button */}
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#0047FF] pl-2 border-l border-slate-200 dark:border-slate-700">
                        <span>{classPlayers.length} Players</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* NESTED PLAYERS TABLE INSIDE CLASS */}
                  {isExpanded && (
                    <div className="p-0 overflow-x-auto">
                      {classPlayers.length === 0 ? (
                        <div className="py-8 text-center text-xs font-semibold text-slate-400 bg-white dark:bg-slate-900">
                          No players enrolled in this class matching the selected filter.
                        </div>
                      ) : (
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#031549] text-white text-[10px] font-bold uppercase tracking-wider">
                              <th className="py-3 px-3 w-[45px] text-center text-slate-400">#</th>
                              <th className="py-3 px-4 min-w-[220px]">Player Name & Email</th>
                              <th className="py-3 px-4 min-w-[130px]">Expected Amount</th>
                              <th className="py-3 px-4 min-w-[130px]">Paid Amount</th>
                              <th className="py-3 px-4 min-w-[130px]">Pending Amount</th>
                              {cls.refundedAmount > 0 && (
                                <th className="py-3 px-4 min-w-[110px]">Refunded</th>
                              )}
                              <th className="py-3 px-4 min-w-[110px] text-center">Payment Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {classPlayers.map((player: any, pIdx: number) => {
                              const sKey = (player.paymentStatus || "UNPAID").toUpperCase();
                              const sBadge = STATUS_CONFIG[sKey] || STATUS_CONFIG.UNPAID;

                              const avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                player.playerName || "Player"
                              )}&background=0A1930&color=fff`;

                              return (
                                <tr
                                  key={player.playerId || pIdx}
                                  className="border-b border-slate-100 last:border-0 dark:border-slate-800/40 bg-white dark:bg-slate-900 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                                >
                                  <td className="py-3 px-3 text-center font-bold text-slate-400">
                                    {pIdx + 1}
                                  </td>

                                  {/* Player Name & Contact */}
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={avatarSrc}
                                        alt={player.playerName}
                                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                      />
                                      <div className="min-w-0">
                                        <span className="font-bold text-slate-900 dark:text-white block truncate">
                                          {player.playerName}
                                        </span>
                                        <span className="text-[10px] text-slate-400 block truncate">
                                          {player.playerEmail || "No email"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Expected Amount */}
                                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(player.expectedAmount)}
                                  </td>

                                  {/* Paid Amount */}
                                  <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(player.paidAmount)}
                                  </td>

                                  {/* Pending Amount */}
                                  <td className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400">
                                    {formatCurrency(player.pendingAmount)}
                                  </td>

                                  {/* Refunded Amount (if applicable) */}
                                  {cls.refundedAmount > 0 && (
                                    <td className="py-3 px-4 font-semibold text-purple-600 dark:text-purple-400">
                                      {formatCurrency(player.refundedAmount)}
                                    </td>
                                  )}

                                  {/* Payment Status Badge */}
                                  <td className="py-3 px-4 text-center">
                                    <span
                                      className={`px-2.5 py-0.5 text-[10px] font-bold uppercase border inline-flex items-center gap-1.5 ${sBadge.bg} ${sBadge.text} ${sBadge.border}`}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full ${sBadge.dot}`} />
                                      {sBadge.label}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
