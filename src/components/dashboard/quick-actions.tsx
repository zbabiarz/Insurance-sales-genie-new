"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, Phone, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export function QuickActions({
  onTabChange,
}: {
  onTabChange?: (tab: string) => void;
}) {
  const router = useRouter();

  const handleNewClient = () => {
    if (onTabChange) {
      onTabChange("intake");
    } else {
      // If used outside of dashboard, navigate to dashboard with intake tab
      router.push("/dashboard?tab=intake");
    }
  };

  const handleUploadCall = () => {
    if (onTabChange) {
      onTabChange("calls");
    } else {
      router.push("/dashboard?tab=calls");
    }
  };

  const handleAskAI = () => {
    if (onTabChange) {
      onTabChange("ai");
    } else {
      router.push("/dashboard?tab=ai");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
        <CardDescription>Common tasks you can perform</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <Button
          onClick={handleNewClient}
          className="flex items-center justify-start gap-2 bg-teal-600 hover:bg-teal-700"
        >
          <UserPlus className="h-4 w-4" />
          <span>New Client</span>
        </Button>
        <Button
          onClick={handleUploadCall}
          className="flex items-center justify-start gap-2 bg-teal-600 hover:bg-teal-700"
        >
          <Phone className="h-4 w-4" />
          <span>Upload Call</span>
        </Button>
        <Button
          onClick={handleAskAI}
          className="flex items-center justify-start gap-2 bg-teal-600 hover:bg-teal-700"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Ask AI</span>
        </Button>
      </CardContent>
    </Card>
  );
}
