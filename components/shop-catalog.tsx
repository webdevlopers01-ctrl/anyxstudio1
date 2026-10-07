"use client";

import Link from "next/link";
import { Heart, Search, ShoppingBag, SlidersHorizontal, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { games, shopCategories } from "@/lib/data";

type Product = { id: string; name: string; description: string | null; category: string; price: number | string };

export function ShopCatalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("All"); const [game, setGame] = useState("All games"); const [sort, setSort] = useState("newest");
  const [saved, setSaved] = useState<string[]>([]); const [cart, setCart] = useState<string[]>([]);
  const filtered = useMemo(() => products.filter(p => (category === "All" || p.category.toLowerCase().includes(category.toLowerCase())) && `${p.name} ${p.description || ""}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => sort === "low" ? Number(a.price)-Number(b.price) : sort === "high" ? Number(b.price)-Number(a.price) : 0), [products, category, query, sort]);
  const toggle = (id:string, list:string[], update:(items:string[])=>void) => update(list.includes(id) ? list.filter(x=>x!==id) : [...list,id]);
  return <div>
    <div className="shop-tools"><div className="shop-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search packs, overlays, effects..."/></div><div className="cart-chip"><ShoppingBag size={16}/><span>{cart.length} cart</span></div></div>
    <div className="shop-filter-row"><div className="filter-label"><SlidersHorizontal size={15}/> Filter</div><div className="filter-scroll"><button className={category === "All" ? "filter-active" : ""} onClick={()=>setCategory("All")}>All</button>{shopCategories.map(x=><button className={category === x ? "filter-active" : ""} onClick={()=>setCategory(x)} key={x}>{x}</button>)}</div><select aria-label="Filter by game" value={game} onChange={e=>setGame(e.target.value)}><option>All games</option>{games.map(x=><option key={x}>{x}</option>)}</select><select aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Newest</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option></select></div>
    <div className="shop-result-line"><span>{filtered.length} assets found</span>{game !== "All games" && <span>Game: {game}</span>}</div>
    <div className="shop-grid">{filtered.map((p,index)=><article className="shop-card" key={p.id}><div className={`shop-cover shop-cover-${index%4}`}><span>{p.category}</span><button aria-label={`Save ${p.name}`} className={saved.includes(p.id) ? "shop-icon saved" : "shop-icon"} onClick={()=>toggle(p.id,saved,setSaved)}><Heart size={17} fill={saved.includes(p.id) ? "currentColor" : "none"}/></button><div className="shop-cover-label">ANYX<br/>ASSET DROP</div></div><div className="p-5"><div className="flex justify-between gap-3"><h2>{p.name}</h2><span className="shop-rating"><Star size={13} fill="currentColor"/> 4.9</span></div><p>{p.description || "Gaming creative asset pack."}</p><div className="flex items-center justify-between mt-5"><b>₹{Number(p.price).toLocaleString("en-IN")}</b><div className="flex gap-2"><button aria-label={`Add ${p.name} to cart`} className={cart.includes(p.id) ? "mini-cart added" : "mini-cart"} onClick={()=>toggle(p.id,cart,setCart)}><ShoppingBag size={15}/></button><Link href={`/shop/${p.id}`} className="btn btn-secondary text-xs">View</Link></div></div></div></article>)}</div>
    {!filtered.length && <div className="empty-state"><h2>No assets found.</h2><p>Try another category, search term or game.</p></div>}
  </div>;
}
