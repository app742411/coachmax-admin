import { useMutation, useQuery } from "@tanstack/react-query";
import { generateInvoice, getInvoices, getInvoiceDetails, InvoicePayload } from "../api/invoiceApi";
import toast from "react-hot-toast";

export const useGenerateInvoice = () => {
  return useMutation({
    mutationFn: (payload: InvoicePayload) => generateInvoice(payload),
    onSuccess: (data: any) => {
      // Invalidate relevant queries if necessary, like invoices list
      // queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success(data?.message || "Invoice generated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to generate invoice");
    }
  });
};

export const useInvoices = (search?: string, status?: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["invoices", { search, status, page, limit }],
    queryFn: () => getInvoices({ search, paymentStatus: status, page, limit }),
    placeholderData: (previousData) => previousData, // keep previous data while fetching
  });
};

export const useInvoiceDetails = (id: string) => {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceDetails(id),
    enabled: !!id,
  });
};