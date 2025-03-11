"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { createClient } from "../../../supabase/client";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your Insurance Sales Genie assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Log activity for time saved tracking
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await supabase.from("user_activity").insert({
          user_id: userData.user.id,
          activity_type: "ai_chat",
          details: { message_length: input.length },
        });
      }
    } catch (error) {
      console.error("Error logging activity:", error);
    }

    try {
      // Get insurance plans from Supabase
      const { data: insurancePlans } = await supabase
        .from("insurance_plans")
        .select("*");

      // Get health conditions from Supabase
      const { data: healthConditions } = await supabase
        .from("health_conditions")
        .select("*");

      // Get medications from Supabase
      const { data: medications } = await supabase
        .from("medications")
        .select("*");

      // Use the server API route instead of client-side processing
      const context = {
        insurancePlans: insurancePlans || [],
        healthConditions: healthConditions || [],
        medications: medications || [],
      };

      try {
        // Call the API route
        const apiResponse = await fetch("/api/openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage.content,
            context,
          }),
        });

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.response },
          ]);
        } else {
          // If API call fails, fall back to rule-based approach
          const response = await processQuery(userMessage.content, context);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: response },
          ]);
        }
      } catch (apiError) {
        console.error("Error calling OpenAI API:", apiError);
        // Fall back to rule-based approach
        const response = await processQuery(userMessage.content, context);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response },
        ]);
      }
    } catch (error) {
      console.error("Error processing query:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error while processing your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const processQuery = async (
    query: string,
    data: {
      insurancePlans: any[];
      healthConditions: any[];
      medications: any[];
    },
  ): Promise<string> => {
    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const openaiAssistantId = process.env.NEXT_PUBLIC_OPENAI_ASSISTANT_ID;

    // If OpenAI is configured, use it for processing
    if (openaiApiKey && openaiAssistantId && typeof window !== "undefined") {
      try {
        // Use a simpler approach to avoid dynamic imports which can cause issues
        // with React hooks and server components
        const response =
          "I'm your AI assistant. I can help you with insurance questions, but I'm currently in fallback mode. Please try again later when the OpenAI integration is fully configured.";
        return response;
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
        // Fall back to rule-based approach if OpenAI call fails
      }
    }

    // Fallback to rule-based approach if OpenAI is not configured or call failed
    const { insurancePlans, healthConditions, medications } = data;
    const queryLower = query.toLowerCase();

    // Check for product information queries
    if (
      queryLower.includes("product") ||
      queryLower.includes("plan") ||
      queryLower.includes("insurance")
    ) {
      // Check for specific product category
      const categories = Array.from(
        new Set(insurancePlans.map((plan) => plan.product_category)),
      );

      for (const category of categories) {
        if (queryLower.includes(category.toLowerCase())) {
          const matchingPlans = insurancePlans.filter(
            (plan) =>
              plan.product_category.toLowerCase() === category.toLowerCase(),
          );

          if (matchingPlans.length > 0) {
            let response = `Here are the ${category} insurance plans available:\n\n`;

            matchingPlans.forEach((plan) => {
              response += `- **${plan.company_name} - ${plan.product_name}**: $${plan.product_price.toFixed(2)}/month\n`;
              response += `  ${plan.product_benefits}\n\n`;
            });

            return response;
          }
        }
      }

      // Check for specific company
      const companies = Array.from(
        new Set(insurancePlans.map((plan) => plan.company_name)),
      );

      for (const company of companies) {
        if (queryLower.includes(company.toLowerCase())) {
          const matchingPlans = insurancePlans.filter(
            (plan) => plan.company_name.toLowerCase() === company.toLowerCase(),
          );

          if (matchingPlans.length > 0) {
            let response = `Here are the insurance plans offered by ${company}:\n\n`;

            matchingPlans.forEach((plan) => {
              response += `- **${plan.product_name}** (${plan.product_category}): $${plan.product_price.toFixed(2)}/month\n`;
              response += `  ${plan.product_benefits}\n\n`;
            });

            return response;
          }
        }
      }

      // General product information
      let response = "Here are the insurance plans we offer:\n\n";

      // Group by category
      const plansByCategory: Record<string, any[]> = {};

      insurancePlans.forEach((plan) => {
        if (!plansByCategory[plan.product_category]) {
          plansByCategory[plan.product_category] = [];
        }
        plansByCategory[plan.product_category].push(plan);
      });

      for (const [category, plans] of Object.entries(plansByCategory)) {
        response += `**${category} Plans:**\n`;

        plans.forEach((plan) => {
          response += `- ${plan.company_name} - ${plan.product_name}: $${plan.product_price.toFixed(2)}/month\n`;
        });

        response += "\n";
      }

      return response;
    }

    // Check for health condition related queries
    if (
      queryLower.includes("health") ||
      queryLower.includes("condition") ||
      queryLower.includes("medical")
    ) {
      // Check for specific health condition
      for (const condition of healthConditions) {
        if (queryLower.includes(condition.name.toLowerCase())) {
          const disqualifyingPlans = insurancePlans.filter(
            (plan) =>
              plan.disqualifying_health_conditions &&
              plan.disqualifying_health_conditions.includes(condition.name),
          );

          const qualifyingPlans = insurancePlans.filter(
            (plan) =>
              !plan.disqualifying_health_conditions ||
              !plan.disqualifying_health_conditions.includes(condition.name),
          );

          let response = `For clients with ${condition.name}, here are the insurance options:\n\n`;

          if (qualifyingPlans.length > 0) {
            response += "**Available Plans:**\n";
            qualifyingPlans.forEach((plan) => {
              response += `- ${plan.company_name} - ${plan.product_name} (${plan.product_category}): $${plan.product_price.toFixed(2)}/month\n`;
            });
          } else {
            response +=
              "There are no plans available for this health condition.\n";
          }

          return response;
        }
      }

      // General health condition information
      let response =
        "Here are the health conditions that may affect insurance eligibility:\n\n";

      healthConditions.forEach((condition) => {
        const disqualifyingPlans = insurancePlans.filter(
          (plan) =>
            plan.disqualifying_health_conditions &&
            plan.disqualifying_health_conditions.includes(condition.name),
        );

        response += `- **${condition.name}**: Disqualifies from ${disqualifyingPlans.length} plans\n`;
      });

      return response;
    }

    // Check for medication related queries
    if (
      queryLower.includes("medication") ||
      queryLower.includes("drug") ||
      queryLower.includes("medicine")
    ) {
      // Check for specific medication
      for (const medication of medications) {
        if (queryLower.includes(medication.name.toLowerCase())) {
          const disqualifyingPlans = insurancePlans.filter(
            (plan) =>
              plan.disqualifying_medications &&
              plan.disqualifying_medications.includes(medication.name),
          );

          const qualifyingPlans = insurancePlans.filter(
            (plan) =>
              !plan.disqualifying_medications ||
              !plan.disqualifying_medications.includes(medication.name),
          );

          let response = `For clients taking ${medication.name}, here are the insurance options:\n\n`;

          if (qualifyingPlans.length > 0) {
            response += "**Available Plans:**\n";
            qualifyingPlans.forEach((plan) => {
              response += `- ${plan.company_name} - ${plan.product_name} (${plan.product_category}): $${plan.product_price.toFixed(2)}/month\n`;
            });
          } else {
            response +=
              "There are no plans available for clients taking this medication.\n";
          }

          return response;
        }
      }

      // General medication information
      let response =
        "Here are the medications that may affect insurance eligibility:\n\n";

      medications.forEach((medication) => {
        const disqualifyingPlans = insurancePlans.filter(
          (plan) =>
            plan.disqualifying_medications &&
            plan.disqualifying_medications.includes(medication.name),
        );

        response += `- **${medication.name}**: Disqualifies from ${disqualifyingPlans.length} plans\n`;
      });

      return response;
    }

    // Check for price/cost related queries
    if (
      queryLower.includes("price") ||
      queryLower.includes("cost") ||
      queryLower.includes("affordable")
    ) {
      // Sort plans by price
      const sortedPlans = [...insurancePlans].sort(
        (a, b) => a.product_price - b.product_price,
      );

      let response =
        "Here are our insurance plans sorted by price (lowest to highest):\n\n";

      sortedPlans.forEach((plan) => {
        response += `- **${plan.company_name} - ${plan.product_name}** (${plan.product_category}): $${plan.product_price.toFixed(2)}/month\n`;
      });

      return response;
    }

    // Default response for other queries
    return "I can help you with information about our insurance products, health conditions, medications, and pricing. Please ask me about specific insurance plans, health conditions, or how to find the right coverage for your needs.";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 text-green-600"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-5h10v2H7zm2-3a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          AI Insurance Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`flex items-start gap-2 max-w-[80%] ${message.role === "assistant" ? "bg-muted p-3 rounded-lg" : ""}`}
              >
                {message.role === "assistant" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 mt-1 text-green-600 flex-shrink-0"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-5h10v2H7zm2-3a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                )}
                <div className="space-y-1 overflow-hidden">
                  <div
                    className={`${message.role === "user" ? "bg-teal-600 text-white p-3 rounded-lg" : ""} break-words`}
                  >
                    {message.content.split("\n").map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                </div>
                {message.role === "user" && (
                  <User className="h-5 w-5 mt-1 text-white bg-teal-600 rounded-full p-1 flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 sticky bottom-0 bg-card pt-2">
          <Input
            placeholder="Ask about insurance products or client eligibility..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-teal-600 hover:bg-teal-700 flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
