import type { Metadata } from "next";
import { DrugFoodForm } from "@/components/interactions/drug-food-form";

export const metadata: Metadata = {
  title: "Drug-Food Interactions",
};

export default function DrugFoodPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Drug-Food Interactions
          </h1>
          <p className="text-muted-foreground">
            Find known interactions between drugs and food, beverages, or herbal supplements.
            Data sourced from DrugBank.
          </p>
        </div>
      </div>
      <DrugFoodForm />
    </div>
  );
}
