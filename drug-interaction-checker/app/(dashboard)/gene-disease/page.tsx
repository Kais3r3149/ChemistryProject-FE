import type { Metadata } from "next";
import { GDASearchForm } from "@/components/gene-disease/gda-search-form";

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
          Explore associations between genes and diseases using curated TDC
          datasets.
        </p>
      </div>
      <GDASearchForm />
    </div>
  );
}
