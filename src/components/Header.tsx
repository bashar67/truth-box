// src/components/Header.tsx
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDropdown } from "./UserDropdown";

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.[0]}${user.lastName?.[0]}`.toUpperCase();
  };

  // ✅ Click outside to close
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".fixed.top-16.right-4") &&
        !target.closest('button[aria-label="User menu"]')
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-primary bg-clip-text text-transparent text-2xl font-bold">
            TruthBox
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/messages")}
            aria-label="Messages"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          {/* ✅ User Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-muted transition-colors"
            aria-label="User menu"
          >
            <Avatar className="h-8 w-8">
              {user?.profileImage ? (
                <AvatarImage src={user.profileImage} alt={getInitials()} />
              ) : (
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
          </button>
        </div>
      </div>

      {/* ✅ UserDropdown Component */}
      <UserDropdown
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
      />
    </header>
  );
};
