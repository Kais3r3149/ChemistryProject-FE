import { cn } from "@/lib/utils";
import type { SeverityLevel } from "@/lib/constants";
import { SEVERITY_CONFIG } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity];
  const variantMap: Record<SeverityLevel, "safe" | "warning" | "danger"> = {
    safe: "safe",
    warning: "warning",
    danger: "danger",
  };

  return (
    <Badge variant={variantMap[severity]} className={cn("gap-1", className)}>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}
