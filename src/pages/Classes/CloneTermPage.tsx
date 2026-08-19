import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";

import apiClient from "../../api/apiClient";
import { getTermsUrl } from "../../api/adminApi";
import Select from "../../components/form/Select";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { successToast, errorToast } from "../../utils/toast";
import { Calendar, User, ArrowRight, CheckSquare, Square, ChevronDown, ChevronUp, ShieldCheck, BookOpen, Users, Info } from "lucide-react";

interface Player {
  _id: string;
  name: string;
  selected: boolean;
}

interface ClassPreview {
  classId: string;
  name: string;
  category: string;
  program: string;
  coach: string;
  playerCount: number;
  alreadyExists: boolean;
  players: Player[];
}

interface Term {
  _id: string;
  name: string;
  year: number;
}

export default function CloneTermPage() {
  const navigate = useNavigate();
  const [terms, setTerms] = useState<Term[]>([]);
  const [sourceTermId, setSourceTermId] = useState("");
  const [targetTermId, setTargetTermId] = useState("");
  const [sourceYear, setSourceYear] = useState<string>("");
  const [targetYear, setTargetYear] = useState<string>("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [submittingClone, setSubmittingClone] = useState(false);
  const [previewData, setPreviewData] = useState<ClassPreview[]>([]);
  const [step, setStep] = useState(1); // 1 = Select Terms, 2 = Preview & Select Items
  const [expandedClasses, setExpandedClasses] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"terms" | "holiday">("terms");
  const [responseSourceTerm, setResponseSourceTerm] = useState<{ _id: string; name: string } | null>(null);
  const [responseTargetTerm, setResponseTargetTerm] = useState<{ _id: string; name: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  // Selection states (keep track of selected classIds and mapping of classId -> selected playerIds)
  const [selectedClasses, setSelectedClasses] = useState<Record<string, boolean>>({});
  const [selectedPlayers, setSelectedPlayers] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const isEventParam = activeTab === "terms" ? "false" : "true";
        const response = await apiClient.get(getTermsUrl(), { params: { isEvent: isEventParam } });
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setTerms(response.data.data);
          // Reset previous term selections when switching tabs
          setSourceTermId("");
          setTargetTermId("");
          setSourceYear("");
          setTargetYear("");
        }
      } catch (error) {
        console.error("Failed to fetch terms:", error);
        errorToast("Failed to load terms.");
      }
    };
    fetchTerms();
  }, [activeTab]);

  const [allClasses, setAllClasses] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        const response = await apiClient.get("/api/admin/getAllClasses");
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setAllClasses(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    };
    fetchAllClasses();
  }, []);

  // Helper to dynamically calculate term stats from allClasses list
  const getTermStats = (termId: string) => {
    const termClasses = allClasses.filter((c) => {
      const classTermId = c.term?._id || c.term;
      return classTermId === termId;
    });

    const playersSet = new Set<string>();
    termClasses.forEach((c) => {
      if (Array.isArray(c.players)) {
        c.players.forEach((p: any) => {
          const pid = p._id || p;
          if (pid) playersSet.add(pid);
        });
      }
    });

    const coachesSet = new Set<string>();
    termClasses.forEach((c) => {
      const coachId = c.coach?._id || c.coach;
      if (coachId) coachesSet.add(coachId);
    });

    return {
      classes: termClasses.length,
      players: playersSet.size,
      coaches: coachesSet.size,
    };
  };

  const handlePreview = async () => {
    if (!sourceTermId) {
      errorToast("Please select a source term.");
      return;
    }
    if (!targetTermId) {
      errorToast("Please select a target term.");
      return;
    }
    if (sourceTermId === targetTermId) {
      errorToast("Source and target terms must be different.");
      return;
    }

    setLoadingPreview(true);
    try {
      const response = await apiClient.post("/api/admin/cloneTerm/preview", {
        sourceTermId,
        targetTermId,
      });

      if (response.data && response.data.success) {
        const classesList: ClassPreview[] = response.data.classes || [];
        setPreviewData(classesList);
        setResponseSourceTerm(response.data.sourceTerm || null);
        setResponseTargetTerm(response.data.targetTerm || null);

        // Initialize selections: select all classes and players by default
        const classesSel: Record<string, boolean> = {};
        const playersSel: Record<string, Record<string, boolean>> = {};

        classesList.forEach((cls) => {
          classesSel[cls.classId] = true;
          playersSel[cls.classId] = {};
          cls.players.forEach((p) => {
            playersSel[cls.classId][p._id] = true;
          });
        });

        setSelectedClasses(classesSel);
        setSelectedPlayers(playersSel);
        setStep(2);
      } else {
        errorToast(response.data?.message || "Failed to fetch preview information.");
      }
    } catch (error: any) {
      console.error("Preview error:", error);
      errorToast(error.response?.data?.message || "Error fetching preview data.");
    } finally {
      setLoadingPreview(false);
    }
  };

  // Toggle single class checkbox
  const handleToggleClass = (classId: string) => {
    const nextVal = !selectedClasses[classId];
    setSelectedClasses((prev) => ({ ...prev, [classId]: nextVal }));

    // Also toggle all players under this class
    const cls = previewData.find((c) => c.classId === classId);
    if (cls) {
      setSelectedPlayers((prev) => {
        const classPlayers = { ...prev[classId] };
        cls.players.forEach((p) => {
          classPlayers[p._id] = nextVal;
        });
        return { ...prev, [classId]: classPlayers };
      });
    }
  };

  // Toggle single player checkbox
  const handleTogglePlayer = (classId: string, playerId: string) => {
    setSelectedPlayers((prev) => {
      const classPlayers = { ...prev[classId] };
      const nextVal = !classPlayers[playerId];
      classPlayers[playerId] = nextVal;

      // If at least one player is selected, we should probably keep the class selected
      // If no players are selected (and class has players), we can optionally keep it or unselect it.
      // Here, let's auto-select the class if a player is selected
      if (nextVal) {
        setSelectedClasses((prevClasses) => ({ ...prevClasses, [classId]: true }));
      }

      return { ...prev, [classId]: classPlayers };
    });
  };

  // Master Toggle: Select/Deselect All
  const isAllSelected = previewData.length > 0 && previewData.every((c) => selectedClasses[c.classId]);
  const handleToggleAll = () => {
    const nextVal = !isAllSelected;
    const classesSel: Record<string, boolean> = {};
    const playersSel: Record<string, Record<string, boolean>> = {};

    previewData.forEach((cls) => {
      classesSel[cls.classId] = nextVal;
      playersSel[cls.classId] = {};
      cls.players.forEach((p) => {
        playersSel[cls.classId][p._id] = nextVal;
      });
    });

    setSelectedClasses(classesSel);
    setSelectedPlayers(playersSel);
  };

  const handleToggleExpand = (classId: string) => {
    setExpandedClasses((prev) => ({ ...prev, [classId]: !prev[classId] }));
  };

  const handleCloneClick = () => {
    const selectedClassCount = Object.values(selectedClasses).filter(Boolean).length;
    if (selectedClassCount === 0) {
      errorToast("No classes selected for cloning.");
      return;
    }
    setShowConfirmModal(true);
  };

  const executeClone = async () => {
    setShowConfirmModal(false);
    setShowLoaderModal(true);
    setSubmittingClone(true);

    const payloadClasses = previewData
      .filter((cls) => selectedClasses[cls.classId])
      .map((cls) => {
        const classPlayerIds = cls.players
          .filter((p) => selectedPlayers[cls.classId]?.[p._id])
          .map((p) => p._id);
        return {
          classId: cls.classId,
          players: classPlayerIds,
        };
      });

    try {
      const response = await apiClient.post("/api/admin/cloneTerm", {
        sourceTermId,
        targetTermId,
        classes: payloadClasses,
      });

      if (response.data && response.data.success) {
        successToast("Term classes and players cloned successfully!");
        setShowLoaderModal(false);
        navigate("/classes");
      } else {
        errorToast(response.data?.message || "Failed to clone term.");
        setShowLoaderModal(false);
      }
    } catch (error: any) {
      console.error("Clone error:", error);
      errorToast(error.response?.data?.message || "Error during clone operation.");
      setShowLoaderModal(false);
    } finally {
      setSubmittingClone(false);
    }
  };

  const handleSourceYearChange = (val: string) => {
    setSourceYear(val);
    setSourceTermId("");
  };

  const handleTargetYearChange = (val: string) => {
    setTargetYear(val);
    setTargetTermId("");
  };

  const uniqueYears = Array.from(new Set(terms.map((t) => t.year))).sort((a, b) => b - a);
  const yearOptions = [
    { label: "All Years", value: "" },
    ...uniqueYears.map((yr) => ({ label: String(yr), value: String(yr) })),
  ];

  const sourceTermOptions = terms
    .filter((t) => !sourceYear || String(t.year) === sourceYear)
    .map((t) => ({
      label: `${t.name} (${t.year})`,
      value: t._id,
    }));

  const targetTermOptions = terms
    .filter((t) => !targetYear || String(t.year) === targetYear)
    .map((t) => ({
      label: `${t.name} (${t.year})`,
      value: t._id,
    }));

  const sourceTermObj = terms.find((t) => t._id === sourceTermId);
  const targetTermObj = terms.find((t) => t._id === targetTermId);

  // Compute selected stats
  const totalSelectedClasses = Object.values(selectedClasses).filter(Boolean).length;
  let totalSelectedPlayers = 0;
  Object.keys(selectedPlayers).forEach((cid) => {
    if (selectedClasses[cid]) {
      totalSelectedPlayers += Object.values(selectedPlayers[cid]).filter(Boolean).length;
    }
  });

  return (
    <>
      <PageMeta title="CoachMax | Clone Term" description="Clone classes and players from one term to another" />
      <div className="space-y-6">
        {/* Custom Header Section */}
        <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Clone Term</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Copy classes and player assignments to a new term in seconds.</p>
          </div>
          <div>
            <button
              onClick={() => navigate("/coaching-management")}
              className="inline-flex items-center justify-center rounded-none bg-[#0047FF] hover:bg-blue-700 px-5 py-2.5 text-center text-xs font-black uppercase tracking-wider text-white transition-colors shadow-theme-xs shrink-0 cursor-pointer"
            >
              + Create Term
            </button>
          </div>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 mb-6 shadow-theme-xs max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${step === 1
                ? "bg-[#0047FF] text-white ring-4 ring-blue-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}>
                1
              </div>
              <div>
                <div className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wide">Select Terms</div>
                <div className="text-[10px] text-slate-400 font-medium">Choose source & target</div>
              </div>
            </div>

            {/* Line 1 */}
            <div className="hidden md:block flex-1 max-w-[100px] h-[2px] bg-slate-200 dark:bg-slate-700" />

            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${step === 2
                ? "bg-[#0047FF] text-white ring-4 ring-blue-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}>
                2
              </div>
              <div>
                <div className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wide">Review & Customize</div>
                <div className="text-[10px] text-slate-400 font-medium">Select classes & players</div>
              </div>
            </div>

            {/* Line 2 */}
            <div className="hidden md:block flex-1 max-w-[100px] h-[2px] bg-slate-200 dark:bg-slate-700" />

            {/* Step 3 */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${step === 3 || submittingClone
                ? "bg-[#0047FF] text-white ring-4 ring-blue-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}>
                3
              </div>
              <div>
                <div className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wide">Clone Complete</div>
                <div className="text-[10px] text-slate-400 font-medium">Confirm & finish</div>
              </div>
            </div>
          </div>
        </div>

        {step === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto items-start">
            {/* Left Column - Main Selection Panel */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-8 shadow-theme-sm rounded-none">
                {/* Side-by-Side Term Metadata Cards */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                  {/* Source Card */}
                  <div className="flex-1 w-full bg-blue-50/20 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 p-6 rounded-none relative transition-all hover:shadow-xs">
                    <div className="text-[10px] font-black text-[#0047FF] uppercase tracking-widest mb-3.5">Source Term</div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-none bg-[#0047FF]/10 flex items-center justify-center text-[#0047FF] shrink-0 shadow-theme-xs">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">
                            {sourceTermObj ? sourceTermObj.name : "Select Term"}
                          </h4>
                          {sourceTermObj && (
                            <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider bg-[#0047FF] text-white rounded-none shrink-0">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          {sourceTermObj ? `Year: ${sourceTermObj.year}` : "—"}
                        </p>
                      </div>
                    </div>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
                      <div>
                        <div className="text-sm font-black text-slate-800 dark:text-white">
                          {sourceTermId ? getTermStats(sourceTermId).classes : 0}
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Classes</div>
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800 dark:text-white">
                          {sourceTermId ? getTermStats(sourceTermId).players : 0}
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Players</div>
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800 dark:text-white">
                          {sourceTermId ? getTermStats(sourceTermId).coaches : 0}
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Coaches</div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-theme-xs">
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>

                  {/* Target Card */}
                  <div className="flex-1 w-full bg-emerald-50/10 dark:bg-emerald-950/5 border border-emerald-100 dark:border-emerald-900/20 p-6 rounded-none relative transition-all hover:shadow-xs">
                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3.5">Target Term</div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-none bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 shadow-theme-xs">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">
                            {targetTermObj ? targetTermObj.name : "Select Term"}
                          </h4>
                          {targetTermObj && (
                            <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider bg-emerald-500 text-white rounded-none shrink-0">
                              Upcoming
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          {targetTermObj ? `Year: ${targetTermObj.year}` : "—"}
                        </p>
                      </div>
                    </div>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
                      <div>
                        <div className="text-sm font-black text-slate-800 dark:text-white">
                          {targetTermId ? getTermStats(targetTermId).classes : 0}
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Classes</div>
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800 dark:text-white">
                          {targetTermId ? getTermStats(targetTermId).players : 0}
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Players</div>
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800 dark:text-white">
                          {targetTermId ? getTermStats(targetTermId).coaches : 0}
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Coaches</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab Buttons */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("terms")}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-[3px] text-center cursor-pointer ${activeTab === "terms"
                      ? "border-[#0047FF] text-[#0047FF]"
                      : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      }`}
                  >
                    Terms
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("holiday")}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-[3px] text-center cursor-pointer ${activeTab === "holiday"
                      ? "border-[#0047FF] text-[#0047FF]"
                      : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      }`}
                  >
                    Holiday Programs
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Source Selection Container */}
                    <div className="space-y-5 bg-slate-50/50 dark:bg-slate-800/10 p-5 rounded-none border border-slate-100 dark:border-slate-800">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-[#0047FF]">Source configuration</h3>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-0.5">Source Year</label>
                        <Select
                          value={sourceYear}
                          onChange={handleSourceYearChange}
                          options={yearOptions}
                          placeholder="All Years"
                          className="w-full"
                          triggerClassName="h-[46px] w-full flex items-center justify-between border px-4 py-2 text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 border-slate-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-800 dark:text-white transition-all cursor-pointer rounded-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-0.5">Source Term</label>
                        <Select
                          value={sourceTermId}
                          onChange={(val) => setSourceTermId(val)}
                          options={sourceTermOptions}
                          placeholder="Select Source Term"
                          className="w-full"
                          triggerClassName="h-[46px] w-full flex items-center justify-between border px-4 py-2 text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 border-slate-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-800 dark:text-white transition-all cursor-pointer rounded-none"
                        />
                      </div>
                    </div>

                    {/* Target Selection Container */}
                    <div className="space-y-5 bg-slate-50/50 dark:bg-slate-800/10 p-5 rounded-none border border-slate-100 dark:border-slate-800">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Target configuration</h3>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-0.5">Target Year</label>
                        <Select
                          value={targetYear}
                          onChange={handleTargetYearChange}
                          options={yearOptions}
                          placeholder="All Years"
                          className="w-full"
                          triggerClassName="h-[46px] w-full flex items-center justify-between border px-4 py-2 text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 border-slate-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-800 dark:text-white transition-all cursor-pointer rounded-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-0.5">Target Term</label>
                        <Select
                          value={targetTermId}
                          onChange={(val) => setTargetTermId(val)}
                          options={targetTermOptions}
                          placeholder="Select Target Term"
                          className="w-full"
                          triggerClassName="h-[46px] w-full flex items-center justify-between border px-4 py-2 text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 border-slate-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-800 dark:text-white transition-all cursor-pointer rounded-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={handlePreview}
                      disabled={loadingPreview || !sourceTermId || !targetTermId}
                      className="w-full flex items-center justify-center gap-2.5 rounded-none bg-[#0047FF] hover:bg-blue-700 disabled:bg-[#0047FF] disabled:opacity-50 disabled:cursor-not-allowed py-4 text-xs font-black uppercase tracking-wider text-white transition-colors cursor-pointer shadow-theme-xs"
                    >
                      {loadingPreview ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                          Loading Preview...
                        </>
                      ) : (
                        <>
                          <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Preview Clone Data
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* How it works info box */}
              <div className="bg-blue-50/20 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-none">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-none bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white uppercase tracking-wider mb-1">How it works?</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[420px]">
                      We'll copy all selected classes and player assignments from the source term to the target term. You can review and deselect any class or player before confirming the clone.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800/80">
                  <div className="text-center">
                    <div className="w-9 h-9 rounded-none bg-[#0047FF]/10 text-[#0047FF] flex items-center justify-center mx-auto mb-1.5 shadow-theme-xs">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Classes</span>
                  </div>
                  <div className="text-center">
                    <div className="w-9 h-9 rounded-none bg-[#0047FF]/10 text-[#0047FF] flex items-center justify-center mx-auto mb-1.5 shadow-theme-xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Players</span>
                  </div>
                  <div className="text-center">
                    <div className="w-9 h-9 rounded-none bg-[#0047FF]/10 text-[#0047FF] flex items-center justify-center mx-auto mb-1.5 shadow-theme-xs">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Rosters</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Summary Panel */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 shadow-theme-sm rounded-none space-y-6">
              <div>
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest border-b pb-3 mb-4">Clone Summary</h3>
                <div className="flex flex-col items-center text-center py-6 bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-100 dark:border-slate-800 rounded-none">
                  <div className="w-14 h-14 bg-[#0047FF]/10 text-[#0047FF] flex items-center justify-center mb-3 rounded-none">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-white uppercase tracking-wide">What will be cloned?</h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[200px] mt-1">
                    Review the details of what will be copied to the target term.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs font-bold">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <span className="text-slate-400 flex items-center gap-2 font-semibold">
                    <Calendar className="w-4 h-4 text-slate-400" /> Source Term
                  </span>
                  <span className="text-slate-800 dark:text-white">
                    {sourceTermObj ? sourceTermObj.name : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <span className="text-slate-400 flex items-center gap-2 font-semibold">
                    <Calendar className="w-4 h-4 text-slate-400" /> Target Term
                  </span>
                  <span className="text-slate-800 dark:text-white">
                    {targetTermObj ? targetTermObj.name : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <span className="text-slate-400 flex items-center gap-2 font-semibold">
                    <BookOpen className="w-4 h-4 text-slate-400" /> Classes
                  </span>
                  <span className="font-black text-slate-800 dark:text-white">
                    {sourceTermId ? getTermStats(sourceTermId).classes : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <span className="text-slate-400 flex items-center gap-2 font-semibold">
                    <Users className="w-4 h-4 text-slate-400" /> Players
                  </span>
                  <span className="font-black text-slate-800 dark:text-white">
                    {sourceTermId ? getTermStats(sourceTermId).players : 0}
                  </span>
                </div>
              </div>

              {/* Safe & Secure Alert */}
              <div className="bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 p-4 flex items-start gap-3 rounded-none">
                <div className="w-8 h-8 rounded-none bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 shadow-theme-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-[10px] text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-0.5">Safe & Secure</h5>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-semibold leading-normal">
                    Existing data in target term will not be affected.
                  </p>
                </div>
              </div>

              {/* Steps component */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-100 dark:border-slate-800 rounded-none space-y-3">
                <h5 className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-1">Steps to follow</h5>
                <div className="space-y-2.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-none bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[9px] font-black shrink-0 shadow-theme-xs">1</span>
                    Select source term (from where to copy)
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-none bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[9px] font-black shrink-0 shadow-theme-xs">2</span>
                    Select target term (where to copy)
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-none bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[9px] font-black shrink-0 shadow-theme-xs">3</span>
                    Preview classes & players
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-none bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[9px] font-black shrink-0 shadow-theme-xs">4</span>
                    Customize if needed
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-none bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[9px] font-black shrink-0 shadow-theme-xs">5</span>
                    Confirm and clone
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header info bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 shadow-theme-xs flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider">
                  Source: <span className="text-[#0047FF]">{(responseSourceTerm?.name || sourceTermObj?.name) ? `${responseSourceTerm?.name || sourceTermObj?.name} ${sourceTermObj?.year ? `(${sourceTermObj.year})` : ""}` : ""}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <div className="px-3 py-1.5 bg-[#0047FF]/10 text-[#0047FF] font-bold text-xs uppercase tracking-wider">
                  Target: <span>{(responseTargetTerm?.name || targetTermObj?.name) ? `${responseTargetTerm?.name || targetTermObj?.name} ${targetTermObj?.year ? `(${targetTermObj.year})` : ""}` : ""}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-500 uppercase">Selected Summary</div>
                  <div className="text-sm font-black text-slate-800 dark:text-white">
                    {totalSelectedClasses} Classes / {totalSelectedPlayers} Players
                  </div>
                </div>

                <button
                  onClick={handleCloneClick}
                  disabled={submittingClone || totalSelectedClasses === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-none bg-[#0047FF] hover:bg-blue-700 disabled:bg-blue-300 px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors cursor-pointer"
                >
                  Confirm Clone
                </button>
              </div>
            </div>

            {/* List Selection Header with Select All */}
            <div className="bg-[#031549] text-white p-4 flex items-center justify-between">
              <button
                onClick={handleToggleAll}
                className="flex items-center gap-2.5 hover:text-blue-200 transition-colors text-xs font-black uppercase tracking-wider"
              >
                {isAllSelected ? <CheckSquare className="w-4.5 h-4.5 text-blue-400" /> : <Square className="w-4.5 h-4.5" />}
                Select All Classes ({previewData.length})
              </button>

              <button
                onClick={() => setStep(1)}
                className="text-xs font-black uppercase tracking-wider hover:underline"
              >
                Back to Selection
              </button>
            </div>

            {/* Preview Table/List */}
            <div className="space-y-4">
              {previewData.map((cls) => {
                const isSelected = !!selectedClasses[cls.classId];
                const isExpanded = !!expandedClasses[cls.classId];
                const hasPlayers = cls.players.length > 0;
                const classSelPlayers = selectedPlayers[cls.classId] || {};
                const selectedPlayersCount = Object.values(classSelPlayers).filter(Boolean).length;

                return (
                  <div
                    key={cls.classId}
                    className={`bg-white dark:bg-slate-900 border transition-all ${isSelected
                      ? "border-[#0047FF]/40 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 opacity-60"
                      }`}
                  >
                    {/* Class Main Header */}
                    <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <button
                          onClick={() => handleToggleClass(cls.classId)}
                          className="text-[#0047FF] hover:scale-105 transition-transform mt-0.5 shrink-0"
                        >
                          {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-300" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">
                              {cls.name}
                            </h4>
                            {cls.alreadyExists && (
                              <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800/30">
                                Already Exists
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-400 font-bold mt-1">
                            <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 uppercase tracking-wider">
                              {cls.category}
                            </span>
                            <span>/</span>
                            <span className="bg-blue-50/50 dark:bg-blue-950/20 text-[#0047FF] px-1.5 py-0.5 uppercase tracking-wider">
                              {cls.program}
                            </span>
                            <span>/</span>
                            <span className="text-slate-500 flex items-center gap-1">
                              <User className="w-3 h-3" /> Coach: {cls.coach || "Unassigned"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section: Player stats & Accordion trigger */}
                      <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                        <div className="text-xs font-semibold text-slate-500">
                          {hasPlayers ? (
                            <span>
                              {selectedPlayersCount} of {cls.players.length} Players Selected
                            </span>
                          ) : (
                            <span className="italic text-slate-400">No players assigned</span>
                          )}
                        </div>

                        {hasPlayers && (
                          <button
                            onClick={() => handleToggleExpand(cls.classId)}
                            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-[#0047FF] transition-colors"
                          >
                            {isExpanded ? (
                              <>
                                Hide Players
                                <ChevronUp className="w-4 h-4" />
                              </>
                            ) : (
                              <>
                                View Players
                                <ChevronDown className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Class Players Dropdown List */}
                    {hasPlayers && isExpanded && (
                      <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 p-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-0.5">
                          Players list
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {cls.players.map((p) => {
                            const isPlayerSelected = !!classSelPlayers[p._id] && isSelected;
                            return (
                              <button
                                key={p._id}
                                onClick={() => handleTogglePlayer(cls.classId, p._id)}
                                className={`flex items-center gap-2.5 p-2.5 border text-left rounded-none transition-all ${isPlayerSelected
                                  ? "bg-white dark:bg-slate-900 border-[#0047FF]/30 text-slate-800 dark:text-white"
                                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/60 text-slate-400"
                                  }`}
                              >
                                <span className="text-[#0047FF] shrink-0">
                                  {isPlayerSelected ? <CheckSquare className="w-4.5 h-4.5" /> : <Square className="w-4.5 h-4.5 text-slate-300" />}
                                </span>
                                <span className="text-xs font-bold truncate">{p.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} className="max-w-[450px] p-6 lg:p-8 rounded-none shadow-2xl">
        <h4 className="text-xl font-bold mb-2 tracking-tight">Confirm Clone Operation</h4>
        <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed">
          Are you sure you want to clone <span className="text-[#0047FF] font-bold">{(responseSourceTerm?.name || sourceTermObj?.name)} {sourceTermObj?.year ? `(${sourceTermObj.year})` : ""}</span> to <span className="text-[#0047FF] font-bold">{(responseTargetTerm?.name || targetTermObj?.name)} {targetTermObj?.year ? `(${targetTermObj.year})` : ""}</span>?
          This will duplicate all selected classes and their player rosters.
        </p>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
          <Button onClick={executeClone} className="bg-[#0047FF] hover:bg-blue-700 text-white">
            Proceed
          </Button>
        </div>
      </Modal>

      {/* Loader Modal */}
      <Modal isOpen={showLoaderModal} onClose={() => { }} showCloseButton={false} className="max-w-[400px] p-6 lg:p-8 rounded-none shadow-2xl text-center">
        <div className="flex flex-col items-center justify-center py-6 gap-4">
          <div className="w-12 h-12 border-4 border-[#0047FF] border-t-transparent rounded-full animate-spin" />
          <h4 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider">Cloning Term Data...</h4>
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[280px]">
            Don't close window, please wait some time. You are cloning one term data to another...
          </p>
        </div>
      </Modal>
    </>
  );
}
