"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, Search, X } from "lucide-react";

interface InsurancePlan {
  id: string;
  company_name: string;
  product_name: string;
  product_category: string;
  product_price: number;
  product_benefits: string;
  disqualifying_health_conditions?: string[];
  disqualifying_medications?: string[];
}

interface InsurancePlansTableProps {
  plans: InsurancePlan[];
}

export function InsurancePlansTable({ plans }: InsurancePlansTableProps) {
  const [sortField, setSortField] =
    useState<keyof InsurancePlan>("product_price");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // Get unique categories for filter
  const categories = Array.from(
    new Set(plans.map((plan) => plan.product_category)),
  );

  const handleSort = (field: keyof InsurancePlan) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredPlans = plans
    .filter((plan) => {
      // Apply category filter
      if (categoryFilter && plan.product_category !== categoryFilter) {
        return false;
      }

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          plan.company_name.toLowerCase().includes(searchLower) ||
          plan.product_name.toLowerCase().includes(searchLower) ||
          plan.product_benefits.toLowerCase().includes(searchLower)
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Handle sorting
      if (sortField === "product_price") {
        return sortDirection === "asc"
          ? a.product_price - b.product_price
          : b.product_price - a.product_price;
      } else {
        const aValue = String(a[sortField]).toLowerCase();
        const bValue = String(b[sortField]).toLowerCase();

        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });

  if (plans.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">
          No matching insurance plans found based on the provided criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3 space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search plans..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/3 space-y-2">
          <Label htmlFor="category-filter">Category</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          className="w-full md:w-auto"
          onClick={() => {
            setSearchTerm("");
            setCategoryFilter("");
          }}
        >
          Reset Filters
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("company_name")}
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                >
                  Company
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("product_name")}
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                >
                  Product
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("product_category")}
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                >
                  Category
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("product_price")}
                  className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                >
                  Price
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">
                  {plan.company_name}
                </TableCell>
                <TableCell>
                  <div>
                    <div>{plan.product_name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {plan.product_benefits}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{plan.product_category}</TableCell>
                <TableCell className="text-right">
                  ${plan.product_price.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredPlans.length} of {plans.length} plans
      </div>
    </div>
  );
}
