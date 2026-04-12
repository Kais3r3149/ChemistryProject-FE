import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "History",
};

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Search History
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage your past search queries and results.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            All History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium text-foreground">
              No search history yet
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Your search history will appear here as you perform drug
              interaction checks, gene-disease searches, and drug response
              predictions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
