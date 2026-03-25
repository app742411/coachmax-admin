// src/api/sponsorApi.ts
import apiClient from "./apiClient";
import ENDPOINTS from "./endpoints";

export interface Sponsor {
  _id: string;
  title: string;
  subtitle: string;
  link: string;
  image: string;
  isActive?: string | boolean | any;
}

export const createSponsor = async (formData: FormData): Promise<any> => {
  const res = await apiClient.post(ENDPOINTS.CREATE_SPONSOR, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateSponsor = async (id: string, formData: FormData): Promise<any> => {
  const res = await apiClient.put(`${ENDPOINTS.UPDATE_SPONSOR}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getAllSponsors = async (): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.GET_ALL_SPONSORS);
  return res.data;
};

export const deleteSponsor = async (id: string): Promise<any> => {
  const res = await apiClient.delete(`${ENDPOINTS.DELETE_SPONSOR}/${id}`);
  return res.data;
};

export const toggleBannerStatus = async (id: string): Promise<any> => {
  const res = await apiClient.patch(`${ENDPOINTS.TOGGLE_BANNER_STATUS}/${id}`);
  return res.data;
};
