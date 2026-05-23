import type { Metadata } from "next";
import { ProteinProteinForm } from "@/components/interactions/protein-protein-form";

export const metadata: Metadata = {
  title: "Protein-Protein Interaction",
};

export default function PPIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Protein-Protein Interaction (PPI)
        </h1>
        <p className="text-muted-foreground mt-1">
          Analyze protein-protein interactions using curated TDC datasets.
        </p>
      </div>
      <ProteinProteinForm />
    </div>
  );
}
