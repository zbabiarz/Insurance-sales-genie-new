"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "../../../supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface SubscriptionSettingsProps {
  user: User;
}

type Plan = {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  popular?: boolean;
};

type Subscription = {
  id: string;
  status: "active" | "canceled" | "past_due" | "trialing";
  current_period_end: number;
  cancel_at_period_end: boolean;
  plan: Plan;
};

export function SubscriptionSettings({ user }: SubscriptionSettingsProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  useEffect(() => {
    async function fetchSubscriptionData() {
      try {
        // In a real app, this would fetch from the database
        // For demo purposes, we'll use mock data

        // Fetch available plans
        const { data: plansData } = await supabase.functions.invoke(
          "supabase-functions-get-plans",
        );

        if (plansData) {
          setAvailablePlans(
            plansData.map((plan: any) => ({
              id: plan.id,
              name: plan.name || "Standard Plan",
              price: plan.amount / 100,
              interval: plan.interval || "month",
              features: [
                "Client intake & matching system",
                "Basic AI chatbot assistant",
                "Dashboard analytics",
                plan.amount > 2000 ? "Sales call analyzer" : null,
                plan.amount > 2000 ? "Advanced AI recommendations" : null,
                plan.amount > 5000 ? "Custom integrations" : null,
              ].filter(Boolean) as string[],
              popular: plan.amount === 2999,
            })),
          );
        }

        // Fetch user's subscription
        const { data: subscriptionData, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

        if (subscriptionData) {
          // Find the plan details from available plans
          const planDetails = plansData.find(
            (plan: any) => plan.id === subscriptionData.stripe_price_id,
          );

          setSubscription({
            id: subscriptionData.stripe_id,
            status: subscriptionData.status,
            current_period_end: subscriptionData.current_period_end,
            cancel_at_period_end: subscriptionData.cancel_at_period_end,
            plan: {
              id: planDetails?.id || "default_plan",
              name: planDetails?.name || "Standard Plan",
              price: (planDetails?.amount || 0) / 100,
              interval: planDetails?.interval || "month",
              features: [
                "Client intake & matching system",
                "Basic AI chatbot assistant",
                "Dashboard analytics",
                planDetails?.amount > 2000 ? "Sales call analyzer" : null,
                planDetails?.amount > 2000
                  ? "Advanced AI recommendations"
                  : null,
                planDetails?.amount > 5000 ? "Custom integrations" : null,
              ].filter(Boolean) as string[],
            },
          });
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        // Set a default subscription for demo purposes
        setSubscription({
          id: "sub_123456",
          status: "active",
          current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
          cancel_at_period_end: false,
          plan: {
            id: "price_123456",
            name: "Pro Plan",
            price: 29.99,
            interval: "month",
            features: [
              "Client intake & matching system",
              "Basic AI chatbot assistant",
              "Dashboard analytics",
              "Sales call analyzer",
              "Advanced AI recommendations",
            ],
            popular: true,
          },
        });

        // Set default available plans
        setAvailablePlans([
          {
            id: "price_basic",
            name: "Basic Plan",
            price: 9.99,
            interval: "month",
            features: [
              "Client intake & matching system",
              "Basic AI chatbot assistant",
              "Dashboard analytics",
            ],
          },
          {
            id: "price_pro",
            name: "Pro Plan",
            price: 29.99,
            interval: "month",
            features: [
              "Client intake & matching system",
              "Basic AI chatbot assistant",
              "Dashboard analytics",
              "Sales call analyzer",
              "Advanced AI recommendations",
            ],
            popular: true,
          },
          {
            id: "price_enterprise",
            name: "Enterprise Plan",
            price: 99.99,
            interval: "month",
            features: [
              "Client intake & matching system",
              "Basic AI chatbot assistant",
              "Dashboard analytics",
              "Sales call analyzer",
              "Advanced AI recommendations",
              "Custom integrations",
              "Dedicated account manager",
            ],
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscriptionData();
  }, [user.id]);

  const handleCancelSubscription = async () => {
    setIsCanceling(true);

    try {
      // In a real app, this would call the Stripe API
      // For demo purposes, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the local state
      if (subscription) {
        setSubscription({
          ...subscription,
          cancel_at_period_end: true,
        });
      }

      toast({
        title: "Subscription canceled",
        description:
          "Your subscription will end at the current billing period.",
      });
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast({
        title: "Error canceling subscription",
        description:
          "There was a problem canceling your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const handleResumeSubscription = async () => {
    setIsResuming(true);

    try {
      // In a real app, this would call the Stripe API
      // For demo purposes, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the local state
      if (subscription) {
        setSubscription({
          ...subscription,
          cancel_at_period_end: false,
        });
      }

      toast({
        title: "Subscription resumed",
        description:
          "Your subscription will continue after the current billing period.",
      });
    } catch (error) {
      console.error("Error resuming subscription:", error);
      toast({
        title: "Error resuming subscription",
        description:
          "There was a problem resuming your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResuming(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Subscription</CardTitle>
          <CardDescription>
            Manage your subscription plan and billing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg bg-muted/20">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">
                      {subscription.plan.name}
                    </h3>
                    <Badge
                      className={`${subscription.status === "active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
                    >
                      {subscription.status === "active"
                        ? "Active"
                        : subscription.status === "past_due"
                          ? "Past Due"
                          : subscription.status === "trialing"
                            ? "Trial"
                            : "Canceled"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    ${subscription.plan.price}/{subscription.plan.interval}
                  </p>
                </div>

                <div className="space-y-2">
                  {subscription.cancel_at_period_end ? (
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">
                        Your subscription will end on{" "}
                        {formatDate(subscription.current_period_end)}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm">
                      Next billing date:{" "}
                      {formatDate(subscription.current_period_end)}
                    </p>
                  )}

                  {subscription.cancel_at_period_end ? (
                    <Button
                      onClick={handleResumeSubscription}
                      disabled={isResuming}
                      className="w-full md:w-auto bg-teal-600 hover:bg-teal-700"
                    >
                      {isResuming ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resuming...
                        </>
                      ) : (
                        "Resume Subscription"
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleCancelSubscription}
                      disabled={isCanceling}
                      className="w-full md:w-auto"
                    >
                      {isCanceling ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Canceling...
                        </>
                      ) : (
                        "Cancel Subscription"
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Included Features</h4>
                <ul className="space-y-2">
                  {subscription.plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center p-6">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No Active Subscription</h3>
              <p className="text-muted-foreground mb-6">
                You don't have an active subscription. Choose a plan to get
                started.
              </p>
              <Button className="bg-teal-600 hover:bg-teal-700">
                View Available Plans
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>
            Compare plans and choose the best option for your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availablePlans.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-lg overflow-hidden ${plan.popular ? "border-2 border-teal-500 shadow-md" : ""}`}
              >
                {plan.popular && (
                  <div className="bg-teal-500 text-white text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <div className="mt-2 mb-4">
                    <span className="text-2xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">
                      /{plan.interval}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.popular ? "bg-teal-600 hover:bg-teal-700" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {subscription?.plan.id === plan.id
                      ? "Current Plan"
                      : "Upgrade"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View your past invoices and payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 p-4 font-medium border-b">
              <div>Date</div>
              <div>Description</div>
              <div>Amount</div>
              <div>Status</div>
              <div className="text-right">Invoice</div>
            </div>
            <div className="divide-y">
              <div className="grid grid-cols-5 p-4 items-center">
                <div>May 1, 2023</div>
                <div>Pro Plan Subscription</div>
                <div>$29.99</div>
                <div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Paid
                  </span>
                </div>
                <div className="text-right">
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-5 p-4 items-center">
                <div>Apr 1, 2023</div>
                <div>Pro Plan Subscription</div>
                <div>$29.99</div>
                <div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Paid
                  </span>
                </div>
                <div className="text-right">
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-5 p-4 items-center">
                <div>Mar 1, 2023</div>
                <div>Pro Plan Subscription</div>
                <div>$29.99</div>
                <div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Paid
                  </span>
                </div>
                <div className="text-right">
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
