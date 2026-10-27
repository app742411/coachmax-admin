import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Player } from "../../types/player";
import { allocateVerification, fetchAllocationClasses } from "../../api/verificationApi";
import { useTerms } from "../../hooks/useTerms";
import { formatDateOnly, ageGroupForYear } from "../../utils/dateTime";

interface AssignClassModalProps { player: Player; onClose: () => void; }
const id = (value: any): string => String(value?._id || value || "");

export default function AssignClassModal({ player, onClose }: AssignClassModalProps) {
  const queryClient = useQueryClient();
  const { terms } = useTerms({ isEvent: "all" });
  const requested = player.preferredClasses || [];
  const [termId, setTermId] = useState(id(player.preferredTerm) || id(requested[0]?.term));
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>(requested.filter((cls) => cls && cls.status !== "INACTIVE").map(id));
  const [paymentStatus, setPaymentStatus] = useState("UNPAID");
  const [overrideEligibility, setOverrideEligibility] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const resolvedRequest = Boolean(player.requestId && player.status !== "PENDING");
  const selectedTerm = terms.find((term) => term._id === termId);
  const { data: classes = [], isLoading, isError, error } = useQuery({ queryKey: ["allocationClasses", termId], queryFn: () => fetchAllocationClasses(termId), enabled: Boolean(termId) });
  const canSelectClass = (cls: any) => cls.status === "ACTIVE" && !(Number(cls.capacity) > 0 && Number(cls.playerCount) >= Number(cls.capacity) && !player.assignedClasses?.some((assigned) => id(assigned) === id(cls)));
  const unavailableSelection = selectedClassIds.some((classId) => !classes.some((cls: any) => cls._id === classId && canSelectClass(cls)));
  const mutation = useMutation({
    mutationFn: () => allocateVerification({ playerId: player._id, registrationRequestId: player.requestId, classIds: selectedClassIds, paymentStatus, overrideEligibility, overrideReason }),
    onSuccess: async (data) => {
      await Promise.all(["registrationRequests", "coachTemporaryPlayers", "players", "unallocatedPlayers", "allocatedPlayers", "classPlayers", "classFullTable", "classFullTables", "classes", "allocationClasses", "sidebarBadges", "invoices", "player", "playerProfile"].map((key) => queryClient.invalidateQueries({ queryKey: [key] })));
      toast.success(data.message || "Player approved and allocated");
      onClose();
    },
    onError: (reason: any) => toast.error(reason.response?.data?.message || reason.message || "Allocation failed"),
  });
  const toggle = (classId: string) => setSelectedClassIds((current) => {
    const available = current.filter((value) => classes.some((cls: any) => cls._id === value));
    return available.includes(classId) ? available.filter((value) => value !== classId) : [...available, classId];
  });
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/50" role="dialog" aria-modal="true" aria-labelledby="allocate-title">
      <div className="bg-white dark:bg-slate-900 shadow-lg w-full max-w-2xl p-6 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <h3 id="allocate-title" className="text-lg font-bold text-slate-900 dark:text-white">{resolvedRequest ? "Requested Class Details" : "Approve and Allocate"}</h3>
        <p className="text-sm text-slate-600 mb-4">{player.fullName} — DOB {formatDateOnly(player.dob)}{selectedTerm ? ` · U${ageGroupForYear(player.dob, selectedTerm.year) ?? "?"} in ${selectedTerm.year}` : ""}</p>
        <div className="mb-4 border p-3 text-sm">
          <strong>Requested program / classes</strong>
          <p>{player.programs?.map((program) => program.name).join(", ") || "No program specified"}</p>
          <p>{player.preferredTerm?.name || "No preferred term"}</p>
          {requested.length ? requested.map((cls) => <p key={id(cls)}>{cls.name || "Unavailable class"} · {cls.dayOfWeek} {cls.startTime}–{cls.endTime} · {cls.venue || cls.location || "Location not set"}{cls.status === "INACTIVE" ? " (inactive)" : ""}</p>) : <p>No class requested. Choose a suitable class below.</p>}
        </div>
        {!resolvedRequest && <>
        <label className="block text-sm font-semibold mb-1" htmlFor="allocation-term">Term</label>
        <select id="allocation-term" className="w-full border p-2 mb-4 dark:bg-slate-800" value={termId} onChange={(event) => { setTermId(event.target.value); setSelectedClassIds([]); }}>
          <option value="">Select term</option>
          {terms.filter((term) => term.status !== "COMPLETED").map((term) => <option key={term._id} value={term._id}>{term.year} · {term.name} ({formatDateOnly(term.startDate)}–{formatDateOnly(term.endDate)})</option>)}
        </select>
        {isLoading ? <p>Loading classes…</p> : isError ? <p role="alert" className="text-red-600">{error instanceof Error ? error.message : "Could not load classes"}</p> : !termId ? <p>Select a term to see available classes.</p> : !classes.length ? <p>No classes are available in this term.</p> : (
          <fieldset className="space-y-2 max-h-64 overflow-y-auto"><legend className="text-sm font-semibold mb-2">Choose one or more classes</legend>
            {classes.map((cls: any) => {
              const full = Number(cls.capacity) > 0 && Number(cls.playerCount) >= Number(cls.capacity) && !player.assignedClasses?.some((assigned) => id(assigned) === id(cls));
              const disabled = cls.status !== "ACTIVE" || full;
              return <label key={cls._id} className={`flex gap-3 border p-3 text-sm ${disabled ? "opacity-50" : "cursor-pointer"}`}>
                <input type="checkbox" checked={selectedClassIds.includes(cls._id)} disabled={disabled && !selectedClassIds.includes(cls._id)} onChange={() => toggle(cls._id)} />
                <span><strong>{cls.name}</strong>{requested.some((requestedClass) => id(requestedClass) === id(cls)) && " (requested)"}<br />{cls.dayOfWeek} {cls.startTime}–{cls.endTime} · {cls.venue || cls.location || "Location not set"}<br />{cls.program?.name || ""}{Number(cls.capacity) > 0 ? ` · ${cls.playerCount ?? "?"}/${cls.capacity} enrolled` : ""}{full ? " · Full" : ""}</span>
              </label>;
            })}
          </fieldset>
        )}
        {unavailableSelection && !isLoading && <p className="text-amber-700 text-sm mt-2">A requested class is unavailable. Select an available class to continue.</p>}
        <label className="block text-sm font-semibold mt-4 mb-1" htmlFor="allocation-payment">Enrollment payment status</label>
        <select id="allocation-payment" className="w-full border p-2 dark:bg-slate-800" value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}>
          <option value="UNPAID">Approved — UNPAID (create class fee invoice)</option><option value="TRIAL">TRIAL</option><option value="TBC">TBC</option><option value="EXTRA">EXTRA</option><option value="SUBSTITUTE">SUBSTITUTE</option><option value="HANDSHAKE">HANDSHAKE</option>
        </select>
        <label className="flex gap-2 mt-4 text-sm"><input type="checkbox" checked={overrideEligibility} onChange={(event) => setOverrideEligibility(event.target.checked)} />Override age, gender or requested-term eligibility</label>
        {overrideEligibility && <textarea aria-label="Eligibility override reason" value={overrideReason} onChange={(event) => setOverrideReason(event.target.value)} maxLength={2000} placeholder="Explain the approved exception (at least 10 characters)" className="w-full border p-2 mt-2 dark:bg-slate-800" />}
        </>}
        <div className="flex justify-end gap-3 mt-6"><button onClick={onClose} disabled={mutation.isPending} className="px-4 py-2 border">{resolvedRequest ? "Close" : "Cancel"}</button>{!resolvedRequest && <button onClick={() => mutation.mutate()} disabled={!termId || !selectedClassIds.length || unavailableSelection || isLoading || isError || mutation.isPending || (overrideEligibility && overrideReason.trim().length < 10)} className="px-4 py-2 bg-[#0047FF] text-white disabled:opacity-50">{mutation.isPending ? "Allocating…" : "Approve and Allocate"}</button>}</div>
      </div>
    </div>
  );
}
