import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { changePasswordSchema } from "@/utils/validationSchemas";
import { CustomInput } from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import axiosInstance from "@/lib/axios";
import { ArrowLeft, Lock } from "lucide-react";
import { z } from "zod";

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setLoading(true);
    try {
      await axiosInstance.patch("/auth/update-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully!");
      reset();
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Change Password - TruthBox</title>
        <meta name="description" content="Update your account password" />
      </Helmet>

      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Button>

          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Change Password
                </h1>
                <p className="text-sm text-muted-foreground">
                  Update your account password
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <CustomInput
                {...register("oldPassword")}
                type="password"
                label="Current Password"
                placeholder="Enter current password"
                error={errors.oldPassword?.message}
                autoComplete="current-password"
              />

              <CustomInput
                {...register("newPassword")}
                type="password"
                label="New Password"
                placeholder="Enter new password (min 8 characters)"
                error={errors.newPassword?.message}
                autoComplete="new-password"
              />

              <CustomInput
                {...register("confirmNewPassword")}
                type="password"
                label="Confirm New Password"
                placeholder="Re-enter new password"
                error={errors.confirmNewPassword?.message}
                autoComplete="new-password"
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader size="sm" /> : "Change Password"}
              </Button>
            </form>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default ChangePassword;
