import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useForgotPassword } from "../../hooks/useAuth";
import { ForgotPasswordRequest } from "../../types/auth";

export default function ForgotPasswordForm() {
  const { mutate: forgotPasswordMutate, isPending, error: apiError } = useForgotPassword();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>();

  // Countdown timer logic
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const sendLink = (email: string) => {
    forgotPasswordMutate(
      { email },
      {
        onSuccess: (response) => {
          setSuccessMessage(response.message || "A password reset link has been sent to your email.");
          setTimer(60); // Start 1-minute timer
        },
      }
    );
  };

  const onSubmit = (data: ForgotPasswordRequest) => {
    sendLink(data.email);
  };

  const handleResend = () => {
    const email = getValues("email");
    if (email) {
      sendLink(email);
    }
  };

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
              Forgot Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email address to receive a link to reset your password.
            </p>
          </div>
          <div>
            {apiError && (
              <div className="mb-4 p-3 bg-error-500/10 border border-error-500/20 text-error-500 rounded-lg text-sm">
                {apiError.message || "Failed to send reset link. Please check your email and try again."}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    type="email"
                    placeholder="info@gmail.com"
                    error={!!errors.email}
                    hint={errors.email?.message}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </div>
                <div>
                  {timer > 0 ? (
                    <Button
                      type="button"
                      onClick={handleResend}
                      className="w-full"
                      size="sm"
                      disabled={true}
                    >
                      Resend link in {timer}s
                    </Button>
                  ) : (
                    <Button type="submit" className="w-full" size="sm" disabled={isPending}>
                      {isPending ? "Sending..." : successMessage ? "Resend Link" : "Send Reset Link"}
                    </Button>
                  )}
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Remember your password?{" "}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
