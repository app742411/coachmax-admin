import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import MainTabSelector, {
  Category,
} from "../../components/TrainingClasses/MainTabSelector";
import ProgramSelector, {
  Program,
} from "../../components/TrainingClasses/SchoolSelector";
import SessionNavigator from "../../components/TrainingClasses/SessionNavigator";
import TimeSlotNavigator from "../../components/TrainingClasses/TimeSlotNavigator";
import ClassSessionTable from "../../components/TrainingClasses/ClassSessionTable";
import { SESSIONS, WEEKDAYS } from "../../components/TrainingClasses/data";
import {
  getAllCategories,
  getProgramsByCategory,
  getClassFiltersWithTimeSlots,
  getClassFullTable,
  markSingleAttendance,
  markAttendance,
} from "../../api/adminApi";
import { toast } from "react-hot-toast";

const TrainingClassesPage: React.FC = () => {
  const queryClient = useQueryClient();

  // ── Selections (UI State) ───────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [activeSession, setActiveSession] = useState<string>("MONDAY");
  const [selectedTimeLabel, setSelectedTimeLabel] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  // ── Queries ─────────────────────────────────────────────────────

  // 1. Categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
  const categories: Category[] = categoriesData ? (Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || categoriesData.data || []) : [];

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  // 2. Programs
  const { data: programsData, isLoading: programsLoading } = useQuery({
    queryKey: ["programs", selectedCategory?._id],
    queryFn: () => getProgramsByCategory(selectedCategory!._id),
    enabled: !!selectedCategory?._id,
  });
  const programs: Program[] = programsData ? (Array.isArray(programsData) ? programsData : programsData.programs || programsData.data || []) : [];

  useEffect(() => {
    if (programs.length > 0) {
      setSelectedProgram(programs[0]);
    } else {
      setSelectedProgram(null);
    }
  }, [programs]);

  // 3. Time Slots
  const { data: timeSlotsResponse, isLoading: timeSlotsLoading } = useQuery({
    queryKey: ["timeSlots", selectedCategory?._id, selectedProgram?._id, activeSession],
    queryFn: () => getClassFiltersWithTimeSlots({
      categoryId: selectedCategory!._id,
      programId: selectedProgram!._id,
      day: activeSession,
    }),
    enabled: !!selectedCategory?._id && !!selectedProgram?._id,
  });
  const timeSlotsData = timeSlotsResponse?.timeSlots || [];

  useEffect(() => {
    if (timeSlotsData.length > 0) {
      const firstSlot = timeSlotsData[0];
      const timeLabel = `${firstSlot.startTime} - ${firstSlot.endTime}`;
      setSelectedTimeLabel(timeLabel);
      setSelectedClassId(firstSlot.classId);
    } else {
      setSelectedTimeLabel("");
      setSelectedClassId("");
    }
  }, [timeSlotsData]);

  // 4. Class Full Table
  const { data: classes, isLoading: tableLoading, error: tableError, refetch: refetchTable } = useQuery({
    queryKey: ["classFullTable", selectedClassId],
    queryFn: () => getClassFullTable(selectedClassId),
    enabled: !!selectedClassId,
  });

  // ── Mutations ───────────────────────────────────────────────────

  const markSingleMutation = useMutation({
    mutationFn: (data: any) => markSingleAttendance(selectedClassId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classFullTable", selectedClassId] });
      toast.success("Attendance updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update attendance");
    }
  });

  const markBulkMutation = useMutation({
    mutationFn: (data: any) => markAttendance(selectedClassId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classFullTable", selectedClassId] });
      toast.success("Bulk attendance updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update attendance");
    }
  });

  // ── Derived State ───────────────────────────────────────────────
  const isSchoolCategory = selectedCategory?.name?.toUpperCase().includes("SCHOOL") ?? false;
  const sessionList = isSchoolCategory ? WEEKDAYS : SESSIONS;
  const sessionLabel = isSchoolCategory
    ? `${selectedProgram?.name ?? "School"} Weekly Sessions`
    : `${selectedCategory?.name ?? ""} Training Slots`;

  const availableClassesAtTime = timeSlotsData.filter(
    (s: any) => `${s.startTime} - ${s.endTime}` === selectedTimeLabel
  );

  // ── Handlers ───────────────────────────────────────────────────
  const handleTabChange = (category: Category) => {
    setSelectedCategory(category);
    setActiveSession("MONDAY");
  };

  const handleMarkAttendance = (playerId: string, sessionDate: string, status: string) => {
    markSingleMutation.mutate({ sessionDate, playerId, status });
  };

  const handleMarkBulkAttendance = (sessionDate: string, status: string) => {
    if (!classes?.players) return;
    const records = classes.players.map((p: any) => ({
      player: p.playerId,
      status: status,
    }));
    markBulkMutation.mutate({ sessionDate, records });
  };

  return (
    <>
      <PageMeta
        title="CoachMax | Training Classes"
        description="Academy and School schedules"
      />
      <PageBreadcrumb pageTitle="Training Classes" />

      <div className="space-y-8 pb-20">
        <MainTabSelector
          categories={categories}
          activeCategoryId={selectedCategory?._id ?? ""}
          loading={categoriesLoading}
          onTabChange={handleTabChange}
        />

        <ProgramSelector
          programs={programs}
          selectedProgramId={selectedProgram?._id ?? ""}
          loading={programsLoading}
          isSchoolCategory={isSchoolCategory}
          onSelectProgram={(prog) => setSelectedProgram(prog)}
        />

        <SessionNavigator
          sessions={sessionList}
          activeSession={activeSession}
          label={sessionLabel}
          onSelectSession={setActiveSession}
        />

        <TimeSlotNavigator
          timeSlots={Array.from(new Set(timeSlotsData.map((s: any) => `${s.startTime} - ${s.endTime}`)))}
          selectedTime={selectedTimeLabel}
          onSelectTime={(timeStr) => {
            setSelectedTimeLabel(timeStr);
            const firstClassAtTime = timeSlotsData.find((s: any) => `${s.startTime} - ${s.endTime}` === timeStr);
            setSelectedClassId(firstClassAtTime?.classId || "");
          }}
          loading={timeSlotsLoading}
        />

        {availableClassesAtTime.length > 1 && (
          <div className="flex flex-wrap gap-2 px-2 animate-in fade-in slide-in-from-top-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider self-center mr-2">
              Select Group:
            </span>
            {availableClassesAtTime.map((c: any) => (
              <button
                key={c.classId}
                onClick={() => setSelectedClassId(c.classId)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${selectedClassId === c.classId
                  ? "bg-brand-500 border-brand-500 text-white"
                  : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400"
                  }`}
              >
                {c.className || `Class ${c.classId.slice(-4)}`}
              </button>
            ))}
          </div>
        )}

        <ClassSessionTable
          session={`${activeSession} - ${selectedTimeLabel}`}
          classData={classes}
          loading={tableLoading}
          error={tableError ? (tableError as any)?.response?.data?.message || "Failed to load" : null}
          onRetry={refetchTable}
          onMarkAttendance={handleMarkAttendance}
          onMarkBulkAttendance={handleMarkBulkAttendance}
        />
      </div>
    </>
  );
};

export default TrainingClassesPage;
