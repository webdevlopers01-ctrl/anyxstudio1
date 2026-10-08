import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { data: actor } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const role = String(body.role || "artist");
  if (!actor || !["owner", "admin"].includes(actor.role)) return NextResponse.json({ error: "Only owner or admin can invite members" }, { status: 403 });
  if (!["admin", "artist", "customer"].includes(role) || (actor.role === "admin" && role !== "artist")) return NextResponse.json({ error: "Admins can invite artists only" }, { status: 403 });
  if (!email || !email.includes("@")) return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return NextResponse.json({ error: "Server invite key is not configured" }, { status: 503 });
  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: invited, error } = await admin.auth.admin.inviteUserByEmail(email);
  if (error || !invited.user) return NextResponse.json({ error: error?.message || "Invite failed" }, { status: 400 });
  const { error: profileError } = await admin.from("profiles").upsert({ id: invited.user.id, full_name: invited.user.user_metadata?.full_name || email.split("@")[0], role, active: true }, { onConflict: "id" });
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
