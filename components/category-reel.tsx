"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function CategoryReel({ services }: { services: string[][] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const cards = [...services, ...services];

  const moveTo = (next: number, smooth = true) => {
    const rail = railRef.current;
    const viewport = viewportRef.current;
    if (!rail || !viewport) return;
    const normalized = ((next % services.length) + services.length) % services.length;
    const target = rail.children[normalized] as HTMLElement | undefined;
    viewport.scrollTo({ left: target?.offsetLeft ?? 0, behavior: smooth ? "smooth" : "auto" });
    setActive(normalized);
  };

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => moveTo(active + 1), 3000);
    return () => window.clearInterval(timer);
  }, [active, paused]);

  return <div className="anyx-category-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <div className="anyx-category-viewport" ref={viewportRef}><div className="anyx-category-rail" ref={railRef}>{cards.map(([name, description], index) => {
      const position = index % services.length;
      return <Link href="/services" className={`anyx-category-card cat-${position} ${active === position ? "is-active" : ""}`} key={`${name}-${index}`} aria-hidden={index >= services.length}><span>0{position + 1}</span><b>{name}</b><small>{description}</small><ArrowUpRight size={20}/><div className="category-card-shine"/></Link>;
    })}</div></div>
    <div className="category-reel-controls"><button type="button" aria-label="Previous category" onClick={() => moveTo(active - 1)}><ArrowLeft size={17}/></button><span><b>0{active + 1}</b> / 0{services.length}</span><button type="button" aria-label="Next category" onClick={() => moveTo(active + 1)}><ArrowRight size={17}/></button></div>
  </div>;
}
