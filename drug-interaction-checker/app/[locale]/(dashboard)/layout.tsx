"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { getToken, isTokenExpired, clearToken } from "@/lib/api";
import { DisclaimerBanner } from "@/components/layout/disclaimer-banner";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const token = getToken();
    if (!token || isTokenExpired()) {
      clearToken();
      router.replace("/login");
    } else {
      setIsAuthed(true);
    }
  }, [router]);

  // Periodically check token expiry every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTokenExpired()) {
        clearToken();
        router.replace("/login");
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [router]);

  if (!isAuthed) return null;

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(true);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="flex h-dvh">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        />
      </div>

      {/* Mobile sidebar */}
      <MobileSidebar
        open={mobileSidebarOpen}
        onOpenChange={setMobileSidebarOpen}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardTopbar onToggleSidebar={handleToggleSidebar} />
        <DisclaimerBanner />
        <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
