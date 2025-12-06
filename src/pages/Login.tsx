import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema } from "@/utils/validationSchemas";
import { CustomInput } from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axiosInstance from "@/lib/axios";

import { z } from "zod";
import { Modal } from "@/components/Modal";

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const {
    login,
    user,
    setUser,
    handleRestoreFromFreeze,
    handleRestoreFromDelete,
  } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState<"freeze" | "delete" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      navigate("/messages");
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    const result = await login(data.email, data.password);

    if (result.freezed) {
      setModalType("freeze");
      toast.error(result.message);
      setLoading(false);
      return;
    }
    if (result.deleted) {
      setModalType("delete");
      toast.error(result.message);
      setLoading(false);
      return;
    }

    if (result.success) {
      toast.success("Login successful");
      navigate("/messages");
      setLoading(false);
      return;
    }

    toast.error(result.message);
    setLoading(false);
  };

  const onUnfreezeAccount = async () => {
    setLoading(true);
    try {
      await handleRestoreFromFreeze();
      toast.success("Account restored successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to restore account");
    } finally {
      setLoading(false);
      setModalType(null);
    }
  };

  const onUnDeleteAccount = async () => {
    setLoading(true);
    try {
      await handleRestoreFromDelete();
      toast.success("Account restored successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to restore account");
    } finally {
      setLoading(false);
      setModalType(null);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      if (!credentialResponse?.credential) {
        toast.error("Google login failed: no credential received");
        return;
      }

      const response = await axiosInstance.post("/auth/social-login", {
        idToken: credentialResponse.credential,
      });

      const { credentials, returnedUser } = response.data.data;

      if (!credentials?.accessToken || !credentials?.refreshToken) {
        toast.error("Google login failed: invalid credentials from server");
        return;
      }

      localStorage.setItem("authToken", credentials.accessToken);
      localStorage.setItem("refreshToken", credentials.refreshToken);
      localStorage.setItem("user", JSON.stringify(returnedUser));

      setUser(returnedUser);

      toast.success("Login successful!");
      navigate("/messages");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - TruthBox</title>
        <meta name="description" content="Login to your TruthBox account" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              TruthBox
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Login to continue
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-md p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <CustomInput
                {...register("email")}
                type="email"
                label="Email"
                placeholder="Enter your email"
                error={errors.email?.message}
                autoComplete="email"
              />

              <CustomInput
                {...register("password")}
                type="password"
                label="Password"
                placeholder="Enter your password"
                error={errors.password?.message}
                autoComplete="current-password"
              />

              <div className="flex justify-end">
                <Link
                  to="/forget-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader size="sm" /> : "Login"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google login failed")}
                  useOneTap
                />
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Modal isOpen={modalType !== null} onClose={() => setModalType(null)}>
        <h2 className="text-lg font-bold">
          {modalType === "freeze"
            ? "Account Frozen"
            : " This account is scheduled for deletion "}
        </h2>

        <p className="mt-2">
          {modalType === "freeze"
            ? "If you press continue, your account will be unfrozen."
            : "If you press continue, your account deletion will be cancel."}
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setModalType(null)}>
            Cancel
          </Button>

          <Button
            onClick={
              modalType === "freeze" ? onUnfreezeAccount : onUnDeleteAccount
            }
            disabled={loading}
          >
            {modalType === "freeze" ? "Unfreeze" : "UnDelete"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Login;
