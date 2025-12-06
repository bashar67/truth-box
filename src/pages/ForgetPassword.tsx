import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { forgetPasswordSchema } from "@/utils/validationSchemas";
import { CustomInput } from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { ArrowLeft } from "lucide-react";

import { z } from "zod";

type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const onSubmit = async (data: ForgetPasswordFormData) => {
    setLoading(true);
    try {
      await axiosInstance.patch("/auth/forget-password", data);
      toast.success("OTP sent to your email!");
      navigate("/otp-verification", {
        state: { email: data.email, purpose: "reset-password" },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forget Password - TruthBox</title>
        <meta name="description" content="Reset your TruthBox password" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Forgot Password?
            </h1>
            <p className="text-muted-foreground">
              Enter your email to receive a verification code
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-md p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <CustomInput
                {...register("email")}
                type="email"
                label="Email"
                placeholder="Enter your email"
                error={errors.email?.message}
                autoComplete="email"
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader size="sm" /> : "Send OTP"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
