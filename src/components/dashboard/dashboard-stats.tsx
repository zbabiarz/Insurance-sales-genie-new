"use client";

import { useState, useEffect } from "react";
import { DashboardCard } from "./dashboard-card";
import { TimeSavedTracker } from "./time-saved-tracker";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Phone,
  FileCheck,
} from "lucide-react";
import { createClient } from "../../../supabase/client";

export function DashboardStats() {
  const [clientCount, setClientCount] = useState(0);
  const [callCount, setCallCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCounts() {
      try {
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        // Fetch client count
        const { count: clientsCount, error: clientsError } = await supabase
          .from("clients")
          .select("id", { count: "exact" })
          .eq("user_id", userData.user.id);

        if (!clientsError && clientsCount !== null) {
          setClientCount(clientsCount);
        }

        // Fetch analyzed calls count
        const { count: callsCount, error: callsError } = await supabase
          .from("user_activity")
          .select("id", { count: "exact" })
          .eq("user_id", userData.user.id)
          .eq("activity_type", "call_analysis");

        if (!callsError && callsCount !== null) {
          setCallCount(callsCount);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    }

    fetchCounts();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard title="Saved Clients">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{clientCount}</div>
          <div className="flex items-center text-sm text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            <span>New</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Total clients in your account
        </p>
      </DashboardCard>

      <DashboardCard title="Analyzed Sales Calls">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{callCount}</div>
          <div className="flex items-center text-sm text-blue-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            <span>Tracked</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Total calls analyzed
        </p>
      </DashboardCard>

      <TimeSavedTracker userId="current" />
    </div>
  );
}
