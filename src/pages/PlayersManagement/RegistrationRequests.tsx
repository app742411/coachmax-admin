import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import PageMeta from "../../components/common/PageMeta";
import { Player } from "../../types/player";
import PlayerTable from "../../components/players/PlayerTable";
import PlayerDetailCard from "../../components/players/PlayerDetailCard";
import AssignClassModal from "../../components/players/AssignClassModal";
import { useRegistrationRequests } from "../../hooks/useRegistrationRequests";
import { rejectVerificationRequest } from "../../api/verificationApi";
import { useSidebarBadges } from "../../hooks/useSidebarBadges";
import { useTerms } from "../../hooks/useTerms";

export default function RegistrationRequests() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [medical, setMedical] = useState("");
  const [source, setSource] = useState("");
  const [term, setTerm] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [page, setPage] = useState(1);
  const [playerToAssign, setPlayerToAssign] = useState<Player | null>(null);
  const [playerToReject, setPlayerToReject] = useState<Player | null>(null);
  const [reason, setReason] = useState("");
  const { terms } = useTerms({ isEvent: "all" });
  const queryClient = useQueryClient();
  const { markItemAsRead } = useSidebarBadges();
  useEffect(() => { const timer = window.setTimeout(() => { setSearch(searchQuery); setPage(1); }, 300); return () => window.clearTimeout(timer); }, [searchQuery]);
  const { data, isLoading, isError, error, refetch } = useRegistrationRequests(page, 20, { search, status, isMedicalCondition: medical, requestType: source, term, ageGroup });
  const players = data?.users || [];
  const selectPlayer = (player: Player) => { if (player.requestId) markItemAsRead("verificationRequests", player.requestId); setSelectedPlayer(player); };
  const reject = useMutation({
    mutationFn: () => rejectVerificationRequest(playerToReject!.requestId!, reason.trim()),
    onSuccess: async (response) => {
      await Promise.all(["registrationRequests", "coachTemporaryPlayers", "players", "sidebarBadges"].map((key) => queryClient.invalidateQueries({ queryKey: [key] })));
      toast.success(response.message || "Request rejected"); setPlayerToReject(null); setReason(""); setSelectedPlayer(null);
    },
    onError: (failure: any) => toast.error(failure.response?.data?.message || failure.message),
  });
  const controlClass = "border border-slate-200 p-2 text-sm bg-white dark:bg-slate-900 dark:border-slate-700";
  return <>
    <PageMeta title="Verification Requests | CoachMax" description="Review parent registrations and coach temporary-player requests" />
    <div className="mb-5"><h1 className="text-2xl font-bold dark:text-white">Verification Requests</h1><p className="text-sm text-slate-500">Parent registrations and coach temporary players. Each request is reviewed separately.</p></div>
    <div className="flex flex-wrap gap-2 mb-4">
      <input aria-label="Search requests" placeholder="Search player, parent, email or phone" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className={`${controlClass} flex-1 min-w-52`} />
      <select aria-label="Request status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className={controlClass}><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option><option value="COMPLETED">Legacy completed</option><option value="ALL">All statuses</option></select>
      <select aria-label="Request source" value={source} onChange={(event) => { setSource(event.target.value); setPage(1); }} className={controlClass}><option value="">All sources</option><option value="TEMPORARY_PLAYER">Coach temporary player</option><option value="NEW_PLAYER">New player</option><option value="ADD_PROGRAM">Additional program</option><option value="HOLIDAY_PROGRAM">Holiday program</option><option value="EVENT_REGISTRATION">Event registration</option></select>
      <select aria-label="Medical conditions" value={medical} onChange={(event) => { setMedical(event.target.value); setPage(1); }} className={controlClass}><option value="">Medical: all</option><option value="true">Medical: YES</option><option value="false">Medical: NO</option></select>
      <select aria-label="Requested term" value={term} onChange={(event) => { setTerm(event.target.value); setPage(1); }} className={controlClass}><option value="">All requested terms</option>{terms.map((item) => <option key={item._id} value={item._id}>{item.year} · {item.name}</option>)}</select>
      <select aria-label="U group" value={ageGroup} onChange={(event) => { setAgeGroup(event.target.value); setPage(1); }} className={controlClass}><option value="">All U groups</option>{Array.from({ length: 20 }, (_, index) => index + 3).map((group) => <option key={group} value={`U${group}`}>U{group}</option>)}</select>
    </div>
    <p className="text-sm text-slate-500 mb-3">{data?.total ?? 0} requests · U groups use {term ? "the selected term year" : "the current year"}.</p>
    <div className="flex flex-col xl:flex-row gap-3 items-start">
      <div className="flex-1 w-full min-w-0">
        {isLoading ? <p className="p-8 text-center">Loading requests…</p> : isError ? <div role="alert" className="p-6 border text-red-600">{error.message}<button onClick={() => refetch()} className="ml-3 underline">Retry</button></div> : !players.length ? <p className="p-8 border text-center text-slate-500">No requests match these filters.</p> : <PlayerTable players={players} selectedPlayerId={selectedPlayer?.requestId || ""} onSelectPlayer={selectPlayer} onAssignClass={(player) => { selectPlayer(player); setPlayerToAssign(player); }} onOpenRequestedClass={(player) => setPlayerToAssign(player)} onRejectPlayer={(player) => { setPlayerToReject(player); setReason(""); }} showStatusColumn showRequestDetails showPaymentStatus={false} page={page} limit={20} />}
        <div className="flex gap-3 justify-end items-center mt-4 text-sm"><button disabled={page <= 1 || isLoading} onClick={() => setPage((value) => value - 1)} className="border px-3 py-2 disabled:opacity-40">Previous</button><span>Page {page} of {Math.max(1, data?.totalPages || 1)}</span><button disabled={isLoading || page >= (data?.totalPages || 1)} onClick={() => setPage((value) => value + 1)} className="border px-3 py-2 disabled:opacity-40">Next</button></div>
      </div>
      {selectedPlayer && <PlayerDetailCard player={selectedPlayer} onClose={() => setSelectedPlayer(null)} isRegistrationRequest />}
    </div>
    {playerToAssign && <AssignClassModal player={playerToAssign} onClose={() => setPlayerToAssign(null)} />}
    {playerToReject && <div className="fixed inset-0 z-[10000] bg-slate-900/50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="reject-title"><div className="bg-white dark:bg-slate-900 p-6 w-full max-w-md"><h2 id="reject-title" className="font-bold">Reject request for {playerToReject.fullName}</h2><p className="text-sm text-slate-500 my-2">Other requests, enrollments and player history are retained.</p><textarea aria-label="Rejection reason" placeholder="Reason for rejection" value={reason} maxLength={2000} onChange={(event) => setReason(event.target.value)} className="border w-full p-2 dark:bg-slate-800" /><div className="flex gap-3 justify-end mt-4"><button onClick={() => setPlayerToReject(null)} disabled={reject.isPending}>Cancel</button><button onClick={() => reject.mutate()} disabled={!reason.trim() || reject.isPending} className="bg-red-600 text-white px-4 py-2 disabled:opacity-50">{reject.isPending ? "Saving…" : "Reject request"}</button></div></div></div>}
  </>;
}
