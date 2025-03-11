import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";

interface ClientData {
  full_name: string;
  date_of_birth: string;
  zip_code: string;
  state: string;
  height?: number;
  weight?: number;
  health_conditions: string[];
  medications: string[];
  dependents?: Dependent[];
}

interface Dependent {
  relationship: string;
  full_name: string;
  date_of_birth: string;
  height?: number;
  weight?: number;
  health_conditions: string[];
  medications: string[];
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get client data from request
    const clientData: ClientData = await req.json();

    // Validate required fields
    if (
      !clientData.full_name ||
      !clientData.date_of_birth ||
      !clientData.state ||
      !clientData.zip_code
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get all insurance plans
    const { data: allPlans, error: plansError } = await supabase
      .from("insurance_plans")
      .select("*");

    if (plansError) {
      throw plansError;
    }

    // Filter plans based on client data
    const matchingPlans = allPlans.filter((plan) => {
      // Check state availability
      if (
        plan.available_states &&
        !plan.available_states.includes(clientData.state)
      ) {
        return false;
      }

      // Check ZIP code availability if specified
      if (
        plan.available_zip_codes &&
        plan.available_zip_codes.length > 0 &&
        !plan.available_zip_codes.includes(clientData.zip_code)
      ) {
        return false;
      }

      // Check disqualifying health conditions
      if (
        plan.disqualifying_health_conditions &&
        plan.disqualifying_health_conditions.length > 0
      ) {
        for (const condition of clientData.health_conditions || []) {
          if (plan.disqualifying_health_conditions.includes(condition)) {
            return false;
          }
        }

        // Also check dependents' health conditions if any
        if (clientData.dependents && clientData.dependents.length > 0) {
          for (const dependent of clientData.dependents) {
            for (const condition of dependent.health_conditions || []) {
              if (plan.disqualifying_health_conditions.includes(condition)) {
                return false;
              }
            }
          }
        }
      }

      // Check disqualifying medications
      if (
        plan.disqualifying_medications &&
        plan.disqualifying_medications.length > 0
      ) {
        for (const medication of clientData.medications || []) {
          if (plan.disqualifying_medications.includes(medication)) {
            return false;
          }
        }

        // Also check dependents' medications if any
        if (clientData.dependents && clientData.dependents.length > 0) {
          for (const dependent of clientData.dependents) {
            for (const medication of dependent.medications || []) {
              if (plan.disqualifying_medications.includes(medication)) {
                return false;
              }
            }
          }
        }
      }

      // If all checks pass, the plan is a match
      return true;
    });

    return new Response(JSON.stringify({ matchingPlans }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
