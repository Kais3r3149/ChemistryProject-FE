import type { Metadata } from "next";
import { DrugDrugForm } from "@/components/interactions/drug-drug-form";
import { Pill } from "lucide-react";

export const metadata: Metadata = {
  title: "Drug-Drug Interaction",
};

export default function DDIPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Drug-Drug Interaction (DDI)
          </h1>
          <p className="text-muted-foreground">
            Check potential interactions between two drugs. Over 1.4 million
            interaction pairs sourced from DrugBank.
          </p>
        </div>
        <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
          <Pill className="h-5 w-5" />
        </div>
      </div>
      <DrugDrugForm />
    </div>
  );
}
