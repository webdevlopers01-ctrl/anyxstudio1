import { ShopCatalog } from "@/components/shop-catalog";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Shop(){
  const { data } = await (await createClient()).from("products").select("id,name,description,category,price").eq("status","published").order("created_at",{ascending:false});
  return <main className="mesh"><section className="section"><div className="container"><span className="section-label">ANYX Asset shop</span><div className="shop-heading"><div><h1 className="section-title">Build your next drop.</h1><p className="section-intro mt-4">Premium gaming assets for fast, polished creative output.</p></div><div className="shop-trust">INSTANT DIGITAL DELIVERY<br/><span>Curated by ANYX Studio</span></div></div><ShopCatalog products={data || []}/></div></section></main>;
}
