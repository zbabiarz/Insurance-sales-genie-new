"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { supabase } from "../../supabase/supabase";

export default function PricingCard({
  item,
  user,
}: {
  item: any;
  user: User | null;
}) {
  // Handle checkout process
  const handleCheckout = async (priceId: string) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = "/sign-in?redirect=pricing";
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-create-checkout",
        {
          body: {
            price_id: priceId,
            user_id: user.id,
            return_url: `${window.location.origin}/dashboard`,
          },
          headers: {
            "X-Customer-Email": user.email || "",
          },
        },
      );

      if (error) {
        throw error;
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  // Define features based on plan tier
  const getFeatures = (planName: string) => {
    const baseFeatures = [
      "Client intake & matching system",
      "Basic AI chatbot assistant",
      "Dashboard analytics",
    ];

    const proFeatures = [
      ...baseFeatures,
      "Sales call analyzer",
      "Advanced AI recommendations",
      "Email templates",
    ];

    const enterpriseFeatures = [
      ...proFeatures,
      "Custom integrations",
      "Dedicated account manager",
      "White-label options",
    ];

    if (planName.toLowerCase().includes("pro")) {
      return proFeatures;
    } else if (planName.toLowerCase().includes("enterprise")) {
      return enterpriseFeatures;
    }
    return baseFeatures;
  };

  const features = getFeatures(item.name || "");

  return (
    <Card
      className={`w-full relative overflow-hidden ${item.popular ? "border-2 border-teal-500 shadow-xl" : "border border-gray-200"}`}
    >
      {item.popular && (
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-teal-50 opacity-30" />
      )}
      <CardHeader className="relative">
        {item.popular && (
          <div className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-teal-500 rounded-full w-fit mb-4">
            Most Popular
          </div>
        )}
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
          {item.name}
        </CardTitle>
        <CardDescription className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-bold text-gray-900">
            ${item?.amount / 100}
          </span>
          <span className="text-gray-600">/{item?.interval}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <ul className="space-y-3 py-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-teal-500 mr-2 mt-0.5" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="relative">
        <Button
          onClick={async () => {
            await handleCheckout(item.id);
          }}
          className={`w-full py-6 text-lg font-medium ${item.popular ? "bg-teal-600 hover:bg-teal-700" : ""}`}
        >
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
}
