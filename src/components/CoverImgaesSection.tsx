import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Loader } from "@/components/Loader";

const CoverImageSection = () => {
  const {
    user,
    fetchUser,
    handleCoverUpload,
    setCoverModalOpen,
    coverModalOpen,
    coverUploading,
  } = useAuth();

  const [selectedCoverIndex, setSelectedCoverIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return <Loader size="lg" />;

  // ---- When user selects a cover image ----
  const handleSelectCover = (index: number) => {
    setSelectedCoverIndex(index);
    setCoverModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4 relative group w-full">
      {/* --- Main Cover Image Area --- */}
      <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden relative">
        <img
          src={user.coverImages?.[selectedCoverIndex] || "/no-cover.jpg"}
          alt="Cover"
          className="w-full h-full object-cover"
        />

        {/* Hover Change Button */}
        <Button
          className="absolute top-2 right-2 text-xs opacity-0 group-hover:opacity-100 transition"
          onClick={() => setCoverModalOpen(true)}
        >
          Change
        </Button>
      </div>

      {/* Modal for choosing or uploading covers */}
      <Modal
        isOpen={coverModalOpen}
        onClose={() => setCoverModalOpen(false)}
        title="Choose Cover Image"
      >
        {/* My Images */}
        <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto mb-4">
          {user.coverImages?.map((img, index) => (
            <div
              key={index}
              onClick={() => handleSelectCover(index)}
              className="cursor-pointer border rounded-lg overflow-hidden hover:opacity-80 transition"
            >
              <img src={img} className="w-full h-20 object-cover" />
            </div>
          ))}
        </div>

        {/* Upload Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={coverUploading}
          >
            {coverUploading ? <Loader size="sm" /> : "Upload New Image"}
          </Button>
        </div>

        <input
          type="file"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => handleCoverUpload(e.target.files, "coverImages")}
        />
      </Modal>
    </div>
  );
};

export default CoverImageSection;
