import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import toast from "react-hot-toast";
import { sendForgotPasswordOTP } from "../../api/authApi";
import forget from "../../../public/images/image/ic-email-inbox.png";
import { ChevronLeftIcon } from "../../icons";

interface Errors {
  email: string;
}

const ForgetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({ email: "" });

  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "" });

    // Client-side validation
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrors({ email: "Invalid email format" });
      return;
    }

    setLoading(true);

    try {
      // API call
      const data = await sendForgotPasswordOTP(email);

      console.log("🟢 API Response:", data);

      toast.success(data.message || "OTP sent successfully!");
      navigate("/verify-OTP", { state: { email, userId: data.userId } });
    } catch (err: any) {
      console.error("🔴 API Error object:", err);

      const message = err.response?.data?.message || "Something went wrong!";
      toast.error(message);

      if (err.response?.data?.errors?.email) {
        setErrors({ email: err.response.data.errors.email });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8 text-center">
            <img src={forget} alt="" className="mb-2 mx-auto" />
            <h1 className="mb-2 text-gray-800 text-[24px] dark:text-white/90 font-bold">
              Forgot your password?
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We've sent a 6-digit confirmation email to your email. Please enter the code in below box to verify your email.
            </p>
          </div>

          <form onSubmit={handleSendOTP}>
            <div className="space-y-6">
              <div>
                <Label>Email <span className="text-error-500">*</span></Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="info@gmail.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="mt-1 text-sm" style={{ color: "#D02030" }}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Button
                  className="w-full"
                  size="sm"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
                <Link
                  to="/"
                  className="text-sm text-brand-500 hover:text-brand-600 font-bold gap-2 mt-5 text-center flex items-center justify-center"
                >
                   <ChevronLeftIcon className=""/>Back To Sign In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgetPasswordForm;
