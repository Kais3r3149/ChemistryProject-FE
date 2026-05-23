import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge } from "./severity-badge";
import type { SeverityLevel } from "@/lib/constants";
import { SEVERITY_CONFIG } from "@/lib/constants";

interface InteractionResultCardProps {
  drugA: string;
  drugB: string;
  severity: SeverityLevel;
  description: string;
  source: string;
}

export function InteractionResultCard({
  drugA,
  drugB,
  severity,
  description,
  source,
}: InteractionResultCardProps) {
  const severityConfig = SEVERITY_CONFIG[severity];

  return (
    <Card className={`card-hover overflow-hidden transition-colors ${severityConfig.borderColor} border`}>
      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-sm font-semibold text-foreground leading-snug">
            {drugA}{" "}
            <span className="text-muted-foreground/60 font-normal mx-0.5">+</span>{" "}
            {drugB}
          </CardTitle>
          <SeverityBadge severity={severity} />
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4 space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <p className="text-xs text-muted-foreground/60 pt-1 border-t border-border/40">{source}</p>
      </CardContent>
    </Card>
  );
}
