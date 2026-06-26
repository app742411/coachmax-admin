import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useResetPassword } from "../../hooks/useAuth";

interface ResetPasswordFormValues {
  token: string;
  password?: string;
  confirmPassword?: string;
}

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: resetPasswordMutate, isPending, error: apiError } = useResetPassword();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tokenMissing, setTokenMissing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setValue("token", tokenParam);
      setTokenMissing(false);
    } else {
      setTokenMissing(true);
    }
  }, [searchParams, setValue]);

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPasswordMutate(
      {
        token: data.token,
        password: data.password,
      },
      {
        onSuccess: (response) => {
          setSuccessMessage(response.message || "Password has been reset successfully!");
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        },
      }
    );
  };

  const password = watch("password");

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to Sign In
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please enter your new password below.
            </p>
          </div>
          <div>
            {tokenMissing && (
              <div className="mb-4 p-3 bg-error-500/10 border border-error-500/20 text-error-500 rounded-lg text-sm">
                Warning: No reset token found in URL. Please make sure you clicked the link from your email correctly.
              </div>
            )}

            {apiError && (
              <div className="mb-4 p-3 bg-error-500/10 border border-error-500/20 text-error-500 rounded-lg text-sm">
                {apiError.message || "Failed to reset password. Please request a new reset link."}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <input type="hidden" {...register("token", { required: "Reset token is missing" })} />

                <div>
                  <Label>
                    New Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      error={!!errors.password}
                      hint={errors.password?.message}
                      {...register("password", {
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/3"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <Label>
                    Confirm New Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      error={!!errors.confirmPassword}
                      hint={errors.confirmPassword?.message}
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/3"
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <Button type="submit" className="w-full" size="sm" disabled={isPending || tokenMissing}>
                    {isPending ? "Resetting..." : "Reset Password"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
