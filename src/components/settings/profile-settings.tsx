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
import { Loader2, UserCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProfileSettingsProps {
  user: User;
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.user_metadata?.full_name || "",
    email: user.email || "",
    company: user.user_metadata?.company || "",
    phone: user.user_metadata?.phone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          company: formData.company,
          phone: formData.phone,
        },
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description:
          "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Update your personal information and profile details
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <UserCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium">{formData.fullName || "User"}</h3>
              <p className="text-sm text-muted-foreground">{formData.email}</p>
              <Button variant="link" className="p-0 h-auto text-sm">
                Change profile picture
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={formData.email} disabled />
              <p className="text-xs text-muted-foreground">
                To change your email, go to the Security tab
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
