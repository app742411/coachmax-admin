import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllocatedPlayers } from "../api/adminApi";
import { UnallocatedPlayer } from "../types/academy";

const mapAllocatedToCard = (data: any): UnallocatedPlayer => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const avatar = data.profileImage ? `${baseUrl}/${data.profileImage.replace(/^\/+/, "")}` : `https://ui-avatars.com/api/?name=${data.fullName}`;
  const details = `${data.gender || "Unknown"}`;

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
  };
};

export const useAllocatedPlayers = (
  category?: string,
  program?: string,
  search?: string,
  page: number = 1,
  limit: number = 5,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["allocatedPlayers", category, program, search, page, limit],
    queryFn: async () => {
      const response = await getAllocatedPlayers(category, program, search, page, limit);
      if (response) {
        const players = (response.data || []).map(mapAllocatedToCard);
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
    enabled,
    placeholderData: keepPreviousData,
    initialData: {
      players: [],
      pagination: { page: 1, limit: 5, total: 0, totalPages: 0, hasMore: false }
    },
  });
};
