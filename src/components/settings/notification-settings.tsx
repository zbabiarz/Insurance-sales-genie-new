"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "../../../supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface NotificationSettingsProps {
  user: User;
}

type NotificationSetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

export function NotificationSettings({ user }: NotificationSettingsProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [emailSettings, setEmailSettings] = useState<NotificationSetting[]>([
    {
      id: "new_client",
      title: "New Client Notifications",
      description: "Receive an email when a new client is added",
      enabled: true,
    },
    {
      id: "client_update",
      title: "Client Updates",
      description: "Receive an email when client information is updated",
      enabled: true,
    },
    {
      id: "plan_match",
      title: "Plan Matching Results",
      description: "Receive an email when new insurance plans match a client",
      enabled: true,
    },
    {
      id: "subscription",
      title: "Subscription Updates",
      description: "Receive an email about your subscription status",
      enabled: true,
    },
    {
      id: "marketing",
      title: "Marketing & Promotions",
      description: "Receive emails about new features and special offers",
      enabled: false,
    },
  ]);

  const [appSettings, setAppSettings] = useState<NotificationSetting[]>([
    {
      id: "app_new_client",
      title: "New Client Alerts",
      description: "Receive in-app notifications for new clients",
      enabled: true,
    },
    {
      id: "app_client_update",
      title: "Client Update Alerts",
      description: "Receive in-app notifications for client updates",
      enabled: true,
    },
    {
      id: "app_plan_match",
      title: "Plan Match Alerts",
      description: "Receive in-app notifications for plan matches",
      enabled: true,
    },
  ]);

  const toggleEmailSetting = (id: string) => {
    setEmailSettings(
      emailSettings.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting,
      ),
    );
  };

  const toggleAppSetting = (id: string) => {
    setAppSettings(
      appSettings.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting,
      ),
    );
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);

    try {
      // In a real app, this would save to the database
      // For demo purposes, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your notification settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Manage the emails you receive from Insurance Sales Genie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emailSettings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between py-3"
            >
              <div className="space-y-0.5">
                <h4 className="font-medium">{setting.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
              </div>
              <Switch
                checked={setting.enabled}
                onCheckedChange={() => toggleEmailSetting(setting.id)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>In-App Notifications</CardTitle>
          <CardDescription>
            Manage the notifications you see within the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {appSettings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between py-3"
            >
              <div className="space-y-0.5">
                <h4 className="font-medium">{setting.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
              </div>
              <Switch
                checked={setting.enabled}
                onCheckedChange={() => toggleAppSetting(setting.id)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Schedule</CardTitle>
          <CardDescription>
            Control when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="space-y-0.5">
                <h4 className="font-medium">Daily Digest</h4>
                <p className="text-sm text-muted-foreground">
                  Receive a daily summary of all notifications
                </p>
              </div>
              <Switch defaultChecked={false} />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="space-y-0.5">
                <h4 className="font-medium">Do Not Disturb</h4>
                <p className="text-sm text-muted-foreground">
                  Pause all notifications during specific hours
                </p>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Notification Settings"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
