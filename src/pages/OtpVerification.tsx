import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { otpSchema } from "@/utils/validationSchemas";
import { CustomInput } from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

import { z } from "zod";

type OtpFormData = z.infer<typeof otpSchema>;

interface LocationState {
  email?: string;
  purpose?: "signup" | "reset-password";
}

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, purpose } = location.state as LocationState;
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const startTimer = () => {
    setTimer(300);
  };

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (!email || !purpose) {
      navigate("/");
    }
  }, [email, purpose, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OtpFormData) => {
    setLoading(true);
    try {
      if (purpose === "signup") {
        await axiosInstance.patch("/auth/confirm-email", {
          email,
          otp: data.otp,
        });
        toast.success("Your email successfully!");
        navigate("/login", { state: { email } });
        localStorage.removeItem("tempUser");
      } else if (purpose === "reset-password") {
        await axiosInstance.patch("/auth/confirm-reset-password-otp", {
          email,
          otp: data.otp,
        });
        toast.success("OTP verified! Now reset your password.");
        navigate("/reset-password", { state: { email, otp: data.otp } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      await axiosInstance.patch("/auth/forget-password", {
        email,
      });
      toast.success("OTP resent successfully!");
      startTimer();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Verify OTP - TruthBox</title>
        <meta name="description" content="Verify your OTP code" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {purpose === "signup" ? "Confirm Your Email" : "Reset Password"}
            </h1>
            <p className="text-muted-foreground">
              Enter the 6-digit code sent to {email}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-md p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <CustomInput
                {...register("otp")}
                type="text"
                label="OTP Code"
                placeholder="Enter 6-digit code"
                maxLength={6}
                error={errors.otp?.message}
                autoComplete="one-time-code"
                className="text-center text-2xl tracking-widest"
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader size="sm" /> : "Verify OTP"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={resendOtp}
                disabled={loading || timer > 0}
                className={`px-4 py-2 rounded text-white ${
                  timer > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-primary"
                }`}
              >
                {timer > 0
                  ? `Resend in ${Math.floor(timer / 60)}:${String(
                      timer % 60
                    ).padStart(2, "0")}`
                  : "Resend OTP"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
