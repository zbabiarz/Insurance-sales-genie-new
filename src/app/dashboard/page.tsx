import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
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
import { ClientIntakePage } from "@/components/client-intake/client-intake-page";
import { AIChat } from "@/components/ai-assistant/ai-chat";
import { CallAnalyzerPage } from "@/components/sales-call/call-analyzer-page";
import { ClientManagement } from "@/components/client-management/client-management";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <DashboardHeader user={user} />

          {/* Quick Actions */}
          <QuickActions />

          {/* Stats Section */}
          <DashboardStats />

          {/* Main Content Tabs */}
          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4" />
                <span>AI Assistant</span>
              </TabsTrigger>
              <TabsTrigger value="intake" className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                <span>Client Intake</span>
              </TabsTrigger>
              <TabsTrigger value="calls" className="flex items-center gap-2">
                <MessageSquareText className="h-4 w-4" />
                <span>Sales Calls</span>
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Clients</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Chatbot Assistant</CardTitle>
                    <CardDescription>
                      Get real-time product information and recommendations
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* AI Chat Component */}
                <div className="h-[500px]">
                  <AIChat />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="intake">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Intake & Matching</CardTitle>
                    <CardDescription>
                      Add new clients and match them with insurance plans
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Client Intake Form */}
                <div>
                  <ClientIntakePage />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calls">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Call Analyzer</CardTitle>
                    <CardDescription>
                      Upload and analyze your sales calls
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Sales Call Analyzer Component */}
                <div>
                  <CallAnalyzerPage />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="clients">
              <Card>
                <CardHeader>
                  <CardTitle>Client Management</CardTitle>
                  <CardDescription>
                    View and manage your insurance clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ClientManagement />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
