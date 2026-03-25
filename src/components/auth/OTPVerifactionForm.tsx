import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import Button from "../ui/button/Button";
import toast from "react-hot-toast";
import { verifyOTP, resendOTP } from "../../api/authApi";
import code from "../../../public/images/image/ic-email-sent.png";

const OTPVerificationForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, userId } = location.state || {};

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // Handle input change
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
    // focus previous if empty
    if (!value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle OTP submit
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpStr = otp.join("");
    if (otpStr.length < 6) {
      setErrors("OTP must be 6 digits");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please restart the process.");
      return;
    }

    setLoading(true);
    setErrors("");
    console.log("🟡 Verifying OTP:", { email, otp: otpStr });

    try {
      const data = await verifyOTP(userId, email, otpStr);
      console.log("🟢 OTP Verify Response:", data);

      toast.success(data.message || "OTP verified successfully!");

      // Pass userId to update-password page
      navigate("/update-password", { state: { userId } });
    } catch (err: any) {
      console.error("🔴 OTP Verify Error:", err);
      const message = err.response?.data?.message || "Invalid OTP!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    if (!email) return;
    setResendLoading(true);
    setTimer(30);
    try {
      const data = await resendOTP(email);
      toast.success(data.message || "OTP resent successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend OTP!");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        
        <div className="mb-5 sm:mb-8 text-center">
            <img src={code} alt="" className="mb-2 mx-auto" />
            <h1 className="mb-2 text-gray-800 text-[24px] dark:text-white/90 font-bold">
                Please check your email!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter the 6-digit OTP sent to <strong>{email}</strong>
            </p>
        </div>

        <form onSubmit={handleVerifyOTP}>
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                className="w-12 h-12 text-center border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            ))}
          </div>
          {errors && (
            <p className="mb-2 text-sm text-red-600 dark:text-red-400">{errors}</p>
          )}

          <Button
            className="w-full mb-2"
            type="submit"
            size="sm"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              className="text-brand-700 hover:text-brand-800 mt-3 cursor-pointer font-bold text-sm bg-transparent border-none"
              disabled={timer > 0 || resendLoading}
              onClick={handleResendOTP}
            >
              {resendLoading
                ? "Resending..."
                : timer > 0
                ? `Resend OTP in ${timer}s`
                : "Resend OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OTPVerificationForm;
