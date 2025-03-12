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
  eligibility_status?: "eligible" | "potential";
}

interface InsurancePlansTableProps {
  plans: InsurancePlan[];
}

export function InsurancePlansTable({ plans }: InsurancePlansTableProps) {
  const [sortField, setSortField] =
    useState<keyof InsurancePlan>("product_price");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [eligibilityFilter, setEligibilityFilter] = useState<string>("all");

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
      if (
        categoryFilter !== "all" &&
        plan.product_category !== categoryFilter
      ) {
        return false;
      }

      // Apply eligibility filter
      if (
        eligibilityFilter !== "all" &&
        plan.eligibility_status !== eligibilityFilter
      ) {
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

  // Group plans by eligibility status
  const eligiblePlans = filteredPlans.filter(
    (plan) => plan.eligibility_status === "eligible",
  );
  const potentialPlans = filteredPlans.filter(
    (plan) => plan.eligibility_status === "potential",
  );
  const otherPlans = filteredPlans.filter((plan) => !plan.eligibility_status);

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/4 space-y-2">
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

        <div className="w-full md:w-1/4 space-y-2">
          <Label htmlFor="category-filter">Category</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-1/4 space-y-2">
          <Label htmlFor="eligibility-filter">Eligibility</Label>
          <Select
            value={eligibilityFilter}
            onValueChange={setEligibilityFilter}
          >
            <SelectTrigger id="eligibility-filter">
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="eligible">Eligible Plans</SelectItem>
              <SelectItem value="potential">Potential Matches</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          className="w-full md:w-auto"
          onClick={() => {
            setSearchTerm("");
            setCategoryFilter("all");
            setEligibilityFilter("all");
          }}
        >
          Reset Filters
        </Button>
      </div>

      {/* Eligible Plans Section */}
      {(eligibilityFilter === "all" || eligibilityFilter === "eligible") &&
        eligiblePlans.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium flex items-center">
                <span className="mr-1">✅</span> Eligible Plans
              </div>
              <div className="text-sm text-muted-foreground">
                Plans you qualify for based on your information
              </div>
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
                    <TableHead className="w-[100px] text-right">
                      Details
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eligiblePlans.map((plan) => (
                    <TableRow key={plan.id} className="bg-green-50/30">
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
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          See More
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

      {/* Potential Matches Section */}
      {(eligibilityFilter === "all" || eligibilityFilter === "potential") &&
        potentialPlans.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium flex items-center">
                <span className="mr-1">⚡</span> Potential Matches
              </div>
              <div className="text-sm text-muted-foreground">
                Plans you might qualify for with slight adjustments
              </div>
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
                    <TableHead className="w-[100px] text-right">
                      Details
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {potentialPlans.map((plan) => (
                    <TableRow key={plan.id} className="bg-amber-50/30">
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
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          See More
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

      {/* Other Plans (if any without eligibility status) */}
      {otherPlans.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
              Other Plans
            </div>
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
                  <TableHead className="w-[100px] text-right">
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherPlans.map((plan) => (
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
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        See More
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* No results message */}
      {filteredPlans.length === 0 && (
        <div className="text-center p-8 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">
            No matching insurance plans found based on your filters.
          </p>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        Showing {filteredPlans.length} of {plans.length} plans
      </div>
    </div>
  );
}
