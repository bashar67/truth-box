import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";

interface User {
  email: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  profileImage?: string;
  coverImages?: string[];
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [coverModalOpen, setCoverModalOpen] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      //   const token = localStorage.getItem("authToken");
      //   const storedUser = localStorage.getItem("user");

      //   if (token && storedUser) {
      //     try {
      //       setUser(JSON.parse(storedUser));
      //     } catch (error) {
      //       localStorage.removeItem("authToken");
      //       localStorage.removeItem("refreshToken");
      //       localStorage.removeItem("user");
      //     }
      //   }
      //   setLoading(false);
      // };

      //*----- Fetch user from  dummy data for dev  -----*
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // ---------------- Auth Functions ----------------
  const login = async (email: string, password: string) => {
    const response = await axiosInstance
      .post("/auth/login", { email, password })
      .catch((error) => error.response);

    if (response?.status === 403) {
      const message = response?.data?.message;
      const restoreToken = response.data.data?.accessToken;

      if (
        message === "Account is freezed Please unfreeze it or contact support"
      ) {
        if (restoreToken) {
          localStorage.setItem("authToken", restoreToken);
        }

        return {
          success: false,
          freezed: true,
          deleted: false,
          message,
        };
      }

      if (message === "This account is scheduled for deletion") {
        if (restoreToken) {
          localStorage.setItem("authToken", restoreToken);
        }
        return {
          success: false,
          freezed: false,
          deleted: true,
          message,
        };
      }

      return {
        success: false,
        freezed: false,
        deleted: false,
        message,
      };
    }

    if (response?.status === 200) {
      const accessToken = response.data.data.credentials.accessToken;
      const refreshToken = response.data.data.credentials.refreshToken;
      const user = response.data.data.user;

      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          firstName: user.firstName || "User",
          lastName: user.lastName || "",
          gender: user.gender || "MALE",
        })
      );
      fetchUser();
      return { success: true };
    }

    return {
      success: false,
      freezed: false,
      message: response?.data?.message || "Login failed",
    };
  };

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/user/profile");
      const serverUser = response.data.data.userProfile;
      if (!serverUser) throw new Error("User data not found");

      const userData: User = {
        ...serverUser,
        firstName: serverUser?.firstName || "User",
        lastName: serverUser?.lastName || "",
        gender: serverUser?.gender || "MALE",
        phone: serverUser?.phone || "",
        profileImage: serverUser.cloudProfileImage || "/default-profile.png",
        coverImages: serverUser.cloudCoverImages || [],
      };

      setUser(userData);
      return userData;
    } catch (error) {
      console.error("fetchUser error:", error.message || error);
    }
  };

  const signup = async (data) => {
    const response = await axiosInstance.post("/auth/signup", data);
    const { user: userData } = response.data;
    localStorage.setItem("tempUser", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/revoke-token");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  // ---------------- User functions ----------------
  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // upload handler
  const handleUpload = async (files: FileList | null, uploadType: string) => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append(uploadType, files[0]);

    try {
      setProfileUploading(true);

      await axiosInstance.patch("/user/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile image updated!");
      await fetchUser();
      setProfileModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload");
    } finally {
      setProfileUploading(false);
    }
  };

  // ---- Upload New Images ----
  const handleCoverUpload = async (
    files: FileList | null,
    uploadType: string
  ) => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append(uploadType, file));

    try {
      setCoverUploading(true);
      await axiosInstance.patch("/user/cover-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Cover images uploaded!");
      await fetchUser();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed!");
    } finally {
      setCoverUploading(false);
    }
  };

  const handleRestoreFromFreeze = async () => {
    await axiosInstance.patch("/user/restore-freezed-account");
  };

  const handleRestoreFromDelete = async () => {
    await axiosInstance.patch("/user/restore-deleted-account");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchUser,
        login,
        signup,
        logout,
        updateUser,
        handleUpload,
        handleCoverUpload,
        coverUploading,
        profileUploading,
        coverModalOpen,
        setCoverModalOpen,
        profileModalOpen,
        setProfileModalOpen,
        handleRestoreFromFreeze,
        handleRestoreFromDelete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
