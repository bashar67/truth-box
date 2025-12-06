import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { signupSchema } from "@/utils/validationSchemas";
import { CustomInput } from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axiosInstance from "@/lib/axios";

import { z } from "zod";

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      gender: "male",
    },
  });

  useEffect(() => {
    if (user) {
      navigate("/messages");
    }
  }, [user, navigate]);

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      await signup(data);
      toast.success("Account created successfully! Please verify your email.");
      navigate("/otp-verification", {
        state: { email: data.email, purpose: "signup" },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      const { token, user: userData } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success("Account created successfully!");
      navigate("/messages");
    } catch (error) {
      toast.error("Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - TruthBox</title>
        <meta name="description" content="Create your TruthBox account" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              TruthBox
            </h1>
            <p className="text-muted-foreground">Create your account</p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-md p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  {...register("firstName")}
                  type="text"
                  label="First Name"
                  placeholder="John"
                  error={errors.firstName?.message}
                  autoComplete="given-name"
                />

                <CustomInput
                  {...register("lastName")}
                  type="text"
                  label="Last Name"
                  placeholder="Doe"
                  error={errors.lastName?.message}
                  autoComplete="family-name"
                />
              </div>

              <CustomInput
                {...register("email")}
                type="email"
                label="Email"
                placeholder="john@example.com"
                error={errors.email?.message}
                autoComplete="email"
              />

              <CustomInput
                {...register("phone")}
                type="text"
                label="Phone Number"
                placeholder="+021038292442"
                error={errors.phone?.message}
                autoComplete="phone"
              />

              <CustomSelect
                {...register("gender")}
                label="Gender"
                options={[
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                ]}
                error={errors.gender?.message}
              />

              <CustomInput
                {...register("password")}
                type="password"
                label="Password"
                placeholder="Min 8 characters"
                error={errors.password?.message}
                autoComplete="new-password"
              />

              <CustomInput
                {...register("confirmPassword")}
                type="password"
                label="Confirm Password"
                placeholder="Re-enter password"
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader size="sm" /> : "Sign Up"}
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
                  onError={() => toast.error("Google signup failed")}
                />
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
