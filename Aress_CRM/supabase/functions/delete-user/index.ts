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
    const authHeader = req.headers.get("authorization");
    console.error("Auth header: " + (authHeader ? "YES" : "NO"));
    
    if (!authHeader) {
      console.error("NO AUTH HEADER - returning 401");
      return new Response(
        JSON.stringify({ success: false, error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const parts = token.split('.');
    console.error("Token parts: " + parts.length);
    
    if (parts.length !== 3) {
      console.error("Invalid token format");
      return new Response(
        JSON.stringify({ success: false, error: "Invalid token format" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    let payload: any;
    try {
      const decoded = atob(parts[1]);
      payload = JSON.parse(decoded);
      console.error("Decoded JWT successfully");
      console.error("Email: " + payload.email);
    } catch (e) {
      console.error("Decode failed: " + String(e));
      return new Response(
        JSON.stringify({ success: false, error: "Failed to decode token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const email = payload?.email;
    console.error("Checking email: " + email + " === admin@gmail.com");
    
    if (email !== 'admin@gmail.com') {
      console.error("NOT ADMIN - returning 401");
      return new Response(
        JSON.stringify({ success: false, error: "Not admin" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.error("Admin verified!");
    
    const text = await req.text();
    const body = JSON.parse(text);
    const userId = body.userId;
    
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
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Delete error: " + String(deleteError));
      return new Response(
        JSON.stringify({ success: false, error: "Delete failed" }),
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
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

serve(handler);
