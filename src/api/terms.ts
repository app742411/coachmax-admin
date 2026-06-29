import apiClient from "./apiClient";

export const getAllTerms = async (): Promise<any> => {
  const res = await apiClient.get("/api/admin/getAllTerms");
  return res.data;
};

export const createTerm = async (data: {
  name: string;
  year: number;
  startDate: string;
  endDate: string;
}): Promise<any> => {
  const res = await apiClient.post("/api/admin/createTerm", data);
  return res.data;
};

export const updateTerm = async (id: string, data: any): Promise<any> => {
  const res = await apiClient.put(`/api/admin/updateTerm/${id}`, data);
  return res.data;
};

export const deleteTerm = async (id: string): Promise<any> => {
  const res = await apiClient.delete(`/api/admin/deleteTerm/${id}`);
  return res.data;
};
