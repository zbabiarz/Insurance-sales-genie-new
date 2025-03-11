import { User } from "@supabase/supabase-js";

interface DashboardHeaderProps {
  user: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-6">
      <h1 className="text-3xl font-bold">
        Welcome, {user?.user_metadata?.full_name || "Broker"}
      </h1>
      <div className="text-muted-foreground">
        Manage your clients, analyze sales calls, and get AI-powered
        recommendations all in one place.
      </div>
    </div>
  );
}
