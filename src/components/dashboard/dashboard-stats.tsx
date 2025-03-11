import { DashboardCard } from "./dashboard-card";
import { TimeSavedTracker } from "./time-saved-tracker";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Phone,
  FileCheck,
} from "lucide-react";

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard title="Saved Clients">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">42</div>
          <div className="flex items-center text-sm text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            <span>+5</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Compared to last month
        </p>
      </DashboardCard>

      <DashboardCard title="Sales Calls">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">18</div>
          <div className="flex items-center text-sm text-red-600">
            <ArrowDownRight className="mr-1 h-4 w-4" />
            <span>-3</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Compared to last month
        </p>
      </DashboardCard>

      <TimeSavedTracker userId="current" />
    </div>
  );
}
