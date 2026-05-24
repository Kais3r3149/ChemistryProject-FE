import type { Metadata } from "next";
import { DrugResponseForm } from "@/components/interactions/drug-response-form";

export const metadata: Metadata = {
  title: "Drug Response",
};

export default function DrugResponsePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Drug Response
        </h1>
        <p className="text-muted-foreground mt-1">
          Search IC50 and AUC sensitivity values from the GDSC2 dataset (99K+ records).
        </p>
      </div>
      <DrugResponseForm />
    </div>
  );
}
