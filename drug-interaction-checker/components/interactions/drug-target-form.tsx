"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DrugTargetForm() {
  const [drug, setDrug] = useState("");
  const [target, setTarget] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drug.trim() || !target.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setHasSearched(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Drug-Target Interaction Prediction</CardTitle>
          <CardDescription>
            Enter a drug name and a protein target to predict binding affinity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="drug">Drug</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="drug"
                    placeholder="e.g., Imatinib"
                    value={drug}
                    onChange={(e) => setDrug(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Protein Target</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="target"
                    placeholder="e.g., ABL1, UniProt ID"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !drug.trim() || !target.trim()}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                "Predict Binding"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results placeholder */}
      {hasSearched && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              DTI prediction results will appear here once connected to the
              backend API.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
