import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const WEBHOOK_SECRET = Deno.env.get("KIWIFY_WEBHOOK_SECRET"); // Opcional: você pode definir no Console

  // Verificação opcional de segredo
  if (WEBHOOK_SECRET) {
    const headerSecret = req.headers.get("x-webhook-secret");
    if (!headerSecret || headerSecret !== WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const payload = await req.json().catch(() => null);
  if (!payload) {
    return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
  }

  // Adapte estes campos conforme o formato do webhook da Kiwify
  const email: string | undefined =
    payload?.buyer?.email || payload?.customer?.email || payload?.email;
  const productId: string | undefined =
    payload?.product?.id?.toString?.() || payload?.product_id?.toString?.();

  if (!email || !productId) {
    return new Response("Missing email or product_id", { status: 400, headers: corsHeaders });
  }

  // Encontrar mapeamento produto->curso
  const { data: mapping, error: mapErr } = await supabase
    .from("product_mappings")
    .select("course_id")
    .eq("provider", "kiwify")
    .eq("product_id", productId)
    .maybeSingle();

  if (mapErr) {
    console.error("Mapping error:", mapErr);
    return new Response("Mapping error", { status: 500, headers: corsHeaders });
  }
  if (!mapping) {
    return new Response("No mapping for product", { status: 404, headers: corsHeaders });
  }

  // Tentar achar perfil pelo email
  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (profErr) {
    console.error("Profile lookup error:", profErr);
    return new Response("Profile lookup error", { status: 500, headers: corsHeaders });
  }

  if (profile?.id) {
    // Criar matrícula diretamente
    const { error: enrErr } = await supabase
      .from("enrollments")
      .insert({
        user_id: profile.id,
        course_id: mapping.course_id,
        status: "active",
        payment_status: "paid",
      });

    if (enrErr) {
      console.error("Enrollment error:", enrErr);
      return new Response("Enrollment error", { status: 500, headers: corsHeaders });
    }
  } else {
    // Guardar como pendente até o usuário criar conta
    const { error: pendErr } = await supabase
      .from("pending_enrollments")
      .insert({
        email,
        course_id: mapping.course_id,
      });

    if (pendErr) {
      console.error("Pending enrollment error:", pendErr);
      return new Response("Pending enrollment error", { status: 500, headers: corsHeaders });
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});