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
import { ArrowUpDown, Search, X, ChevronDown, ChevronUp } from "lucide-react";

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
  isExpanded?: boolean;
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
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>(
    {},
  );

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

  const togglePlanExpansion = (planId: string) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
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
                    <>
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePlanExpansion(plan.id)}
                            className="flex items-center gap-1"
                          >
                            {expandedPlans[plan.id] ? (
                              <>
                                Hide Details
                                <ChevronUp className="h-3 w-3 ml-1" />
                              </>
                            ) : (
                              <>
                                See More
                                <ChevronDown className="h-3 w-3 ml-1" />
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedPlans[plan.id] && (
                        <TableRow className="bg-green-50/10">
                          <TableCell colSpan={5} className="p-4">
                            <div className="bg-white p-4 rounded-md border border-green-100 shadow-sm">
                              <h4 className="font-medium text-lg mb-3">
                                {plan.product_name} Details
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h5 className="font-medium text-sm mb-2">
                                    Plan Information
                                  </h5>
                                  <ul className="space-y-2 text-sm">
                                    <li>
                                      <span className="font-medium">
                                        Provider:
                                      </span>{" "}
                                      {plan.company_name}
                                    </li>
                                    <li>
                                      <span className="font-medium">
                                        Category:
                                      </span>{" "}
                                      {plan.product_category}
                                    </li>
                                    <li>
                                      <span className="font-medium">
                                        Monthly Premium:
                                      </span>{" "}
                                      ${plan.product_price.toFixed(2)}
                                    </li>
                                    <li>
                                      <span className="font-medium">
                                        Annual Cost:
                                      </span>{" "}
                                      ${(plan.product_price * 12).toFixed(2)}
                                    </li>
                                  </ul>
                                </div>

                                <div>
                                  <h5 className="font-medium text-sm mb-2">
                                    Coverage Details
                                  </h5>
                                  <p className="text-sm mb-2">
                                    {plan.product_benefits}
                                  </p>

                                  {plan.product_category === "Health" && (
                                    <div className="mt-3">
                                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        Includes Preventive Care
                                      </span>
                                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                                        Network: PPO
                                      </span>
                                    </div>
                                  )}

                                  {plan.product_category === "Dental" && (
                                    <div className="mt-3">
                                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        Includes Orthodontics
                                      </span>
                                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                                        No Waiting Period
                                      </span>
                                    </div>
                                  )}

                                  {plan.product_category === "Vision" && (
                                    <div className="mt-3">
                                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        Includes Designer Frames
                                      </span>
                                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                                        Annual Eye Exam
                                      </span>
                                    </div>
                                  )}

                                  {plan.product_category === "Life" && (
                                    <div className="mt-3">
                                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        Guaranteed Issue
                                      </span>
                                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                                        Level Premiums
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="mt-4">
                                <h5 className="font-medium text-sm mb-2">
                                  Additional Benefits
                                </h5>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                  <li>24/7 Customer Support</li>
                                  <li>Online Account Management</li>
                                  <li>Mobile App Access</li>
                                  {plan.product_category === "Health" && (
                                    <>
                                      <li>Telehealth Services Included</li>
                                      <li>Wellness Program Discounts</li>
                                    </>
                                  )}
                                  {plan.product_category === "Life" && (
                                    <>
                                      <li>Accelerated Death Benefit</li>
                                      <li>Waiver of Premium Option</li>
                                    </>
                                  )}
                                </ul>
                              </div>

                              <div className="mt-4 flex justify-end">
                                <Button
                                  size="sm"
                                  className="bg-teal-600 hover:bg-teal-700"
                                >
                                  Select This Plan
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
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
                    <>
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePlanExpansion(plan.id)}
                            className="flex items-center gap-1"
                          >
                            {expandedPlans[plan.id] ? (
                              <>
                                Hide Details
                                <ChevronUp className="h-3 w-3 ml-1" />
                              </>
                            ) : (
                              <>
                                See More
                                <ChevronDown className="h-3 w-3 ml-1" />
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedPlans[plan.id] && (
                        <TableRow className="bg-amber-50/10">
                          <TableCell colSpan={5} className="p-4">
                            <div className="bg-white p-4 rounded-md border border-amber-100 shadow-sm">
                              <h4 className="font-medium text-lg mb-3">
                                {plan.product_name} Details
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h5 className="font-medium text-sm mb-2">
                                    Plan Information
                                  </h5>
                                  <ul className="space-y-2 text-sm">
                                    <li>
                                      <span className="font-medium">
                                        Provider:
                                      </span>{" "}
                                      {plan.company_name}
                                    </li>
                                    <li>
                                      <span className="font-medium">
                                        Category:
                                      </span>{" "}
                                      {plan.product_category}
                                    </li>
                                    <li>
                                      <span className="font-medium">
                                        Monthly Premium:
                                      </span>{" "}
                                      ${plan.product_price.toFixed(2)}
                                    </li>
                                    <li>
                                      <span className="font-medium">
                                        Annual Cost:
                                      </span>{" "}
                                      ${(plan.product_price * 12).toFixed(2)}
                                    </li>
                                  </ul>
                                </div>

                                <div>
                                  <h5 className="font-medium text-sm mb-2">
                                    Coverage Details
                                  </h5>
                                  <p className="text-sm mb-2">
                                    {plan.product_benefits}
                                  </p>

                                  {plan.product_category === "Health" && (
                                    <div className="mt-3">
                                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        Includes Preventive Care
                                      </span>
                                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                                        Network: PPO
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="mt-4 bg-amber-50 p-3 rounded-md border border-amber-200">
                                <h5 className="font-medium text-sm mb-2 text-amber-800">
                                  Qualification Requirements
                                </h5>
                                <p className="text-sm text-amber-800">
                                  You may qualify for this plan with the
                                  following adjustments:
                                </p>
                                <ul className="list-disc pl-5 text-sm space-y-1 text-amber-800 mt-2">
                                  <li>
                                    Remove certain health conditions from your
                                    profile
                                  </li>
                                  <li>
                                    Provide additional medical documentation
                                  </li>
                                  <li>
                                    Consider a slightly higher deductible option
                                  </li>
                                </ul>
                              </div>

                              <div className="mt-4 flex justify-end">
                                <Button
                                  size="sm"
                                  className="bg-amber-600 hover:bg-amber-700"
                                >
                                  Check Eligibility
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
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
                  <>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePlanExpansion(plan.id)}
                          className="flex items-center gap-1"
                        >
                          {expandedPlans[plan.id] ? (
                            <>
                              Hide Details
                              <ChevronUp className="h-3 w-3 ml-1" />
                            </>
                          ) : (
                            <>
                              See More
                              <ChevronDown className="h-3 w-3 ml-1" />
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedPlans[plan.id] && (
                      <TableRow>
                        <TableCell colSpan={5} className="p-4">
                          <div className="bg-white p-4 rounded-md border shadow-sm">
                            <h4 className="font-medium text-lg mb-3">
                              {plan.product_name} Details
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h5 className="font-medium text-sm mb-2">
                                  Plan Information
                                </h5>
                                <ul className="space-y-2 text-sm">
                                  <li>
                                    <span className="font-medium">
                                      Provider:
                                    </span>{" "}
                                    {plan.company_name}
                                  </li>
                                  <li>
                                    <span className="font-medium">
                                      Category:
                                    </span>{" "}
                                    {plan.product_category}
                                  </li>
                                  <li>
                                    <span className="font-medium">
                                      Monthly Premium:
                                    </span>{" "}
                                    ${plan.product_price.toFixed(2)}
                                  </li>
                                  <li>
                                    <span className="font-medium">
                                      Annual Cost:
                                    </span>{" "}
                                    ${(plan.product_price * 12).toFixed(2)}
                                  </li>
                                </ul>
                              </div>

                              <div>
                                <h5 className="font-medium text-sm mb-2">
                                  Coverage Details
                                </h5>
                                <p className="text-sm mb-2">
                                  {plan.product_benefits}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                              <Button
                                size="sm"
                                className="bg-gray-600 hover:bg-gray-700"
                              >
                                View Plan
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
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
