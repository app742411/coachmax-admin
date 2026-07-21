import { useQuery } from "@tanstack/react-query";
import { getRegistrationRequests } from "../api/adminApi";
import { Player, PlayersResponse } from "../types/player";

// We map the raw response to match the Player interface so we can reuse PlayerTable
const mapRegistrationToPlayer = (reg: any): Player => {
  return {
    _id: reg.player?._id || reg._id,
    firstName: reg.player?.firstName || "",
    lastName: reg.player?.lastName || "",
    fullName: reg.player?.fullName || "",
    email: reg.player?.email || null,
    phone: reg.player?.phone || null,
    dob: reg.player?.dob || "",
    gender: reg.player?.gender || "",
    profile: reg.player?.profile || "",
    profileImage: reg.player?.profileImage || "",
    parentId: reg.parent || null,
    preferredFoot: reg.player?.preferredFoot || "",
    weakFootRating: reg.player?.weakFootRating || 0,
    school: reg.player?.school || "",
    status: reg.status || "PENDING",
    category: reg.category || undefined,
    program: reg.programs && reg.programs.length > 0 ? reg.programs[0] : undefined,
    term: reg.player?.term || undefined,
    jerseyNumber: reg.player?.jerseyNumber || 0,
    goals: reg.player?.goals || 0,
    assists: reg.player?.assists || 0,
    appearances: reg.player?.appearances || 0,
    cleanSheets: reg.player?.cleanSheets || 0,
    yellowCards: reg.player?.yellowCards || 0,
    redCards: reg.player?.redCards || 0,
    // Add raw registration request id for status updates if needed
    requestId: reg._id
  } as Player & { requestId: string };
};

export const useRegistrationRequests = (page = 1, limit = 10) => {
  return useQuery<PlayersResponse, Error>({
    queryKey: ["registrationRequests", page, limit],
    queryFn: async () => {
      const response = await getRegistrationRequests(page, limit);
      // Map data array to Players
      if (!response || !response.data) {
        return { success: true, limit: 10, totalPages: 1, users: [], total: 0, page: 1 };
      }
      return {
        success: true,
        limit: response.limit || 10,
        totalPages: response.totalPages || 1,
        users: response.data.map(mapRegistrationToPlayer),
        total: response.total || 0,
        page: response.page || 1,
      } as PlayersResponse;
    },
  });
};

