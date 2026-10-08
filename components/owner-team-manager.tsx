"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, UserCog } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Role = "owner" | "admin" | "artist" | "customer";
type Member = { id: string; full_name: string | null; role: Role };

export function OwnerTeamManager({ currentRole = "owner" }: { currentRole?: "owner" | "admin" }) {
  const supabase = createClient();
  const [members, setMembers] = useState<Member[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const load = async () => { const { data, error } = await supabase.rpc("list_anyx_team_members"); if (error) setError(error.message); else setMembers(data || []); };
  useEffect(() => { load(); }, []);
  const setRole = async (id: string, role: Exclude<Role, "owner">) => { setBusy(id); setError(""); const { error } = await supabase.rpc("set_anyx_team_role", { target_user_id: id, next_role: role }); if (error) setError(error.message); else await load(); setBusy(null); };
  return <section className="owner-team-panel"><div><span className="section-label">{currentRole === "owner" ? "Owner access" : "Admin access"}</span><h2><UserCog size={18} /> Team roles</h2><p>{currentRole === "owner" ? "Manage admins, artists and customer access from your workspace." : "Add or remove artists from your workspace. Only the owner can manage admins."}</p></div>{error && <p className="owner-team-error">{error}</p>}<div className="owner-team-list">{members.map(member => <div key={member.id} className="owner-team-row"><div><b>{member.full_name || "Team member"}</b><span>{member.role === "owner" ? "Owner account" : `${member.role} workspace`}</span></div>{member.role === "owner" ? <span className="owner-role-badge"><ShieldCheck size={13} /> Owner</span> : <select aria-label={`Role for ${member.full_name || "team member"}`} disabled={busy === member.id || (currentRole === "admin" && member.role === "admin")} value={member.role} onChange={event => setRole(member.id, event.target.value as Exclude<Role, "owner">)}><option value="customer">Customer</option><option value="artist">Artist</option>{currentRole === "owner" && <option value="admin">Admin</option>}</select>}</div>)}</div></section>;
}
