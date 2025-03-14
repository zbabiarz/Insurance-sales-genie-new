"use client";

import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("ai");
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
        <QuickActions onTabChange={setActiveTab} />

        {/* Stats Section */}
        <DashboardStats />

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            <Card>
              <CardHeader>
                <CardTitle>AI Chatbot Assistant</CardTitle>
                <CardDescription>
                  Get real-time product information and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    AI Assistant interface would appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="intake">
            <Card>
              <CardHeader>
                <CardTitle>Client Intake & Matching</CardTitle>
                <CardDescription>
                  Add new clients and match them with insurance plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Client intake form would appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls">
            <Card>
              <CardHeader>
                <CardTitle>Sales Call Analyzer</CardTitle>
                <CardDescription>
                  Upload and analyze your sales calls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Call analyzer interface would appear here
                  </p>
                </div>
              </CardContent>
            </Card>
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
