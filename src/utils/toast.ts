import { toast } from "react-hot-toast";

export const successToast = (msg: string) => toast.success(msg);
export const errorToast = (msg: string) => toast.error(msg);
export const warnToast = (msg: string) =>
  toast(msg, {
    icon: "⚠️",
    style: { background: "#fbbf24", color: "#1e293b" },
  });
export const infoToast = (msg: string) => toast(msg, { icon: "ℹ️" });
