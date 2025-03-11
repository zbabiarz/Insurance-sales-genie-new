import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, Phone, MessageSquare } from "lucide-react";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
        <CardDescription>Common tasks you can perform</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <Button className="flex items-center justify-start gap-2 bg-teal-600 hover:bg-teal-700">
          <UserPlus className="h-4 w-4" />
          <span>New Client</span>
        </Button>
        <Button className="flex items-center justify-start gap-2 bg-teal-600 hover:bg-teal-700">
          <Phone className="h-4 w-4" />
          <span>Upload Call</span>
        </Button>
        <Button className="flex items-center justify-start gap-2 bg-teal-600 hover:bg-teal-700">
          <MessageSquare className="h-4 w-4" />
          <span>Ask AI</span>
        </Button>
      </CardContent>
    </Card>
  );
}
