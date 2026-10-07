import Link from "next/link";
import { ArrowUpRight, Play, ShoppingBag } from "lucide-react";
import { games, portfolio, services } from "@/lib/data";

const visualThemes = ["violet", "cyan", "pink", "blue", "amber", "lime"];

export default function Home() {
  return <main className="anyx-home">
    <section className="anyx-quicklinks">{[["GFX Packs","/shop"],["Gaming Posters","/services"],["Stream Assets","/shop"],["Motion & VFX","/services"]].map(([name,href])=><Link href={href} key={name}>{name} <ArrowUpRight size={14}/></Link>)}</section>
    <section className="anyx-marquee"><div>ANYX STUDIO <span>•</span> GAMING CREATIVE <span>•</span> ASSETS FOR THE NEXT PLAY <span>•</span> ANYX STUDIO <span>•</span> GAMING CREATIVE</div></section>
    <section className="anyx-main-promo"><div className="anyx-promo-text"><span>GAMING CREATIVE STUDIO</span><h1>MAKE<br/>THE FEED<br/><em>STOP.</em></h1><p>Posters, GFX, VFX, motion and stream assets built for the next match.</p><div><Link href="/contact" className="anyx-dark-button">Start a project <ArrowUpRight size={16}/></Link><Link href="/portfolio" className="anyx-outline-button"><Play size={15}/> View work</Link></div></div><div className="anyx-promo-art"><div className="art-chip chip-one">ANYX<br/>PLAY</div><div className="art-chip chip-two">GFX<br/>VFX</div><div className="art-sun"/><div className="art-player"><span>ANYX</span><b>01</b><i>CREATE<br/>LOUD</i></div><div className="art-streak"/></div></section>
    <section className="anyx-category-block"><div className="anyx-category-head"><span>EXPLORE THE DROP</span><h2>Pick your creative weapon.</h2></div><div className="anyx-category-rail">{services.map(([name, description], index) => <Link href="/services" className={`anyx-category-card cat-${index}`} key={name}><span>0{index+1}</span><b>{name}</b><small>{description}</small><ArrowUpRight size={20}/></Link>)}</div></section>
    <section className="anyx-work-section"><div className="anyx-section-row"><h2>Latest visual drops</h2><Link href="/portfolio">View all <ArrowUpRight size={15}/></Link></div><div className="anyx-work-grid">{portfolio.map(([name, category], index) => <Link href="/portfolio" className={`anyx-work-item work-${index}`} key={name}><div className="anyx-work-word">ANYX</div><span>{category}</span><b>{name}</b><i>View project <ArrowUpRight size={15}/></i></Link>)}</div></section>
    <section className="anyx-shop-promo"><div><span>ANYX ASSET SHOP</span><h2>READY-TO-USE<br/>GAMING ASSETS.</h2><p>Get packs, overlays, templates, effects and more.</p><Link href="/shop" className="anyx-light-button"><ShoppingBag size={16}/> Explore shop</Link></div><div className="anyx-shop-collage"><div>GFX</div><div>VFX</div><div>POSTERS</div></div></section>
    <section className="anyx-games"><span>BUILT FOR</span>{games.map(x=><b key={x}>{x}</b>)}</section>
  </main>;
}
