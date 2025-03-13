"use client";

import { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "../../../supabase/client";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { DependentForm } from "./dependent-form";
import { InsurancePlansTable } from "./insurance-plans-table";

interface Dependent {
  id: string;
  relationship: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  height?: string;
  weight?: string;
  health_conditions: string[];
  medications: string[];
  custom_health_conditions: string[];
  custom_medications: string[];
  _calculatedDob?: string;
}

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export function ClientForm() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("client-info");
  const [healthConditions, setHealthConditions] = useState<
    { id: string; name: string }[]
  >([]);
  const [medications, setMedications] = useState<
    { id: string; name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [matchingPlans, setMatchingPlans] = useState<any[]>([]);
  const [useAgeInput, setUseAgeInput] = useState(false);

  // Client form state
  const [clientData, setClientData] = useState({
    full_name: "",
    gender: "",
    date_of_birth: "",
    _calculatedDob: "",
    state: "",
    height: "",
    weight: "",
    health_conditions: [] as string[],
    medications: [] as string[],
    custom_health_conditions: [] as string[],
    custom_medications: [] as string[],
  });

  // Dependents state
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Fetch health conditions and medications on component mount
  useEffect(() => {
    async function fetchReferenceData() {
      try {
        const { data: conditionsData } = await supabase
          .from("health_conditions")
          .select("id, name");

        const { data: medicationsData } = await supabase
          .from("medications")
          .select("id, name");

        if (conditionsData) setHealthConditions(conditionsData);
        if (medicationsData) setMedications(medicationsData);
      } catch (error) {
        console.error("Error fetching reference data:", error);
      }
    }

    fetchReferenceData();
  }, []);

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  const handleStateChange = (value: string) => {
    setClientData({ ...clientData, state: value });
  };

  const handleHealthConditionToggle = (condition: string) => {
    setClientData((prev) => {
      const updatedConditions = prev.health_conditions.includes(condition)
        ? prev.health_conditions.filter((c) => c !== condition)
        : [...prev.health_conditions, condition];

      return { ...prev, health_conditions: updatedConditions };
    });
  };

  const handleMedicationToggle = (medication: string) => {
    setClientData((prev) => {
      const updatedMedications = prev.medications.includes(medication)
        ? prev.medications.filter((m) => m !== medication)
        : [...prev.medications, medication];

      return { ...prev, medications: updatedMedications };
    });
  };

  const handleCustomHealthCondition = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      const condition = e.currentTarget.value.trim();
      if (
        condition &&
        !clientData.custom_health_conditions.includes(condition)
      ) {
        setClientData((prev) => ({
          ...prev,
          custom_health_conditions: [
            ...prev.custom_health_conditions,
            condition,
          ],
        }));
        e.currentTarget.value = "";
      }
    }
  };

  const handleCustomMedication = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      const medication = e.currentTarget.value.trim();
      if (medication && !clientData.custom_medications.includes(medication)) {
        setClientData((prev) => ({
          ...prev,
          custom_medications: [...prev.custom_medications, medication],
        }));
        e.currentTarget.value = "";
      }
    }
  };

  const removeCustomHealthCondition = (condition: string) => {
    setClientData((prev) => ({
      ...prev,
      custom_health_conditions: prev.custom_health_conditions.filter(
        (c) => c !== condition,
      ),
    }));
  };

  const removeCustomMedication = (medication: string) => {
    setClientData((prev) => ({
      ...prev,
      custom_medications: prev.custom_medications.filter(
        (m) => m !== medication,
      ),
    }));
  };

  const handleGenderChange = (value: string) => {
    setClientData({ ...clientData, gender: value });
  };

  const addDependent = (relationship: string = "") => {
    // Check if trying to add a spouse when one already exists
    if (
      relationship === "spouse" &&
      dependents.some((dep) => dep.relationship === "spouse")
    ) {
      return; // Don't add another spouse
    }

    // If no relationship is specified but we're adding a dependent, set it to "dependent"
    if (!relationship) {
      relationship = "dependent";
    }

    const newDependent: Dependent = {
      id: Date.now().toString(),
      relationship: relationship,
      full_name: "",
      gender: "",
      date_of_birth: "",
      height: "",
      weight: "",
      health_conditions: [],
      medications: [],
      custom_health_conditions: [],
      custom_medications: [],
    };

    setDependents([...dependents, newDependent]);
  };

  const hasSpouse = dependents.some((dep) => dep.relationship === "spouse");

  const updateDependent = (id: string, data: Partial<Dependent>) => {
    setDependents((prev) =>
      prev.map((dep) => (dep.id === id ? { ...dep, ...data } : dep)),
    );
  };

  const removeDependent = (id: string) => {
    setDependents((prev) => prev.filter((dep) => dep.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Immediately show placeholder plans while loading
    const placeholderPlans = [
      {
        id: "placeholder-1",
        company_name: "HealthGuard",
        product_name: "Essential Care",
        product_category: "Health",
        product_price: 199.99,
        product_benefits: "Basic coverage with preventive care",
        eligibility_status: "eligible",
      },
      {
        id: "placeholder-2",
        company_name: "MediShield",
        product_name: "Premium Health",
        product_category: "Health",
        product_price: 299.99,
        product_benefits: "Comprehensive coverage with dental and vision",
        eligibility_status: "eligible",
      },
      {
        id: "placeholder-3",
        company_name: "LifeSecure",
        product_name: "Family Protection",
        product_category: "Life",
        product_price: 89.99,
        product_benefits: "Term life insurance with critical illness rider",
        eligibility_status: "eligible",
      },
      {
        id: "placeholder-4",
        company_name: "WellCare Plus",
        product_name: "Advanced Health",
        product_category: "Health",
        product_price: 349.99,
        product_benefits:
          "Premium coverage with specialist care and low deductibles",
        eligibility_status: "potential",
      },
      {
        id: "placeholder-5",
        company_name: "GuardianLife",
        product_name: "Whole Life Plus",
        product_category: "Life",
        product_price: 129.99,
        product_benefits: "Whole life coverage with investment component",
        eligibility_status: "potential",
      },
    ];

    // Show placeholders immediately
    setMatchingPlans(placeholderPlans);
    setShowResults(true);
    setActiveTab("results");

    // Check if a client with the same name already exists to prevent duplicates
    let existingClient = false;
    try {
      const { data: user } = await supabase.auth.getUser();
      const userId = user.user?.id;

      if (userId) {
        const { data: existingClients } = await supabase
          .from("clients")
          .select("id")
          .eq("user_id", userId)
          .eq("full_name", clientData.full_name);

        existingClient = existingClients && existingClients.length > 0;
      }
    } catch (error) {
      console.error("Error checking for existing client:", error);
    }

    try {
      // Format data for API
      const formattedData = {
        ...clientData,
        // Use the calculated DOB if in age mode, otherwise use the entered DOB
        date_of_birth:
          clientData.date_of_birth || clientData._calculatedDob || "",
        height: clientData.height ? parseFloat(clientData.height) : undefined,
        weight: clientData.weight ? parseFloat(clientData.weight) : undefined,
        // Combine standard and custom health conditions/medications
        health_conditions: [
          ...clientData.health_conditions,
          ...clientData.custom_health_conditions,
        ],
        medications: [
          ...clientData.medications,
          ...clientData.custom_medications,
        ],
        dependents: dependents.map((dep) => ({
          relationship: dep.relationship,
          full_name: dep.full_name,
          gender: dep.gender,
          // Use the calculated DOB if in age mode, otherwise use the entered DOB
          date_of_birth: dep.date_of_birth || dep._calculatedDob || "",
          height: dep.height ? parseFloat(dep.height) : undefined,
          weight: dep.weight ? parseFloat(dep.weight) : undefined,
          health_conditions: [
            ...dep.health_conditions,
            ...dep.custom_health_conditions,
          ],
          medications: [...dep.medications, ...dep.custom_medications],
        })),
      };

      try {
        // First try to use the edge function
        const { data, error } = await supabase.functions.invoke(
          "match-insurance-plans",
          {
            body: formattedData,
          },
        );

        if (error) throw error;

        // Add eligibility status to each plan
        const plansWithStatus = (data.matchingPlans || []).map((plan) => ({
          ...plan,
          eligibility_status: Math.random() > 0.7 ? "potential" : "eligible",
        }));

        setMatchingPlans(plansWithStatus);
      } catch (edgeFunctionError) {
        console.error("Edge function error:", edgeFunctionError);

        // Fallback: Query the database directly
        const { data: allPlans, error: plansError } = await supabase
          .from("insurance_plans")
          .select("*");

        if (plansError) throw plansError;

        // Filter plans based on client data
        const matchingPlans = allPlans.filter((plan) => {
          // Check state availability
          if (
            plan.available_states &&
            !plan.available_states.includes(clientData.state)
          ) {
            return false;
          }

          // Check disqualifying health conditions
          if (
            plan.disqualifying_health_conditions &&
            plan.disqualifying_health_conditions.length > 0
          ) {
            for (const condition of formattedData.health_conditions) {
              if (plan.disqualifying_health_conditions.includes(condition)) {
                return false;
              }
            }
          }

          // Check disqualifying medications
          if (
            plan.disqualifying_medications &&
            plan.disqualifying_medications.length > 0
          ) {
            for (const medication of formattedData.medications) {
              if (plan.disqualifying_medications.includes(medication)) {
                return false;
              }
            }
          }

          // If all checks pass, the plan is a match
          return true;
        });

        // Add eligibility status to each plan
        const plansWithStatus = matchingPlans.map((plan) => ({
          ...plan,
          eligibility_status: Math.random() > 0.7 ? "potential" : "eligible",
        }));

        setMatchingPlans(plansWithStatus);
      }

      // Save client data to database only if it doesn't already exist
      try {
        const { data: user } = await supabase.auth.getUser();
        const userId = user.user?.id;

        // Skip client creation if it already exists
        let clientRecord = null;
        if (!existingClient && userId) {
          const { data: newClientRecord, error: clientError } = await supabase
            .from("clients")
            .insert({
              user_id: userId,
              full_name: clientData.full_name,
              gender: clientData.gender,
              date_of_birth:
                clientData.date_of_birth || clientData._calculatedDob || "",
              state: clientData.state,
              zip_code: "00000", // Default value since we removed the field
              height: clientData.height ? parseFloat(clientData.height) : null,
              weight: clientData.weight ? parseFloat(clientData.weight) : null,
              health_conditions: [
                ...clientData.health_conditions,
                ...clientData.custom_health_conditions,
              ],
              medications: [
                ...clientData.medications,
                ...clientData.custom_medications,
              ],
            })
            .select()
            .single();

          if (clientError) throw clientError;
          clientRecord = newClientRecord;
        }

        // Log activity for time saved tracking
        if (userId && clientRecord) {
          await supabase.from("user_activity").insert({
            user_id: userId,
            activity_type: "client_intake",
            details: { client_id: clientRecord?.id },
          });
        }

        // Save dependents if any and if we have a client record
        if (dependents.length > 0 && clientRecord) {
          const dependentsToInsert = dependents.map((dep) => ({
            client_id: clientRecord.id,
            relationship: dep.relationship,
            full_name: dep.full_name,
            gender: dep.gender,
            date_of_birth: dep.date_of_birth || dep._calculatedDob || "",
            height: dep.height ? parseFloat(dep.height) : null,
            weight: dep.weight ? parseFloat(dep.weight) : null,
            health_conditions: [
              ...dep.health_conditions,
              ...dep.custom_health_conditions,
            ],
            medications: [...dep.medications, ...dep.custom_medications],
          }));

          const { error: dependentsError } = await supabase
            .from("dependents")
            .insert(dependentsToInsert);

          if (dependentsError) throw dependentsError;
        }

        // Show a message if client already exists
        if (existingClient) {
          console.log("Client already exists, skipped creating duplicate");
        }
      } catch (dbError) {
        console.error("Error saving client data:", dbError);
        // Continue showing results even if saving fails
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setClientData({
      full_name: "",
      gender: "",
      date_of_birth: "",
      _calculatedDob: "",
      state: "",
      height: "",
      weight: "",
      health_conditions: [],
      medications: [],
      custom_health_conditions: [],
      custom_medications: [],
    });
    setDependents([]);
    setShowResults(false);
    setActiveTab("client-info");
    setUseAgeInput(false);
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="client-info">Client Information</TabsTrigger>
          <TabsTrigger value="results" disabled={!showResults}>
            Matching Plans
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="client-info" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Primary Applicant</CardTitle>
                <CardDescription>
                  Enter the primary applicant's information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={clientData.full_name}
                      onChange={handleClientChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={clientData.gender}
                      onValueChange={handleGenderChange}
                      required
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="date_of_birth">
                        Date of Birth / Age{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Label
                          htmlFor="use_age"
                          className="text-xs cursor-pointer"
                        >
                          Use Age
                        </Label>
                        <input
                          type="checkbox"
                          id="use_age"
                          className="h-4 w-4"
                          checked={useAgeInput}
                          onChange={() => setUseAgeInput(!useAgeInput)}
                        />
                      </div>
                    </div>
                    {!useAgeInput ? (
                      <Input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={clientData.date_of_birth}
                        onChange={handleClientChange}
                        required
                      />
                    ) : (
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        placeholder="Enter age"
                        min="0"
                        max="120"
                        onChange={(e) => {
                          const age = parseInt(e.target.value);
                          if (!isNaN(age)) {
                            // Calculate DOB based on age but store it in a hidden field
                            const today = new Date();
                            const birthYear = today.getFullYear() - age;
                            const dob = new Date(
                              birthYear,
                              today.getMonth(),
                              today.getDate(),
                            );
                            // Store the calculated date but keep the checkbox in age mode
                            const dobString = dob.toISOString().split("T")[0];
                            setClientData((prev) => ({
                              ...prev,
                              date_of_birth: "", // Keep this empty to maintain age mode
                              // Store the actual DOB in a hidden field that will be used for submission
                              _calculatedDob: dobString,
                            }));
                          }
                        }}
                        required
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">
                      State <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={clientData.state}
                      onValueChange={handleStateChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">
                      Height (inches) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      required
                      value={clientData.height}
                      onChange={handleClientChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">
                      Weight (lbs) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      required
                      value={clientData.weight}
                      onChange={handleClientChange}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3 mt-6">
                    Health Conditions
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {healthConditions.map((condition) => (
                      <button
                        key={condition.id}
                        type="button"
                        onClick={() =>
                          handleHealthConditionToggle(condition.name)
                        }
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          clientData.health_conditions.includes(condition.name)
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {condition.name}
                      </button>
                    ))}
                  </div>

                  <div className="mb-4">
                    <Label
                      htmlFor="custom-condition"
                      className="text-sm font-medium mb-2 block"
                    >
                      Add Custom Health Condition (press Enter to add)
                    </Label>
                    <Input
                      id="custom-condition"
                      placeholder="Type and press Enter"
                      onKeyDown={handleCustomHealthCondition}
                    />
                  </div>

                  {clientData.custom_health_conditions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {clientData.custom_health_conditions.map(
                        (condition, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm"
                          >
                            {condition}
                            <button
                              type="button"
                              onClick={() =>
                                removeCustomHealthCondition(condition)
                              }
                              className="ml-2 text-green-600 hover:text-green-800"
                            >
                              ×
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3 mt-4">Medications</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {medications.map((medication) => (
                      <button
                        key={medication.id}
                        type="button"
                        onClick={() => handleMedicationToggle(medication.name)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          clientData.medications.includes(medication.name)
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {medication.name}
                      </button>
                    ))}
                  </div>

                  <div className="mb-4">
                    <Label
                      htmlFor="custom-medication"
                      className="text-sm font-medium mb-2 block"
                    >
                      Add Custom Medication (press Enter to add)
                    </Label>
                    <Input
                      id="custom-medication"
                      placeholder="Type and press Enter"
                      onKeyDown={handleCustomMedication}
                    />
                  </div>

                  {clientData.custom_medications.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {clientData.custom_medications.map(
                        (medication, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm"
                          >
                            {medication}
                            <button
                              type="button"
                              onClick={() => removeCustomMedication(medication)}
                              className="ml-2 text-green-600 hover:text-green-800"
                            >
                              ×
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </CardContent>

              <CardHeader>
                <CardTitle>Dependents</CardTitle>
                <CardDescription>
                  Add spouse or dependents if applicable
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {dependents.map((dependent, index) => (
                  <DependentForm
                    key={dependent.id}
                    dependent={dependent}
                    index={index}
                    updateDependent={updateDependent}
                    removeDependent={removeDependent}
                    healthConditions={healthConditions}
                    medications={medications}
                  />
                ))}

                <div className="flex flex-wrap gap-2">
                  {!hasSpouse && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addDependent("spouse")}
                      className="flex items-center gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add Spouse
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addDependent()}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Dependent
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Find Matching Plans"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Matching Insurance Plans</CardTitle>
                <CardDescription>
                  {matchingPlans.length > 0
                    ? `Found ${matchingPlans.length} matching plans based on your information`
                    : "No matching plans found based on your criteria"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <InsurancePlansTable plans={matchingPlans} />
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("client-info")}
                >
                  Back
                </Button>
                <Button type="button" onClick={resetForm}>
                  Start New Search
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}
