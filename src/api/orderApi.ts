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

export const getStoreCategories = async () => {
  const response = await apiClient.get("/api/admin/store/categories");
  return response.data;
};

export const getStoreProducts = async (params?: {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
  availabilityStatus?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append("search", params.search);
  if (params?.category) queryParams.append("category", params.category);
  if (params?.status && params.status !== "ALL") queryParams.append("status", params.status);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.availabilityStatus && params.availabilityStatus !== "ALL") {
    queryParams.append("availabilityStatus", params.availabilityStatus);
  }

  const response = await apiClient.get(`/api/admin/store/products?${queryParams.toString()}`);
  return response.data;
};

export const getStoreProductDetails = async (id: string) => {
  const response = await apiClient.get(`/api/admin/store/products/${id}`);
  return response.data;
};

export const createStoreProduct = async (payload: FormData) => {
  const response = await apiClient.post("/api/admin/store/products", payload, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

export const updateStoreProduct = async (id: string, payload: FormData) => {
  const response = await apiClient.patch(`/api/admin/store/products/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

