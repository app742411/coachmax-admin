import apiClient from "./apiClient";

export const getOrders = async (params?: { search?: string; status?: string; page?: number; limit?: number }) => {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append("search", params.search);
  if (params?.status && params.status !== "ALL") queryParams.append("status", params.status);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const response = await apiClient.get(`/api/admin/store/orders?${queryParams.toString()}`);
  return response.data;
};

export const getOrderDetails = async (id: string) => {
  const response = await apiClient.get(`/api/admin/store/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id: string, data: { status?: string; paymentStatus?: string }) => {
  const response = await apiClient.patch(`/api/admin/store/orders/${id}`, data);
  return response.data;
};
