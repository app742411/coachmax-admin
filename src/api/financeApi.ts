import apiClient from "./apiClient";

export interface BankDetailsData {
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  iban?: string;
  swiftCode?: string;
  branch?: string;
  instructions?: string;
  isActive?: boolean | string;
  qrCodeImage?: File | null;
}

export const getBankDetails = async () => {
  const response = await apiClient.get("/api/admin/bank-details");
  return response.data;
};

export const updateBankDetails = async (data: BankDetailsData) => {
  const formData = new FormData();
  if (data.accountName) formData.append("accountName", data.accountName);
  if (data.accountNumber) formData.append("accountNumber", data.accountNumber);
  if (data.bankName) formData.append("bankName", data.bankName);
  if (data.iban) formData.append("iban", data.iban);
  if (data.swiftCode) formData.append("swiftCode", data.swiftCode);
  if (data.branch) formData.append("branch", data.branch);
  if (data.instructions) formData.append("instructions", data.instructions);
  if (data.isActive !== undefined) formData.append("isActive", String(data.isActive));

  if (data.qrCodeImage) {
    formData.append("qrCodeImage", data.qrCodeImage);
  }

  const response = await apiClient.post("/api/admin/bank-details", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};