import { useMemo, useState, useEffect } from "react";
import { useTerms, Term } from "./useTerms";

export interface FindTermOptions {
  isEvent?: boolean;
}

/**
 * Deterministically finds the current/active term:
 * 1. Date Range Match: Today is between startDate and endDate
 * 2. Upcoming Term: Closest upcoming term (startDate > today)
 * 3. Fallback (Last Term): If no upcoming term is available, return the last term (most recent / last in list)
 */
export function findCurrentTerm(terms: Term[], options?: FindTermOptions): Term | null {
  if (!terms || terms.length === 0) return null;
  const now = new Date();

  const filteredTerms = options?.isEvent !== undefined
    ? terms.filter((t) => !!t.isEvent === options.isEvent)
    : terms;

  if (filteredTerms.length === 0) return null;

  // 1. Date Range Match (Today is between startDate and endDate)
  const dateMatch = filteredTerms.find((t) => {
    if (!t.startDate || !t.endDate) return false;
    const start = new Date(t.startDate);
    const end = new Date(t.endDate);
    return now >= start && now <= end;
  });
  if (dateMatch) return dateMatch;

  // 2. Upcoming Term Match (find closest term where startDate > today)
  const upcomingTerms = filteredTerms
    .filter((t) => {
      if (!t.startDate) return false;
      const start = new Date(t.startDate);
      return start > now;
    })
    .sort((a, b) => {
      const startA = new Date(a.startDate!).getTime();
      const startB = new Date(b.startDate!).getTime();
      return startA - startB; // Closest upcoming first
    });

  if (upcomingTerms.length > 0) {
    return upcomingTerms[0];
  }

  // 4. Fallback (Last Term): If no upcoming term is available, return the last term
  const sortedByDate = filteredTerms
    .filter((t) => !!(t.endDate || t.startDate))
    .sort((a, b) => {
      const dateA = new Date(a.endDate || a.startDate!).getTime();
      const dateB = new Date(b.endDate || b.startDate!).getTime();
      return dateA - dateB;
    });

  if (sortedByDate.length > 0) {
    return sortedByDate[sortedByDate.length - 1];
  }

  return filteredTerms[filteredTerms.length - 1] || null;
}

export function getCurrentDateFormatted(): string {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

export function getCurrentYearNumber(): number {
  return new Date().getFullYear();
}

export function getCurrentYearString(): string {
  return new Date().getFullYear().toString();
}

/**
 * Reusable hook returning today's formatted date
 */
export function useCurrentDate(): string {
  return useMemo(() => getCurrentDateFormatted(), []);
}

/**
 * Reusable hook returning current academic year string and number
 */
export function useCurrentYear(): { yearString: string; yearNumber: number } {
  return useMemo(
    () => ({
      yearString: getCurrentYearString(),
      yearNumber: getCurrentYearNumber(),
    }),
    []
  );
}

export interface UseCurrentTermOptions {
  year?: number | string;
  isEvent?: "all" | "true" | "false" | string;
  initialTermId?: string;
  autoSelectActiveTerm?: boolean;
}

export interface UseCurrentTermReturn {
  allTerms: Term[];
  terms: Term[];
  availableYears: string[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;

  currentTerm: Term | null;
  currentTermId: string;
  currentDate: string;
  currentYear: string;
  currentYearNumber: number;

  selectedYear: string;
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>;
  selectedTerm: string;
  setSelectedTerm: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Centralized hook for Term, Year, and Date selection across the entire app
 */
export function useCurrentTerm(options?: UseCurrentTermOptions): UseCurrentTermReturn {
  const currentDate = useCurrentDate();
  const { yearString: defaultCurrentYear, yearNumber: currentYearNumber } = useCurrentYear();

  const [selectedYear, setSelectedYear] = useState<string>(
    options?.year !== undefined ? options.year.toString() : defaultCurrentYear
  );
  const [selectedTerm, setSelectedTerm] = useState<string>(options?.initialTermId || "");

  const isEventParam = options?.isEvent ?? "all";

  // Fetch all terms (used to calculate availableYears and initial active term)
  const {
    terms: allTerms,
    isLoading: allTermsLoading,
    isError: allTermsError,
    refetch: refetchAllTerms,
  } = useTerms({ isEvent: isEventParam });

  // Fetch terms filtered by selected year (if selectedYear is non-empty)
  const {
    terms: yearTerms,
    isLoading: yearTermsLoading,
    isError: yearTermsError,
    refetch: refetchYearTerms,
  } = useTerms(
    { year: selectedYear, isEvent: isEventParam },
    { enabled: !!selectedYear }
  );

  // Compute available unique years from all terms
  const availableYears = useMemo(() => {
    if (!allTerms || allTerms.length === 0) {
      const cy = getCurrentYearNumber();
      return [
        (cy + 1).toString(),
        cy.toString(),
        (cy - 1).toString(),
        (cy - 2).toString(),
        (cy - 3).toString(),
      ];
    }
    return Array.from(
      new Set(allTerms.map((t) => t.year?.toString()).filter(Boolean))
    ).sort() as string[];
  }, [allTerms]);

  // Determine active term for the whole list
  const currentTerm = useMemo(() => {
    return findCurrentTerm(allTerms);
  }, [allTerms]);

  const currentTermId = currentTerm?._id || "";

  // Auto-select initial term and year when terms load (if not overridden by options.initialTermId)
  useEffect(() => {
    if (options?.autoSelectActiveTerm === false) return;

    if (allTerms && allTerms.length > 0) {
      if (options?.initialTermId) {
        const found = allTerms.find((t) => t._id === options.initialTermId);
        if (found) {
          setSelectedTerm(found._id);
          if (found.year && !options.year) {
            setSelectedYear(found.year.toString());
          }
          return;
        }
      }

      if (!selectedTerm) {
        const active = findCurrentTerm(allTerms);
        if (active) {
          setSelectedTerm(active._id);
          if (active.year && !options?.year) {
            setSelectedYear(active.year.toString());
          }
        }
      }
    }
  }, [allTerms, options?.initialTermId, options?.autoSelectActiveTerm]);

  // When selectedYear changes, if current selectedTerm doesn't belong to the year, select the first active in that year
  useEffect(() => {
    if (yearTerms && yearTerms.length > 0) {
      const exists = yearTerms.some((t) => t._id === selectedTerm);
      if (!exists && options?.autoSelectActiveTerm !== false) {
        const activeInYear = findCurrentTerm(yearTerms);
        setSelectedTerm(activeInYear ? activeInYear._id : yearTerms[0]._id);
      }
    }
  }, [yearTerms, selectedYear]);

  const terms = selectedYear ? yearTerms : allTerms;
  const isLoading = selectedYear ? yearTermsLoading : allTermsLoading;
  const isError = selectedYear ? yearTermsError : allTermsError;

  const refetch = () => {
    refetchAllTerms();
    if (selectedYear) refetchYearTerms();
  };

  return {
    allTerms,
    terms,
    availableYears,
    isLoading,
    isError,
    refetch,

    currentTerm,
    currentTermId,
    currentDate,
    currentYear: defaultCurrentYear,
    currentYearNumber,

    selectedYear,
    setSelectedYear,
    selectedTerm,
    setSelectedTerm,
  };
}
