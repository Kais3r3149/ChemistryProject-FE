"use client";

import Link from "next/link";
import { usePathname } from "@/i18n/navigation";
import { ChevronsLeft, ChevronsRight, Pill } from "lucide-react";
import { useTranslations } from "next-intl";
import { DASHBOARD_NAV, APP_NAME } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function DashboardSidebar({ collapsed = false, onToggleCollapse }: DashboardSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 relative",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm shadow-primary-500/20">
            <Pill className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground truncate">
              {APP_NAME}
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {DASHBOARD_NAV.map((group, groupIndex) => (
            <div key={group.labelKey} className={cn(groupIndex > 0 && "mt-5")}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {t(group.labelKey as Parameters<typeof t>[0])}
                </p>
              )}
              {collapsed && groupIndex > 0 && (
                <Separator className="mx-auto mb-3 w-8 opacity-50" />
              )}
              <ul className="space-y-0.5">
                {group.items.filter(item => item.badge !== "Soon").map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  const linkContent = (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                        isActive
                          ? "bg-primary-100/70 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800/60"
                          : "text-sidebar-foreground/60 border border-transparent hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground"
                      )} />
                      {!collapsed && (
                        <>
                          <span className="truncate flex-1">{t(item.titleKey as Parameters<typeof t>[0])}</span>
                          {item.badge && (
                            <span className="ml-auto shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground/70">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <li key={item.href}>
                        <Tooltip>
                          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                          <TooltipContent side="right" className="font-medium">
                            {t(item.titleKey as Parameters<typeof t>[0])}
                          </TooltipContent>
                        </Tooltip>
                      </li>
                    );
                  }

                  return <li key={item.href}>{linkContent}</li>;
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        {onToggleCollapse && (
          <div className="border-t border-sidebar-border p-2">
            <button
              onClick={onToggleCollapse}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronsRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronsLeft className="h-4 w-4" />
                  <span>{t("collapse")}</span>
                </>
              )}
            </button>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
