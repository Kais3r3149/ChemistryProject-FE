import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function RecentSearches() {
  // Mock empty state — will be replaced with real data
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Recent Searches
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Clock className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">No recent searches</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Your search history will appear here
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
