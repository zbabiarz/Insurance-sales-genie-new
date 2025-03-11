"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreditCard,
  PlusCircle,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentSettingsProps {
  user: User;
}

type PaymentMethod = {
  id: string;
  type: "card";
  last4: string;
  expMonth: number;
  expYear: number;
  brand: string;
  isDefault: boolean;
};

export function PaymentSettings({ user }: PaymentSettingsProps) {
  const supabase = createClient();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_1",
      type: "card",
      last4: "4242",
      expMonth: 12,
      expYear: 2025,
      brand: "Visa",
      isDefault: true,
    },
  ]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardName: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  });

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call Stripe or another payment processor
    // For demo purposes, we'll just add a mock card
    const mockNewCard: PaymentMethod = {
      id: `pm_${Math.random().toString(36).substring(2, 9)}`,
      type: "card",
      last4: newCard.cardNumber.slice(-4),
      expMonth: parseInt(newCard.expMonth),
      expYear: parseInt(newCard.expYear),
      brand: "Visa",
      isDefault: false,
    };

    setPaymentMethods([...paymentMethods, mockNewCard]);
    setShowAddCard(false);
    setNewCard({
      cardNumber: "",
      cardName: "",
      expMonth: "",
      expYear: "",
      cvc: "",
    });
  };

  const handleRemoveCard = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
  };

  const handleSetDefaultCard = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Manage your payment methods and billing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Your Payment Methods</h3>
            <Button
              variant="outline"
              onClick={() => setShowAddCard(!showAddCard)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Payment Method
            </Button>
          </div>

          {paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {method.brand} •••• {method.last4}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expires {method.expMonth}/{method.expYear}
                      </div>
                    </div>
                    {method.isDefault && (
                      <span className="ml-3 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefaultCard(method.id)}
                      >
                        Set as default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCard(method.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 border rounded-lg bg-muted/20">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">No payment methods</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You haven't added any payment methods yet
              </p>
              <Button
                onClick={() => setShowAddCard(true)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Add Payment Method
              </Button>
            </div>
          )}

          {showAddCard && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Add New Card</CardTitle>
              </CardHeader>
              <form onSubmit={handleAddCard}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      placeholder="John Doe"
                      required
                      value={newCard.cardName}
                      onChange={handleCardInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      required
                      value={newCard.cardNumber}
                      onChange={handleCardInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expMonth">Expiration Month</Label>
                      <Select
                        value={newCard.expMonth}
                        onValueChange={(value) =>
                          setNewCard({ ...newCard, expMonth: value })
                        }
                      >
                        <SelectTrigger id="expMonth">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (month) => (
                              <SelectItem
                                key={month}
                                value={month.toString().padStart(2, "0")}
                              >
                                {month.toString().padStart(2, "0")}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expYear">Expiration Year</Label>
                      <Select
                        value={newCard.expYear}
                        onValueChange={(value) =>
                          setNewCard({ ...newCard, expYear: value })
                        }
                      >
                        <SelectTrigger id="expYear">
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(
                            { length: 10 },
                            (_, i) => new Date().getFullYear() + i,
                          ).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        name="cvc"
                        placeholder="123"
                        required
                        maxLength={4}
                        value={newCard.cvc}
                        onChange={handleCardInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddCard(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Add Card
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </div>

        <div className="pt-6 border-t">
          <h3 className="text-lg font-medium mb-4">Billing Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billingName">Billing Name</Label>
              <Input
                id="billingName"
                defaultValue={user.user_metadata?.full_name || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingEmail">Billing Email</Label>
              <Input id="billingEmail" defaultValue={user.email || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingAddress">Billing Address</Label>
              <Input id="billingAddress" placeholder="123 Main St" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingCity">City</Label>
              <Input id="billingCity" placeholder="San Francisco" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingState">State</Label>
              <Input id="billingState" placeholder="CA" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingZip">ZIP Code</Label>
              <Input id="billingZip" placeholder="94103" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button className="bg-teal-600 hover:bg-teal-700">
          Save Billing Information
        </Button>
      </CardFooter>
    </Card>
  );
}
