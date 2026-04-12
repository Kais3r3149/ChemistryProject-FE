import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge } from "./severity-badge";
import type { SeverityLevel } from "@/lib/constants";
import { SEVERITY_CONFIG } from "@/lib/constants";

interface InteractionResultCardProps {
  drugA: string;
  drugB: string;
  severity: SeverityLevel;
  description: string;
  confidence: number;
  source: string;
  mechanism?: string;
}

export function InteractionResultCard({
  drugA,
  drugB,
  severity,
  description,
  confidence,
  source,
  mechanism,
}: InteractionResultCardProps) {
  const severityConfig = SEVERITY_CONFIG[severity];

  return (
    <Card className="card-hover overflow-hidden border-border/50">
      {/* Severity top bar */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: severityConfig.hexColor }}
      />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold">
              {drugA}{" "}
              <span className="text-muted-foreground font-normal">×</span>{" "}
              {drugB}
            </CardTitle>
          </div>
          <SeverityBadge severity={severity} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        {mechanism && (
          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-sm">
            <span className="font-semibold text-foreground shrink-0">Mechanism:</span>
            <span className="text-muted-foreground">{mechanism}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">Confidence:</span>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${confidence * 100}%`,
                    backgroundColor: severityConfig.hexColor,
                  }}
                />
              </div>
              <span className="font-medium">{(confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
          <span className="font-medium">{source}</span>
        </div>
      </CardContent>
    </Card>
  );
}
