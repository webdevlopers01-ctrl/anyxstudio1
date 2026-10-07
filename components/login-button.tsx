"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export function LoginButton() {
  return <button className="anyx-google-login" onClick={() => createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback` } })}><span>G</span> Continue with Google</button>;
}

export function LogoutButton() {
  return <button className="btn btn-secondary text-sm" onClick={async () => { await createClient().auth.signOut(); location.href = "/"; }}><LogOut size={15} /> Logout</button>;
}
