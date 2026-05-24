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
          Search protein-protein interactions from the HuRI dataset (52,548 pairs).
        </p>
      </div>
      <ProteinProteinForm />
    </div>
  );
}
