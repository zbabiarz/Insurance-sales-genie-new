import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CallAnalyzer } from "./call-analyzer";

export function CallAnalyzerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sales Call Analyzer</h1>
          <p className="text-muted-foreground">
            Upload call recordings or transcripts to receive AI-powered feedback
            on your sales performance.
          </p>
        </div>

        <CallAnalyzer />
      </div>
    </div>
  );
}
