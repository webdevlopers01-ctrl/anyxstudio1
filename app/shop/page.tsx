import { ShopCatalog } from "@/components/shop-catalog";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Shop(){
  const { data } = await (await createClient()).from("products").select("id,name,description,category,price,product_type").eq("status","published").order("created_at",{ascending:false});
  return <main className="anyx-shop-page"><section className="anyx-shop-hero"><div className="container"><div className="shop-kicker-row"><span>ANYX ASSET SHOP / 01</span><span>INSTANT DIGITAL DELIVERY</span></div><div className="anyx-shop-title"><h1>MAKE IT<br/><em>HIT HARDER.</em></h1><p>Premium assets for gaming creatives who want the feed, the lobby and the stream to look different.</p></div><div className="shop-hero-art"><div className="shop-orb"/><span>DROP<br/>SYSTEM</span><b>ANYX</b><i>GFX • VFX • POSTERS • STREAM</i></div></div></section><section className="anyx-shop-collections"><div className="container"><div className="shop-collection-heading"><h2>Shop by drop type.</h2><Link href="/contact">Need custom work? <ArrowUpRight size={15}/></Link></div><div className="shop-collection-tiles"><div><b>GFX</b><span>Matchday & social</span></div><div><b>VFX</b><span>Effects & transitions</span></div><div><b>OVERLAYS</b><span>Stream visual systems</span></div><div><b>PACKS</b><span>Ready-to-use bundles</span></div></div></div></section><section className="anyx-shop-catalog"><div className="container"><ShopCatalog products={data || []}/></div></section></main>;
}
