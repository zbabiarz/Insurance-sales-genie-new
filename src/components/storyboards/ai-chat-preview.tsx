import { AIChat } from "@/components/ai-assistant/ai-chat";
import { InfoBanner } from "@/components/ai-assistant/info-banner";

export default function AIChatPreview() {
  return (
    <div className="p-8 bg-gray-50 h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI Chatbot Assistant</h1>
        <p className="text-gray-600 mb-4">
          Get real-time product information and recommendations
        </p>
        <InfoBanner />
        <div className="h-[600px]">
          <AIChat />
        </div>
      </div>
    </div>
  );
}
