import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";
import { games, portfolio, services } from "@/lib/data";
import { CategoryReel } from "@/components/category-reel";
import { ScrollFX } from "@/components/scroll-fx";

export default function Home() {
  return <main className="anyx-reference-home">
    <ScrollFX />
    <section className="anyx-ref-hero" data-scrollfx="hero">
      <div className="anyx-ref-haze haze-one"/><div className="anyx-ref-haze haze-two"/><div className="anyx-ref-haze haze-three"/>
      <div className="anyx-ref-availability" data-scrollfx-child><i/> Available for new drops <span>•</span> GFX · VFX · Motion</div>
      <div className="anyx-ref-hero-copy" data-scrollfx-child>
        <span className="anyx-ref-kicker"><Sparkles size={13}/> Built for the next match</span>
        <h1>Your game.<br/><em>Our creative.</em></h1>
        <p>ANYX Studio creates the visuals that make teams, creators and campaigns impossible to scroll past.</p>
        <div className="anyx-ref-hero-actions"><Link href="/contact" className="anyx-ref-primary">Start a project <ArrowUpRight size={17}/></Link><Link href="/portfolio" className="anyx-ref-text-link">Explore our work <ArrowRight size={16}/></Link></div>
      </div>
      <div className="anyx-ref-reel" data-scrollfx-child>
        <video autoPlay muted loop playsInline preload="metadata"><source src="/anyx-hero-video.mp4" type="video/mp4"/></video>
        <div className="anyx-ref-reel-shade"/><div className="anyx-ref-reel-copy"><span>ANYX CREATIVE REEL</span><b>01</b><i>PLAY THE DIFFERENCE</i></div>
      </div>
      <nav className="anyx-ref-dock" aria-label="Quick navigation" data-scrollfx-child><Link href="/services">Services</Link><Link href="/portfolio">Work</Link><Link href="/shop">Shop</Link><Link href="/about">About</Link><Link href="/contact" className="dock-cta">Let&apos;s talk <ArrowUpRight size={15}/></Link></nav>
    </section>

    <section className="anyx-ref-intro" data-scrollfx><span data-scrollfx-child>THE ANYX STANDARD</span><h2 data-scrollfx-child>Design that makes<br/><em>the lobby look twice.</em></h2><p data-scrollfx-child>From launch graphics to stream systems, every visual is shaped to feel unmistakably yours.</p></section>

    <section className="anyx-ref-services" data-scrollfx><div className="anyx-ref-section-head" data-scrollfx-child><div><span>WHAT WE DO</span><h2>Creative, without<br/>the generic.</h2></div><Link href="/services">All services <ArrowUpRight size={16}/></Link></div><div data-scrollfx-child><CategoryReel services={services}/></div></section>

    <section className="anyx-ref-work" data-scrollfx><div className="anyx-ref-section-head" data-scrollfx-child><div><span>SELECTED WORK</span><h2>Visuals built<br/>to be remembered.</h2></div><Link href="/portfolio">See all work <ArrowUpRight size={16}/></Link></div><div className="anyx-ref-work-grid">{portfolio.slice(0,6).map(([name, category], index)=><Link key={name} href="/portfolio" data-scrollfx-child style={{"--fx-delay":`${index*80}ms`} as CSSProperties} className={`anyx-ref-work-card ref-work-${index}`}><span>{category}</span><b>{name}</b><i>View case study <ArrowUpRight size={15}/></i></Link>)}</div></section>

    <section className="anyx-ref-process" data-scrollfx><div data-scrollfx-child><span>THE PROCESS</span><h2>Simple from<br/>brief to <em>brilliant.</em></h2></div><div className="anyx-ref-process-list" data-scrollfx-child>{[["01","Tell us what you need","Send your brief, goal and visual references."],["02","We shape the direction","Clear creative direction before production begins."],["03","Review, refine, deliver","Your final files, polished and ready to play."]].map(([number,title,copy])=><article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

    <section className="anyx-ref-cta" data-scrollfx><div data-scrollfx-child><span>READY WHEN YOU ARE</span><h2>Let&apos;s make your<br/><em>next drop matter.</em></h2><Link href="/contact" className="anyx-ref-primary">Start a project <ArrowUpRight size={17}/></Link></div></section>
    <section className="anyx-ref-games" data-scrollfx><span>BUILT FOR</span>{games.map((game,index)=><b key={game} data-scrollfx-child style={{"--fx-delay":`${index*55}ms`} as CSSProperties}>{game}</b>)}</section>
  </main>;
}
