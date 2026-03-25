import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import toast from "react-hot-toast";
import { resetPassword } from "../../api/authApi";
import { EyeIcon, EyeCloseIcon } from "../../icons";
import lock from "../../../public/images/image/ic-password.png";

interface Errors {
  password?: string;
  confirmPassword?: string;
}

const UpdatePasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {}; // userId passed from OTP verification page

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let tempErrors: Errors = {};

    if (!password) tempErrors.password = "Password is required";
    if (!confirmPassword) tempErrors.confirmPassword = "Confirm Password is required";
    if (password && confirmPassword && password !== confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) return;

    if (!userId) {
        toast.error("Session expired. Please restart the forgot password process.");
        return;
    }

    setLoading(true);
    try {
      const data = await resetPassword(userId, password);
      console.log("Password reset response:", data);

      // Show success popup
      toast.success(data.message || "Password updated successfully!");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err: any) {
      console.error("Password reset error:", err);
      const message = err.response?.data?.message || "Failed to update password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8 text-center">
            <img src={lock} alt="" className="mb-2 mx-auto" />
            <h1 className="mb-2 text-gray-800 text-[24px] dark:text-white/90 font-bold">
                Update your Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                update your password to secure your account.
            </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Password */}
            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={errors.password ? "border-red-500" : ""}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label>
                Confirm Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              className="w-full"
              size="sm"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePasswordForm;
