import Link from "next/link";
import { ArrowUpRight, ArrowRight, LogIn, Sparkles } from "lucide-react";
import { games } from "@/lib/data";

export default function Home() {
  const gallery = [
    ["Valorant", "Roster Reveal", "GFX"], ["BGMI", "Finals Poster", "POSTER"], ["Free Fire", "Velocity Edit", "MOTION"], ["Esports", "Team Identity", "BRANDING"], ["Stream", "Neon Overlay", "STREAM"], ["VFX", "Impact Frames", "VFX"],
  ];
  const rows = [gallery, [...gallery].reverse(), [...gallery.slice(2), ...gallery.slice(0,2)]];
  return <main className="anyx-reference-home">
    <section className="anyx-ref-hero" data-scrollfx="hero">
      <div className="anyx-ref-haze haze-one"/><div className="anyx-ref-haze haze-two"/><div className="anyx-ref-haze haze-three"/>
      <div className="anyx-ref-availability" data-scrollfx-child><i/> Available for new drops <span>•</span> GFX · VFX · Motion</div>
      <div className="anyx-ref-hero-copy" data-scrollfx-child>
        <span className="anyx-ref-kicker"><Sparkles size={13}/> Built for the next match</span>
        <h1>Your game.<br/><em>Our creative.</em></h1>
        <p>ANYX Studio creates the visuals that make teams, creators and campaigns impossible to scroll past.</p>
        <div className="anyx-ref-hero-actions"><Link href="/contact" className="anyx-ref-primary">Start a project <ArrowUpRight size={17}/></Link><Link href="/login" className="anyx-ref-text-link"><LogIn size={16}/> Customer login</Link></div>
      </div>
      <div className="anyx-ref-reel" data-scrollfx-child>
        <video autoPlay muted loop playsInline preload="none"><source src="/anyx-hero-video.mp4" type="video/mp4"/></video>
        <div className="anyx-ref-reel-shade"/><div className="anyx-ref-reel-copy"><span>ANYX CREATIVE REEL</span><b>01</b><i>PLAY THE DIFFERENCE</i></div>
      </div>
      <nav className="anyx-ref-dock" aria-label="Quick navigation" data-scrollfx-child><Link href="/services">Services</Link><Link href="/portfolio">Work</Link><Link href="/shop">Shop</Link><Link href="/about">About</Link><Link href="/contact" className="dock-cta">Let&apos;s talk <ArrowUpRight size={15}/></Link></nav>
    </section>

    <section className="anyx-showcase" aria-label="Recent ANYX work"><div className="anyx-showcase-head"><span>RECENT WORK</span><h2>Built to stop<br/><em>the scroll.</em></h2><p>GFX, VFX, posters and motion work from the ANYX creative floor.</p></div><div className="anyx-showcase-rows">{rows.map((row,rowIndex)=><div key={rowIndex} className={`anyx-showcase-row row-${rowIndex}`}><div className="anyx-showcase-track">{[...row,...row].map(([game,title,type],index)=><Link href="/portfolio" className={`anyx-showcase-card card-${(index+rowIndex)%6}`} key={`${rowIndex}-${index}`}><span>{type}</span><strong>{title}</strong><small>{game} · ANYX Studio</small><i/></Link>)}</div></div>)}</div></section>

    <section className="anyx-showcase-actions" data-scrollfx><p data-scrollfx-child>Want instant packs or a custom creative direction?</p><div data-scrollfx-child><Link href="/shop" className="anyx-ref-primary">Visit store <ArrowUpRight size={17}/></Link><Link href="/contact" className="anyx-showcase-order">Customized work order <ArrowRight size={17}/></Link></div></section>

    <section className="anyx-ref-games"><span>BUILT FOR</span>{games.map(game=><b key={game}>{game}</b>)}</section>
  </main>;
}
