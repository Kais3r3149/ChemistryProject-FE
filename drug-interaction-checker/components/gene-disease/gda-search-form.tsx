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

export function GDASearchForm() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"gene" | "disease">("gene");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

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
          <CardTitle>Gene-Disease Association Search</CardTitle>
          <CardDescription>
            Search by gene name or disease to find known associations from TDC
            datasets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Search type toggle */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={searchType === "gene" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("gene")}
              >
                Search by Gene
              </Button>
              <Button
                type="button"
                variant={searchType === "disease" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("disease")}
              >
                Search by Disease
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gda-query">
                {searchType === "gene" ? "Gene Name / Symbol" : "Disease Name"}
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="gda-query"
                  placeholder={
                    searchType === "gene"
                      ? "e.g., BRCA1, TP53"
                      : "e.g., Breast Cancer, Alzheimer"
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search Associations"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {hasSearched && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Gene-disease association results will appear here once connected to
              the backend API.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
