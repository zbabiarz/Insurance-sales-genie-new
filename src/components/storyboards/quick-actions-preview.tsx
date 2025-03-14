"use client";

import { useState } from "react";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function QuickActionsPreview() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    setLastAction(`Button clicked: Would navigate to ${tab} tab`);
  };

  return (
    <div className="p-8 bg-gray-50 space-y-4">
      <QuickActions onTabChange={handleTabChange} />

      {lastAction && (
        <Alert variant="info">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Action Triggered</AlertTitle>
          <AlertDescription>{lastAction}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
