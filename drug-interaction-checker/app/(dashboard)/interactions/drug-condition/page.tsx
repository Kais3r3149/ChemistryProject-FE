import type { Metadata } from "next";
import { DrugConditionForm } from "@/components/interactions/drug-condition-form";

export const metadata: Metadata = {
  title: "Drug-Condition",
};

export default function DrugConditionPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Drug-Condition
          </h1>
          <p className="text-muted-foreground">
            View therapeutic indications and toxicity information for a drug.
            Data sourced from DrugBank.
          </p>
        </div>
      </div>
      <DrugConditionForm />
    </div>
  );
}
