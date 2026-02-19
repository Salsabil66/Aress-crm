import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info",
};

async function handler(req: Request): Promise<Response> {
  console.error("=== REQUEST: " + req.method + " ===");
  
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    console.error("Handling OPTIONS");
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    console.error("Invalid method: " + req.method);
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    console.error("Processing POST request");
    
    // Parse body to get userId
    let userId = null;
    try {
      const text = await req.text();
      console.error("Body text: " + (text ? "has content" : "empty"));
      if (text && text.trim()) {
        const body = JSON.parse(text);
        userId = body.userId;
        console.error("Parsed userId: " + userId);
      }
    } catch (e) {
      console.error("Body parse error: " + String(e));
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!userId) {
      console.error("No userId provided");
      return new Response(
        JSON.stringify({ success: false, error: "userId required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.error("Deleting user: " + userId);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error("Missing env vars");
      return new Response(
        JSON.stringify({ success: false, error: "Missing environment" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    console.error("Calling auth.admin.deleteUser with userId: " + userId);
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Delete error: " + String(deleteError));
      return new Response(
        JSON.stringify({ success: false, error: "Delete failed: " + String(deleteError) }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.error("SUCCESS - User deleted!");
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Exception: " + String(err));
    return new Response(
      JSON.stringify({ success: false, error: "Server error: " + String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

serve(handler);
