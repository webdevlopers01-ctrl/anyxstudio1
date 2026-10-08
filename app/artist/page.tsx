"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "@/components/login-button";

export default function Artist() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { location.href = "/login"; return; }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role === "owner" || profile?.role === "admin") { location.href = "/admin"; return; }
    if (profile?.role !== "artist") { location.href = "/customer"; return; }
    const { data } = await supabase.from("tasks").select("*").order("deadline", { ascending: true });
    setTasks(data || []); setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const status = async (id: string, nextStatus: string) => {
    const { error } = await supabase.rpc("update_anyx_task_status", { target_task_id: id, next_status: nextStatus });
    if (error) alert(error.message); else load();
  };
  if (loading) return <main className="min-h-screen bg-[#07070a] grid place-items-center">Loading…</main>;
  return <main className="min-h-screen bg-[#07070a]"><div className="container py-8"><div className="flex justify-between items-center"><div><div className="text-xs uppercase tracking-widest text-violet-400">Artist Portal</div><h1 className="text-4xl font-black mt-2">My Work</h1><p className="muted mt-1">Only sanitized task briefs are visible here.</p></div><LogoutButton /></div><div className="space-y-4 mt-8">{tasks.map(task => <article className="card p-6" key={task.id}><div className="flex justify-between gap-4"><div><div className="text-xs text-violet-400 uppercase tracking-widest">{task.priority}</div><h2 className="text-2xl font-black mt-1">{task.title}</h2><p className="muted mt-3 whitespace-pre-wrap leading-7">{task.brief}</p></div><div className="text-xs text-zinc-500">{task.deadline || "No deadline"}</div></div><div className="mt-5 flex gap-2">{task.status === "assigned" && <button className="btn btn-primary" onClick={() => status(task.id, "in_progress")}>Start work</button>}{task.status === "in_progress" && <button className="btn btn-primary" onClick={() => status(task.id, "submitted")}>Submit for review</button>}{task.status === "revision" && <button className="btn btn-secondary" onClick={() => status(task.id, "in_progress")}>Resume revision</button>}{task.status === "submitted" && <span className="btn btn-secondary">Waiting for review</span>}</div></article>)}{!tasks.length && <div className="card p-10 text-center"><h2 className="font-bold text-xl">No tasks assigned yet.</h2></div>}</div></div></main>;
}
