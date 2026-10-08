import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight, Play, ShoppingBag } from "lucide-react";
import { games, portfolio, services } from "@/lib/data";
import { CategoryReel } from "@/components/category-reel";
import { ScrollFX } from "@/components/scroll-fx";

export default function Home() {
  return <main className="anyx-home">
    <ScrollFX />
    <section className="anyx-quicklinks" data-scrollfx><span className="anyx-orbit-dot" aria-hidden="true" />{[["GFX Packs","/shop"],["Gaming Posters","/services"],["Stream Assets","/shop"],["Motion & VFX","/services"]].map(([name, href], index) => <Link href={href} key={name} style={{ "--fx-delay": `${index * 75}ms` } as CSSProperties}>{name} <ArrowUpRight size={14} /></Link>)}</section>
    <section className="anyx-marquee"><div>ANYX STUDIO <span>✦</span> PURPLE PLAYBOOK <span>✦</span> CREATIVE FOR THE NEXT MATCH <span>✦</span> ANYX STUDIO <span>✦</span> PURPLE PLAYBOOK</div></section>
    <section className="anyx-main-promo anyx-video-hero is-in-view" data-scrollfx="hero"><div className="anyx-purple-orb orb-one" /><div className="anyx-purple-orb orb-two" /><video className="anyx-hero-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src="/anyx-hero-video.mp4" type="video/mp4" /></video><div className="anyx-video-shade" /><div className="anyx-promo-text"><span>GAMING CREATIVE STUDIO / 01</span><h1>MAKE<br />THE FEED<br /><em>STOP.</em></h1><p>Posters, GFX, VFX, motion and stream assets built for the next match.</p><div><Link href="/contact" className="anyx-dark-button">Start a project <ArrowUpRight size={16} /></Link><Link href="/portfolio" className="anyx-outline-button"><Play size={15} /> View work</Link></div></div><div className="anyx-hero-video-label"><span>ANYX STUDIO</span><b>01</b><i>GFX · VFX · MOTION</i></div><div className="anyx-scroll-cue"><i /> SCROLL TO ENTER</div></section>
    <section className="anyx-category-block" data-scrollfx><div className="anyx-category-head" data-scrollfx-child><span>EXPLORE THE DROP</span><div><h2>Pick your creative weapon.</h2><p className="category-motion-label"><i /> LIVE CATEGORY REEL</p></div></div><div data-scrollfx-child><CategoryReel services={services} /></div></section>
    <section className="anyx-work-section" data-scrollfx><div className="anyx-section-row" data-scrollfx-child><h2>Latest visual drops</h2><Link href="/portfolio">View all <ArrowUpRight size={15} /></Link></div><div className="anyx-work-grid">{portfolio.map(([name, category], index) => <Link href="/portfolio" data-scrollfx-child style={{ "--fx-delay": `${index * 90}ms` } as CSSProperties} className={`anyx-work-item work-${index}`} key={name}><div className="anyx-work-word">ANYX</div><span>{category}</span><b>{name}</b><i>View project <ArrowUpRight size={15} /></i></Link>)}</div></section>
    <section className="anyx-shop-promo" data-scrollfx><div data-scrollfx-child><span>ANYX ASSET SHOP</span><h2>READY-TO-USE<br />GAMING ASSETS.</h2><p>Get packs, overlays, templates, effects and more.</p><Link href="/shop" className="anyx-light-button"><ShoppingBag size={16} /> Explore shop</Link></div><div className="anyx-shop-collage" data-scrollfx-child><div>GFX</div><div>VFX</div><div>POSTERS</div></div></section>
    <section className="anyx-games" data-scrollfx><span>BUILT FOR</span>{games.map((x, index) => <b data-scrollfx-child style={{ "--fx-delay": `${index * 60}ms` } as CSSProperties} key={x}>{x}</b>)}</section>
  </main>;
}
