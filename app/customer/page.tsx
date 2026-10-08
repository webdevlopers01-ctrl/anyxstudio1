"use client";

import Link from "next/link";
import { ArrowUpRight, Download, Heart, LogOut, MessageSquare, Package, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Order = { id: string; amount: number | string; status: string; created_at: string; order_items?: { product_name: string; quantity: number }[] };
type Wishlist = { id: string; product_id: string; products?: { name: string; category: string; price: number | string } | null };
type Request = { id: string; service: string; game: string | null; status: string; created_at: string };

export default function Customer() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("Customer");
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { location.href = "/login"; return; }
    const { data: profile } = await supabase.from("profiles").select("full_name,role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "customer") { location.href = profile?.role === "artist" ? "/artist" : "/admin"; return; }
    setName(profile.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Customer");
    const [ordersResult, wishlistResult, requestsResult] = await Promise.all([
      supabase.from("orders").select("id,amount,status,created_at,order_items(product_name,quantity)").eq("customer_id", user.id).order("created_at", { ascending: false }),
      supabase.from("wishlists").select("id,product_id,products(name,category,price)").eq("customer_id", user.id).order("created_at", { ascending: false }),
      supabase.from("project_requests").select("id,service,game,status,created_at").eq("customer_id", user.id).order("created_at", { ascending: false })
    ]);
    setOrders((ordersResult.data as unknown as Order[]) || []); setWishlist((wishlistResult.data as unknown as Wishlist[]) || []); setRequests((requestsResult.data as unknown as Request[]) || []); setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const removeWishlist = async (id: string) => { await supabase.from("wishlists").delete().eq("id", id); setWishlist(items => items.filter(item => item.id !== id)); };
  if (loading) return <main className="customer-shell grid place-items-center min-h-[60vh]">Loading your workspace…</main>;
  return <main className="customer-shell"><div className="container py-8"><header className="customer-head"><div><span className="section-label">Customer dashboard</span><h1>Welcome, {name}.</h1><p>Your live ANYX orders, requests, downloads and wishlist.</p></div><div className="flex gap-2"><button className="btn btn-secondary" onClick={async () => { await supabase.auth.signOut(); location.href = "/"; }}><LogOut size={15} /> Logout</button><Link href="/contact" className="btn btn-primary">Start a project <ArrowUpRight size={16} /></Link></div></header>
    <div className="customer-layout"><aside className="customer-nav"><span className="is-active"><UserRound size={16} /> Dashboard</span><span><Package size={16} /> My projects</span><span><Download size={16} /> Downloads</span><span><Heart size={16} /> Wishlist ({wishlist.length})</span><span><MessageSquare size={16} /> Messages</span></aside><section>
      <div className="customer-cards"><div><span>Active requests</span><b>{requests.filter(item => !["completed", "rejected"].includes(item.status)).length}</b><small>Live project requests</small></div><div><span>Orders</span><b>{orders.length}</b><small>Linked to your account</small></div><div><span>Wishlist</span><b>{wishlist.length}</b><small>Saved assets</small></div></div>
      <article className="customer-project"><div className="flex justify-between gap-5 items-start"><div><span className="section-label">Project requests</span><h2>{requests.length ? "Your latest requests" : "No project requests yet"}</h2><p>{requests.length ? `${requests[0].service} · ${requests[0].game || "General"}` : "Start a project and the team will review it here."}</p></div><span className="project-status">{requests[0]?.status || "ready"}</span></div>{requests.length ? <div className="customer-list mt-6">{requests.slice(0, 4).map(item => <span key={item.id}>{item.service} <b>{item.status}</b></span>)}</div> : <Link href="/contact" className="btn btn-secondary mt-6">Create request</Link>}</article>
      <div className="customer-sections"><article><h2><Package size={18} /> Recent orders</h2>{orders.length ? <div className="customer-list">{orders.slice(0, 4).map(order => <span key={order.id}>{order.order_items?.[0]?.product_name || "ANYX asset order"} <b>{order.status} · ₹{Number(order.amount).toLocaleString("en-IN")}</b></span>)}</div> : <p>No orders linked to this account yet.</p>}</article><article><h2><Heart size={18} /> Wishlist</h2>{wishlist.length ? <div className="customer-list">{wishlist.slice(0, 4).map(item => <span key={item.id}>{item.products?.name || "Saved asset"} <button onClick={() => removeWishlist(item.id)}><b>Remove</b></button></span>)}</div> : <p>Save assets from the shop to see them here.</p>}<Link href="/shop" className="btn btn-secondary text-xs mt-5">Browse shop</Link></article></div>
    </section></div></div></main>;
}
