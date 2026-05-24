"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Menu, LogOut } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "@/components/ui/button";
import { getToken, clearToken } from "@/lib/api";

interface DashboardTopbarProps {
  onToggleSidebar?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getUserFromToken(): { email: string; fullName?: string } | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { email: payload.email as string };
  } catch {
    return null;
  }
}

export function DashboardTopbar({ onToggleSidebar }: DashboardTopbarProps) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const user = getUserFromToken();
    if (user) Promise.resolve().then(() => setUserEmail(user.email));
  }, []);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  const initials = userEmail ? getInitials(userEmail.split("@")[0]) : "U";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/40 bg-card/80 backdrop-blur-xl px-4 sm:px-6">
      {/* Sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 rounded-lg"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side: language + user + logout */}
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        {userEmail && (
          <span className="hidden sm:block text-sm text-muted-foreground truncate max-w-[160px]">
            {userEmail}
          </span>
        )}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-xs font-bold text-white select-none">
          {initials}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
