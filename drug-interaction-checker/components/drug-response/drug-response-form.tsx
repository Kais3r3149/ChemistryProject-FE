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

export function DrugResponseForm() {
  const [drug, setDrug] = useState("");
  const [cellLine, setCellLine] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drug.trim() || !cellLine.trim()) return;

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
          <CardTitle>Drug Response Prediction</CardTitle>
          <CardDescription>
            Enter a drug and cell line to predict drug sensitivity and response.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dr-drug">Drug</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="dr-drug"
                    placeholder="e.g., Paclitaxel"
                    value={drug}
                    onChange={(e) => setDrug(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cellLine">Cell Line</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="cellLine"
                    placeholder="e.g., MCF7, HeLa"
                    value={cellLine}
                    onChange={(e) => setCellLine(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !drug.trim() || !cellLine.trim()}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                "Predict Response"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {hasSearched && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Drug response prediction results will appear here once connected
              to the backend API.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
