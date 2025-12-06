import { useState, useRef } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { Loader } from "@/components/Loader";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

const ProfileImageSection = () => {
  const {
    user,
    fetchUser,
    handleUpload,
    profileUploading,
    profileModalOpen,
    setProfileModalOpen,
  } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  return (
    <>
      {/* Profile Image */}
      <div
        className="relative cursor-pointer group"
        onClick={() => setProfileModalOpen(true)}
      >
        <img
          src={user.profileImage || "/default-profile.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover shadow-md"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <p className="text-white text-sm">View</p>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Your Profile Image"
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Large Image */}
          <img
            src={user.profileImage || "/default-profile.png"}
            alt="Profile Big"
            className="w-48 h-48 rounded-full object-cover shadow-lg"
          />

          {/* Upload Button */}
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={profileUploading}
          >
            {profileUploading ? <Loader size="sm" /> : "Upload New Image"}
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleUpload(e.target.files, "profileImage")}
          />
        </div>
      </Modal>
    </>
  );
};

export default ProfileImageSection;
