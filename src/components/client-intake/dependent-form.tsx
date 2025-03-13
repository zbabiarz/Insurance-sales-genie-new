"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
}

interface DependentFormProps {
  dependent: Dependent;
  index: number;
  updateDependent: (id: string, data: Partial<Dependent>) => void;
  removeDependent: (id: string) => void;
  healthConditions: { id: string; name: string }[];
  medications: { id: string; name: string }[];
}

export function DependentForm({
  dependent,
  index,
  updateDependent,
  removeDependent,
  healthConditions,
  medications,
}: DependentFormProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateDependent(dependent.id, { [name]: value });
  };

  const handleRelationshipChange = (value: string) => {
    updateDependent(dependent.id, { relationship: value });
  };

  const handleHealthConditionToggle = (condition: string) => {
    const updatedConditions = dependent.health_conditions.includes(condition)
      ? dependent.health_conditions.filter((c) => c !== condition)
      : [...dependent.health_conditions, condition];

    updateDependent(dependent.id, { health_conditions: updatedConditions });
  };

  const handleMedicationToggle = (medication: string) => {
    const updatedMedications = dependent.medications.includes(medication)
      ? dependent.medications.filter((m) => m !== medication)
      : [...dependent.medications, medication];

    updateDependent(dependent.id, { medications: updatedMedications });
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-lg"
    >
      <div className="flex items-center justify-between p-4 bg-muted/30">
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <h3 className="text-md font-medium">
            {dependent.full_name ||
              (dependent.relationship === "spouse"
                ? "Spouse"
                : `Dependent ${index + 1}`)}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeDependent(dependent.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 h-7 w-7"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <CollapsibleContent>
        <CardContent className="p-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor={`relationship-${dependent.id}`}>
                Relationship <span className="text-red-500">*</span>
              </Label>
              <Select
                value={dependent.relationship}
                onValueChange={handleRelationshipChange}
                required
              >
                <SelectTrigger id={`relationship-${dependent.id}`}>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`full_name-${dependent.id}`}>
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`full_name-${dependent.id}`}
                name="full_name"
                value={dependent.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`gender-${dependent.id}`}>
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select
                value={dependent.gender}
                onValueChange={(value) =>
                  updateDependent(dependent.id, { gender: value })
                }
                required
              >
                <SelectTrigger id={`gender-${dependent.id}`}>
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
                <Label htmlFor={`date_of_birth-${dependent.id}`}>
                  Date of Birth / Age <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center space-x-2">
                  <Label
                    htmlFor={`use_age-${dependent.id}`}
                    className="text-xs cursor-pointer"
                  >
                    Use Age
                  </Label>
                  <input
                    type="checkbox"
                    id={`use_age-${dependent.id}`}
                    className="h-4 w-4"
                    checked={!dependent.date_of_birth}
                    onChange={() => {
                      if (dependent.date_of_birth) {
                        updateDependent(dependent.id, { date_of_birth: "" });
                      } else {
                        // Set a default date if switching back to DOB
                        updateDependent(dependent.id, {
                          date_of_birth: new Date().toISOString().split("T")[0],
                        });
                      }
                    }}
                  />
                </div>
              </div>
              {dependent.date_of_birth ? (
                <Input
                  id={`date_of_birth-${dependent.id}`}
                  name="date_of_birth"
                  type="date"
                  value={dependent.date_of_birth}
                  onChange={handleChange}
                  required
                />
              ) : (
                <Input
                  id={`age-${dependent.id}`}
                  name="age"
                  type="number"
                  placeholder="Enter age"
                  min="0"
                  max="120"
                  onChange={(e) => {
                    const age = parseInt(e.target.value);
                    if (!isNaN(age)) {
                      // Calculate DOB based on age
                      const today = new Date();
                      const birthYear = today.getFullYear() - age;
                      const dob = new Date(
                        birthYear,
                        today.getMonth(),
                        today.getDate(),
                      );
                      // Store the calculated date in a hidden field but keep age mode active
                      updateDependent(dependent.id, {
                        date_of_birth: "", // Keep empty to maintain age mode
                        _calculatedDob: dob.toISOString().split("T")[0], // Store actual DOB for submission
                      });
                    }
                  }}
                  required
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor={`height-${dependent.id}`}>
                  Height (inches) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`height-${dependent.id}`}
                  name="height"
                  type="number"
                  value={dependent.height}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`weight-${dependent.id}`}>
                  Weight (lbs) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`weight-${dependent.id}`}
                  name="weight"
                  type="number"
                  value={dependent.weight}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Health Conditions</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {healthConditions.map((condition) => (
                  <button
                    key={condition.id}
                    type="button"
                    onClick={() => handleHealthConditionToggle(condition.name)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      dependent.health_conditions.includes(condition.name)
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {condition.name}
                  </button>
                ))}
              </div>

              <div className="mb-3">
                <Label
                  htmlFor={`custom-condition-${dependent.id}`}
                  className="text-xs font-medium mb-1 block"
                >
                  Add Custom Health Condition
                </Label>
                <Input
                  id={`custom-condition-${dependent.id}`}
                  placeholder="Type and press Enter"
                  size={3}
                  className="text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent form submission
                      const condition = e.currentTarget.value.trim();
                      if (
                        condition &&
                        !dependent.custom_health_conditions.includes(condition)
                      ) {
                        updateDependent(dependent.id, {
                          custom_health_conditions: [
                            ...dependent.custom_health_conditions,
                            condition,
                          ],
                        });
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
              </div>

              {dependent.custom_health_conditions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {dependent.custom_health_conditions.map(
                    (condition, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                      >
                        {condition}
                        <button
                          type="button"
                          onClick={() => {
                            updateDependent(dependent.id, {
                              custom_health_conditions:
                                dependent.custom_health_conditions.filter(
                                  (c) => c !== condition,
                                ),
                            });
                          }}
                          className="ml-1 text-green-600 hover:text-green-800"
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
              <h4 className="text-sm font-medium mb-2">Medications</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {medications.map((medication) => (
                  <button
                    key={medication.id}
                    type="button"
                    onClick={() => handleMedicationToggle(medication.name)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      dependent.medications.includes(medication.name)
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {medication.name}
                  </button>
                ))}
              </div>

              <div className="mb-3">
                <Label
                  htmlFor={`custom-medication-${dependent.id}`}
                  className="text-xs font-medium mb-1 block"
                >
                  Add Custom Medication
                </Label>
                <Input
                  id={`custom-medication-${dependent.id}`}
                  placeholder="Type and press Enter"
                  size={3}
                  className="text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent form submission
                      const medication = e.currentTarget.value.trim();
                      if (
                        medication &&
                        !dependent.custom_medications.includes(medication)
                      ) {
                        updateDependent(dependent.id, {
                          custom_medications: [
                            ...dependent.custom_medications,
                            medication,
                          ],
                        });
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
              </div>

              {dependent.custom_medications.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {dependent.custom_medications.map((medication, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                    >
                      {medication}
                      <button
                        type="button"
                        onClick={() => {
                          updateDependent(dependent.id, {
                            custom_medications:
                              dependent.custom_medications.filter(
                                (m) => m !== medication,
                              ),
                          });
                        }}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </CollapsibleContent>
    </Collapsible>
  );
}
