import type { Metadata } from "next";
import { DrugTargetForm } from "@/components/interactions/drug-target-form";

export const metadata: Metadata = {
  title: "Drug-Target Interaction",
};

export default function DTIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Drug-Target Interaction (DTI)
        </h1>
        <p className="text-muted-foreground mt-1">
          Predict binding affinity between a drug compound and a protein target.
        </p>
      </div>
      <DrugTargetForm />
    </div>
  );
}
