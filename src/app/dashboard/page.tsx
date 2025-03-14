"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/client";
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
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("ai");
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  useEffect(() => {
    // Set active tab from URL parameter if available
    if (tabParam && ["ai", "intake", "calls", "clients"].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    // Get user data
    const fetchUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      } else {
        window.location.href = "/sign-in";
      }
    };

    fetchUser();
  }, [tabParam]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <DashboardHeader user={user} />

          {/* Quick Actions */}
          <QuickActions onTabChange={setActiveTab} />

          {/* Stats Section */}
          <DashboardStats />

          {/* Main Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
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
                <span>Analyzed Sales Calls</span>
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

                {/* Info Banner */}
                <div className="w-full bg-green-100 border border-green-300 rounded-lg p-4 text-green-800">
                  <p className="text-center font-medium">
                    Please make sure you include the company name, product name,
                    and product type in all each of your questions and prompts
                    to get the most accurate responses.
                  </p>
                </div>

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
