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

export function ProteinProteinForm() {
  const [proteinA, setProteinA] = useState("");
  const [proteinB, setProteinB] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proteinA.trim() || !proteinB.trim()) return;

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
          <CardTitle>Protein-Protein Interaction</CardTitle>
          <CardDescription>
            Enter two protein names or UniProt IDs to check for interactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="proteinA">Protein A</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="proteinA"
                    placeholder="e.g., TP53, P04637"
                    value={proteinA}
                    onChange={(e) => setProteinA(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="proteinB">Protein B</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="proteinB"
                    placeholder="e.g., MDM2, Q00987"
                    value={proteinB}
                    onChange={(e) => setProteinB(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !proteinA.trim() || !proteinB.trim()}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Check PPI"
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
              PPI analysis results will appear here once connected to the
              backend API.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
