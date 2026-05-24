import type { Metadata } from "next";
import { Dna, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Gene-Disease Association",
};

export default function GeneDiseaseePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Gene-Disease Association (GDA)
        </h1>
        <p className="text-muted-foreground mt-1">
          Search associations between genes and diseases.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-card py-20 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-5">
          <Dna className="h-7 w-7 text-muted-foreground/60" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Coming soon
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          Gene-Disease Association data is being integrated from DisGeNET.
          This feature will be available in a future update.
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground/60">
          <Clock className="h-3.5 w-3.5" />
          Planned: DisGeNET integration
        </div>
      </div>
    </div>
  );
}
