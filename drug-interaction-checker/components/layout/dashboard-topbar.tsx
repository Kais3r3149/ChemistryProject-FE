"use client";

import { Menu, Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DashboardTopbarProps {
  onToggleSidebar?: () => void;
}

export function DashboardTopbar({ onToggleSidebar }: DashboardTopbarProps) {
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

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search drugs, targets, genes..."
            className="pl-9 h-10 bg-muted/50 border-transparent hover:border-border focus-visible:border-border focus-visible:bg-background transition-colors"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 ml-auto">
        <Button variant="ghost" size="icon" className="rounded-lg relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {/* Notification dot */}
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary-500 ring-2 ring-card" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-lg" aria-label="User profile">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-xs font-bold text-white">
            U
          </div>
        </Button>
      </div>
    </header>
  );
}
