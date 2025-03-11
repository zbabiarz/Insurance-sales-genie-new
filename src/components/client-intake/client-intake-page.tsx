import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClientForm } from "./client-form";

export function ClientIntakePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Client Intake & Insurance Match Tool
          </h1>
          <p className="text-muted-foreground">
            Enter client information to find matching insurance plans based on
            health conditions and other factors.
          </p>
        </div>

        <ClientForm />
      </div>
    </div>
  );
}
