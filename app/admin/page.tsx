"use client";

import { useEffect, useState } from "react";
import { Bell, ClipboardList, Package, Plus, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "@/components/login-button";
import { OwnerTeamManager } from "@/components/owner-team-manager";
import { projectStages, shopCategories } from "@/lib/data";

export default function Admin() {
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<"owner" | "admin" | "artist">("artist");
  const [clients, setClients] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [clientName, setClientName] = useState(""); const [clientPhone, setClientPhone] = useState(""); const [clientEmail, setClientEmail] = useState("");
  const [title, setTitle] = useState(""); const [brief, setBrief] = useState(""); const [clientId, setClientId] = useState(""); const [artistId, setArtistId] = useState(""); const [deadline, setDeadline] = useState("");
  const [productName, setProductName] = useState(""); const [price, setPrice] = useState(""); const [category, setCategory] = useState(shopCategories[0]);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { location.href = "/login"; return; }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "owner" && profile?.role !== "admin") { location.href = "/artist"; return; }
    setRole(profile.role); setReady(true);
    const [clientResult, artistResult, projectResult, requestResult] = await Promise.all([
      supabase.from("clients").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").eq("role", "artist"),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("project_requests").select("*").order("created_at", { ascending: false })
    ]);
    setClients(clientResult.data || []); setArtists(artistResult.data || []); setProjects(projectResult.data || []); setRequests(requestResult.data || []);
  };
  useEffect(() => { load(); }, []);

  const addClient = async (event: React.FormEvent) => { event.preventDefault(); await supabase.from("clients").insert({ name: clientName, phone: clientPhone, email: clientEmail }); setClientName(""); setClientPhone(""); setClientEmail(""); load(); };
  const assign = async (event: React.FormEvent) => { event.preventDefault(); const { data: { user } } = await supabase.auth.getUser(); const { data: project } = await supabase.from("projects").insert({ client_id: clientId, title, description: brief, created_by: user!.id, status: "assigned" }).select().single(); if (project) await supabase.from("tasks").insert({ project_id: project.id, artist_id: artistId, title, brief, status: "assigned", deadline: deadline || null }); setTitle(""); setBrief(""); setDeadline(""); load(); };
  const addProduct = async (event: React.FormEvent) => { event.preventDefault(); await supabase.from("products").insert({ name: productName, price: Number(price), category, description: "Digital creative asset pack.", status: "published" }); setProductName(""); setPrice(""); load(); };

  if (!ready) return <main className="min-h-screen grid place-items-center"><span className="muted">Loading ANYX Control Center...</span></main>;
  const workspace = role === "owner" ? "Owner workspace" : "Admin workspace";
  return <main className="control-shell"><div className="container py-7">
    <header className="control-head"><div><span className="section-label">{workspace}</span><h1>ANYX Control Center</h1><p>{role === "owner" ? "Lead the team, roles, projects and storefront." : "Manage assigned studio operations and project delivery."}</p></div><div className="flex items-center gap-2"><button className="icon-button" aria-label="Notifications"><Bell size={17} /></button><LogoutButton /></div></header>
    <nav className="control-nav"><span className="is-active">Overview</span><span>Projects</span><span>Customers</span><span>Orders</span><span>Products</span><span>{role === "owner" ? "Team roles" : "Team"}</span><span>Analytics</span><span>Activity</span></nav>
    <section className="control-stats">{[["Customers", clients.length, Users], ["Active projects", projects.length, ClipboardList], ["Published assets", "—", Package], ["New requests", requests.filter(request => request.status === "requested").length, Bell]].map(([label, value, Icon]: any) => <div className="control-stat" key={label}><Icon size={18} /><b>{value}</b><span>{label}</span></div>)}</section>
    {role === "owner" && <OwnerTeamManager />}
    <section className="request-queue"><div><span className="section-label">New customer requests</span><h2>Review queue</h2></div>{requests.slice(0, 4).map(request => <div className="request-row" key={request.id}><div><b>{request.customer_name}</b><span>{request.service} · {request.game || "General"}</span><p>{request.requirements}</p></div><div><small>{request.deadline || "No deadline"}</small><strong>{request.status}</strong></div></div>)}{!requests.length && <p className="muted mt-4 text-sm">New requests will appear here after the Supabase migration is applied.</p>}</section>
    <section className="control-grid"><Panel title="New customer"><form onSubmit={addClient} className="space-y-3"><input className="input" required placeholder="Customer / team name" value={clientName} onChange={event => setClientName(event.target.value)} /><input className="input" placeholder="Phone" value={clientPhone} onChange={event => setClientPhone(event.target.value)} /><input className="input" placeholder="Email" value={clientEmail} onChange={event => setClientEmail(event.target.value)} /><button className="btn btn-secondary w-full"><Plus size={16} /> Save customer</button></form></Panel><Panel title="Assign project"><form onSubmit={assign} className="space-y-3"><div className="assignment-flow"><span>Project</span><span>Assign employee</span><span>Deadline</span></div><select className="input" required value={clientId} onChange={event => setClientId(event.target.value)}><option value="">Select customer</option>{clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}</select><select className="input" required value={artistId} onChange={event => setArtistId(event.target.value)}><option value="">Select designer / artist</option>{artists.map(artist => <option key={artist.id} value={artist.id}>{artist.full_name || artist.id}</option>)}</select><input className="input" required placeholder="Project title" value={title} onChange={event => setTitle(event.target.value)} /><textarea className="input min-h-24" required placeholder="Sanitized requirements" value={brief} onChange={event => setBrief(event.target.value)} /><input className="input" type="date" value={deadline} onChange={event => setDeadline(event.target.value)} /><button className="btn btn-primary w-full">Assign project</button></form></Panel><Panel title="Publish asset"><form onSubmit={addProduct} className="space-y-3"><input className="input" required placeholder="Asset name" value={productName} onChange={event => setProductName(event.target.value)} /><select className="input" value={category} onChange={event => setCategory(event.target.value)}>{shopCategories.map(item => <option key={item}>{item}</option>)}</select><input className="input" required type="number" min="0" placeholder="Price INR" value={price} onChange={event => setPrice(event.target.value)} /><button className="btn btn-secondary w-full">Publish to shop</button></form></Panel></section>
    <section className="activity-panel"><div className="flex justify-between gap-4 items-end"><div><span className="section-label">Project pipeline</span><h2>Live production queue</h2></div><span className="text-xs text-zinc-500">{projectStages.join(" → ")}</span></div><div className="project-list">{projects.slice(0, 8).map(project => <div className="project-row" key={project.id}><div><b>{project.title}</b><span>{project.status || "requested"}</span></div><small>Track project <span>→</span></small></div>)}{!projects.length && <div className="empty-state"><h3>No projects assigned yet.</h3><p>Create a customer, then assign their first ANYX project.</p></div>}</div></section>
  </div></main>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="control-panel"><h2>{title}</h2>{children}</section>; }
