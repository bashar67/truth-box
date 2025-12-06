import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/layouts/MainLayout";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";
import { Modal } from "@/components/Modal";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  updateProfileSchema,
  confirmPasswordSchema,
} from "@/utils/validationSchemas";
import { Settings, Lock, Trash2, UserX } from "lucide-react";
import { type } from "os";
import { z } from "zod";
import CoverImageSection from "@/components/CoverImgaesSection";
import ProfileImageSection from "@/components/ProfileImage";
import { useNavigate } from "react-router-dom";

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
type ConfirmPasswordFormData = z.infer<typeof confirmPasswordSchema>;

const Dashboard = () => {
  const { user, fetchUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [freezeModalOpen, setFreezeModalOpen] = useState(false);

  // ---------------- Profile Form ----------------
  const {
    register: registerProfile,
    reset: resetProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      gender: user?.gender || "MALE",
      phone: user?.phone || "",
    },
  });

  // ---------------- Delete Form ----------------
  const {
    register: registerDelete,
    handleSubmit: handleDeleteSubmit,
    reset: resetDelete,
  } = useForm<ConfirmPasswordFormData>({
    resolver: zodResolver(confirmPasswordSchema),
  });

  // ---------------- Freeze Form ----------------
  const {
    register: registerFreeze,
    handleSubmit: handleFreezeSubmit,
    reset: resetFreeze,
  } = useForm<ConfirmPasswordFormData>({
    resolver: zodResolver(confirmPasswordSchema),
  });

  useEffect(() => {
    const loadUser = async () => {
      // const serverUser = await fetchUser();
      const serverUser = user;
      if (serverUser) {
        resetProfile({
          firstName: serverUser.firstName || "",
          lastName: serverUser.lastName || "",
          gender: serverUser.gender || "MALE",
          phone: serverUser.phone || "",
        });
      }
    };

    loadUser();
  }, []);

  // ---------------- Handlers ----------------
  const onProfileUpdate = async (data: UpdateProfileFormData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch("/user/update", data);
      toast.success("Profile updated successfully!");
      fetchUser();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const onDeleteAccount = async (data: ConfirmPasswordFormData) => {
    setLoading(true);
    try {
      await axiosInstance.patch("/user/delete-account", {
        data: { password: data.password },
      });
      toast.success("Account deleted successfully");
      await logout();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
      resetDelete();
    }
  };

  const onFreezeAccount = async (data: ConfirmPasswordFormData) => {
    setLoading(true);
    try {
      await axiosInstance.patch("/user/freeze-account", {
        password: data.password,
      });
      toast.success("Account frozen successfully");
      await logout();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to freeze account");
    } finally {
      setLoading(false);
      setFreezeModalOpen(false);
      resetFreeze();
    }
  };

  if (!user) return <Loader size="lg" />;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto grid grid-cols-2 gap-8">
        {/* Left side: Cover + Profile */}
        <div className="flex flex-col items-center space-y-4">
          {/* Cover Image */}
          <CoverImageSection />

          {/* Profile Image */}
          <ProfileImageSection />

          {/* Email */}
          <p className="text-center font-medium mt-1">{user.email}</p>
        </div>

        {/* Right side: Info + Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Profile Info
          </h2>

          <form
            onSubmit={handleProfileSubmit(onProfileUpdate)}
            className="space-y-4"
          >
            <CustomInput
              {...registerProfile("firstName")}
              type="text"
              label="First Name"
              error={profileErrors.firstName?.message}
            />
            <CustomInput
              {...registerProfile("lastName")}
              type="text"
              label="Last Name"
              error={profileErrors.lastName?.message}
            />
            <CustomInput
              {...registerProfile("gender")}
              label="Gender"
              type="text"
              error={profileErrors.gender?.message}
            />
            <CustomInput
              {...registerProfile("phone")}
              type="text"
              label="Phone"
              error={profileErrors.phone?.message}
            />
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader size="sm" /> : "Update Profile"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/change-password")}
              >
                Change Password
              </Button>
            </div>
          </form>

          {/* Security Actions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => setFreezeModalOpen(true)}
              className="w-full justify-start border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <UserX className="mr-2 h-4 w-4" /> Freeze Account
            </Button>

            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(true)}
              className="w-full justify-start border-destructive text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Account"
      >
        <p className="text-muted-foreground mb-4">
          This action cannot be undone. Please enter your password to confirm.
        </p>
        <form
          onSubmit={handleDeleteSubmit(onDeleteAccount)}
          className="space-y-4"
        >
          <CustomInput
            {...registerDelete("password")}
            type="password"
            label="Password"
            placeholder="Enter your password"
          />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading}
              className="flex-1"
            >
              {loading ? <Loader size="sm" /> : "Delete Account"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Freeze Modal */}
      <Modal
        isOpen={freezeModalOpen}
        onClose={() => setFreezeModalOpen(false)}
        title="Freeze Account"
      >
        <p className="text-muted-foreground mb-4">
          Your account will be temporarily frozen. Enter your password to
          confirm.
        </p>
        <form
          onSubmit={handleFreezeSubmit(onFreezeAccount)}
          className="space-y-4"
        >
          <CustomInput
            {...registerFreeze("password")}
            type="password"
            label="Password"
            placeholder="Enter your password"
          />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFreezeModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading}
              className="flex-1"
            >
              {loading ? <Loader size="sm" /> : "Freeze Account"}
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default Dashboard;
