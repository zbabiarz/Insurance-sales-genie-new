import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BrainCircuit,
  ClipboardCheck,
  MessageSquareText,
  Users,
} from "lucide-react";

export default function DashboardPreview() {
  const mockUser = {
    user_metadata: {
      full_name: "John Broker",
    },
  };

  return (
    <div className="w-full bg-gray-50 p-8">
      <div className="container mx-auto flex flex-col gap-8">
        {/* Header Section */}
        <DashboardHeader user={mockUser as any} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Section */}
        <DashboardStats />

        {/* Main Content Tabs */}
        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Clients</span>
            </TabsTrigger>
            <TabsTrigger value="intake" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span>Client Intake</span>
            </TabsTrigger>
            <TabsTrigger value="calls" className="flex items-center gap-2">
              <MessageSquareText className="h-4 w-4" />
              <span>Sales Calls</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              <span>AI Assistant</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Client Management</CardTitle>
                <CardDescription>
                  View and manage your insurance clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    No clients found. Add a new client to get started.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
