import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { getBankDetails, updateBankDetails, BankDetailsData } from "../../api/financeApi";
import toast from "react-hot-toast";
import PaymentSettings from "../../components/finance/PaymentSettings";


export default function BankDetails() {
  const [formData, setFormData] = useState<BankDetailsData>({
    accountName: "",
    accountNumber: "",
    bankName: "",
    iban: "",
    swiftCode: "",
    branch: "",
    instructions: "",
    isActive: true,
    qrCodeImage: null,
  });
  const [existingQrUrl, setExistingQrUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getBankDetails();
        if (data && data.data) {
          const bd = Array.isArray(data.data) ? data.data[0] : data.data;
          if (bd) {
            setFormData({
              accountName: bd.accountName || "",
              accountNumber: bd.accountNumber || "",
              bankName: bd.bankName || "",
              iban: bd.iban || "",
              swiftCode: bd.swiftCode || "",
              branch: bd.branch || "",
              instructions: bd.instructions || "",
              isActive: bd.isActive ?? true,
              qrCodeImage: null,
            });
            if (bd.qrCodeImage) {
              setExistingQrUrl(bd.qrCodeImage);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch bank details", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setFormData((prev) => ({ ...prev, qrCodeImage: files[0] }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateBankDetails(formData);
      toast.success("Bank details updated successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update bank details");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-sm text-slate-500">Loading...</div>;
  }

  return (
    <>
      <PageMeta title="CoachMax | Bank Details" description="Manage Bank Details" />
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Bank Details" items={[{ name: "Finance", path: "/finance" }]} />
        <PaymentSettings />
        <div className="rounded-none border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Account Name</label>
                <input type="text" name="accountName" value={formData.accountName} onChange={handleChange} className="w-full rounded-none border border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Account Number</label>
                <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="w-full rounded-none border border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Bank Name</label>
                <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="w-full rounded-none border border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">IBAN</label>
                <input type="text" name="iban" value={formData.iban} onChange={handleChange} className="w-full rounded-none border border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Swift Code</label>
                <input type="text" name="swiftCode" value={formData.swiftCode} onChange={handleChange} className="w-full rounded-none border border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Branch</label>
                <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-full rounded-none border border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Instructions</label>
                <textarea name="instructions" value={formData.instructions} onChange={handleChange} rows={3} className="w-full rounded-none border border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900"></textarea>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">QR Code Image</label>
                <input type="file" name="qrCodeImage" accept="image/*" onChange={handleChange} className="w-full rounded-none border border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900" />
                {existingQrUrl && <img src={`${import.meta.env.VITE_API_BASE_URL}/${existingQrUrl}`} alt="QR Code" className="mt-2 h-20 object-cover" />}
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" disabled={isSubmitting} className="rounded-none bg-brand-500 px-6 py-3 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none disabled:opacity-50">
                {isSubmitting ? "Saving..." : "Save Bank Details"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}