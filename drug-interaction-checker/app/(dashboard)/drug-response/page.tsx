import type { Metadata } from "next";
import { DrugResponseForm } from "@/components/drug-response/drug-response-form";

export const metadata: Metadata = {
  title: "Drug Response Prediction",
};

export default function DrugResponsePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Drug Response Prediction
        </h1>
        <p className="text-muted-foreground mt-1">
          Predict drug sensitivity and response for specific drug-cell line
          combinations.
        </p>
      </div>
      <DrugResponseForm />
    </div>
  );
}
