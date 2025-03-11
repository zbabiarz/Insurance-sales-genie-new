"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileSettings } from "./profile-settings";
import { PaymentSettings } from "./payment-settings";
import { SecuritySettings } from "./security-settings";
import { NotificationSettings } from "./notification-settings";
import { SubscriptionSettings } from "./subscription-settings";
import { UserCircle, CreditCard, Lock, Bell, Package } from "lucide-react";

interface SettingsPageProps {
  user: User;
}

export function SettingsPage({ user }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            <span className="hidden md:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden md:inline">Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings user={user} />
        </TabsContent>

        <TabsContent value="subscription">
          <SubscriptionSettings user={user} />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentSettings user={user} />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings user={user} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
