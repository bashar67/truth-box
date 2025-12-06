// src/components/UserDropdown.tsx
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.[0]}${user.lastName?.[0]}`.toUpperCase();
  };

  const handleProfile = () => {
    navigate("/dashboard");
    onClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-4 z-50 w-64 bg-card border border-border rounded-xl shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            {user?.profileImage ? (
              <AvatarImage src={user.profileImage} alt={getInitials()} />
            ) : (
              <AvatarFallback>{getInitials()}</AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Menu Options */}
      <div className="p-2">
        <Button
          variant="ghost"
          className="w-full justify-start h-10 px-3 rounded-lg hover:bg-accent"
          onClick={handleProfile}
        >
          <Settings className="mr-3 h-4 w-4 shrink-0" />
          Profile Settings
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start h-10 px-3 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4 shrink-0" />
          Logout
        </Button>
      </div>
    </div>
  );
};
