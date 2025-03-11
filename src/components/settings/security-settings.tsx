"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface SecuritySettingsProps {
  user: User;
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [emailData, setEmailData] = useState({
    newEmail: user.email || "",
    password: "",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error updating password",
        description:
          "There was a problem updating your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingEmail(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: emailData.newEmail,
      });

      if (error) throw error;

      toast({
        title: "Email update initiated",
        description: "Please check your new email for a confirmation link.",
      });
    } catch (error) {
      console.error("Error updating email:", error);
      toast({
        title: "Error updating email",
        description:
          "There was a problem updating your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    // In a real app, this would initiate the 2FA setup process
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
      description: twoFactorEnabled
        ? "Two-factor authentication has been disabled."
        : "Two-factor authentication has been enabled.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Email</CardTitle>
          <CardDescription>
            Update your email address for account communications
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleEmailSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentEmail">Current Email</Label>
              <Input id="currentEmail" value={user.email || ""} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newEmail">New Email</Label>
              <Input
                id="newEmail"
                name="newEmail"
                type="email"
                value={emailData.newEmail}
                onChange={handleEmailChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailPassword">Password</Label>
              <Input
                id="emailPassword"
                name="password"
                type="password"
                value={emailData.password}
                onChange={handleEmailChange}
                required
                placeholder="Enter your password to confirm"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              disabled={isChangingEmail}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isChangingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Email"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">Two-Factor Authentication (2FA)</h4>
              <p className="text-sm text-muted-foreground">
                Require a verification code when signing in
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleToggleTwoFactor}
            />
          </div>

          {twoFactorEnabled && (
            <div className="pt-4">
              <p className="text-sm mb-4">
                Two-factor authentication is enabled. You will need to enter a
                verification code when signing in.
              </p>
              <Button variant="outline">Manage 2FA Settings</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
          <CardDescription>
            Manage your active sessions and sign out from other devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div>
                <h4 className="font-medium">Current Session</h4>
                <p className="text-sm text-muted-foreground">
                  This device • Last active now
                </p>
              </div>
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Active
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Sign Out From All Other Devices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
