import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUnallocatedPlayers } from "../api/adminApi";
import { UnallocatedPlayer } from "../types/academy";

const mapUnallocatedToCard = (data: any): UnallocatedPlayer => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const avatar = data.profileImage ? `${baseUrl}/${data.profileImage.replace(/^\/+/, "")}` : `https://ui-avatars.com/api/?name=${data.fullName}`;
  // Extract details based on whatever data we have, e.g., age group and gender
  const details = `${data.gender || "Unknown"}`;

  // Format requested date/time
  const requestedDate = new Date(data.joinedDate || data.createdAt);
  const formattedRequested = `${requestedDate.toLocaleDateString("en-US", { weekday: 'short' })} ${requestedDate.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })}`;

  return {
    id: data._id,
    name: data.fullName,
    avatar,
    details: details,
    rating: data.rating || 0,
    requested: formattedRequested,
    programCode: data.programs && data.programs.length > 0 ? data.programs[0].name.substring(0, 2).toUpperCase() : "AC",
    fullProgramName: data.programs && data.programs.length > 0 ? data.programs[0].name : "N/A",
    categoryName: data.category?.name || "N/A",
    categoryId: data.category?._id || undefined,
    programId: data.programs && data.programs.length > 0 ? data.programs[0]._id : undefined,
    registrationRequestId: data.registrationRequest?._id || undefined,
    paymentStatus: data.paymentStatus || "TRIAL",
    termName: data.registrationRequest?.preferredTerm?.name || undefined,
    preferredClasses: data.registrationRequest?.preferredClasses?.map((c: any) => ({
      id: c._id,
      name: c.name,
      dayOfWeek: c.dayOfWeek,
      startTime: c.startTime,
      endTime: c.endTime,
      location: c.location,
    })) || [],
  };
};

export const useUnallocatedPlayers = (
  category?: string,
  program?: string,
  search?: string,
  page: number = 1,
  limit: number = 5,
  enabled: boolean = true
) => {
  // Coaches do not have access to the admin players/search endpoint
  let isCoach = false;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) isCoach = JSON.parse(userStr)?.role === "COACH";
  } catch { }

  return useQuery({
    queryKey: ["unallocatedPlayers", category, program, search, page, limit],
    queryFn: async () => {
      const response = await getUnallocatedPlayers(category, program, search, page, limit);
      if (response) {
        const players = (response.data || []).map(mapUnallocatedToCard);
        const total = response.pagination?.total ?? response.total ?? players.length;
        const totalPages = response.pagination?.totalPages ?? Math.ceil(total / limit);
        const hasMore = response.pagination?.hasMore ?? (page < totalPages);
        return {
          players,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasMore
          }
        };
      }
      return {
        players: [],
        pagination: { page: 1, limit: 5, total: 0, totalPages: 0, hasMore: false }
      };
    },
    enabled: enabled && !isCoach,
    placeholderData: keepPreviousData,
    initialData: {
      players: [],
      pagination: { page: 1, limit: 5, total: 0, totalPages: 0, hasMore: false }
    },
  });
};
