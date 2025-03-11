import { AIChat } from "@/components/ai-assistant/ai-chat";

export default function AIChatPreview() {
  return (
    <div className="p-8 bg-gray-50 h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI Chatbot Assistant</h1>
        <div className="h-[600px]">
          <AIChat />
        </div>
      </div>
    </div>
  );
}
