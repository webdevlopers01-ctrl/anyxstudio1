import Link from "next/link";
import { ArrowUpRight, Sparkles, MoveUpRight } from "lucide-react";
import { services, portfolio } from "@/lib/data";

const visualThemes = ["violet", "cyan", "pink", "blue", "amber", "lime"];

export default function Home() {
  return (
    <main className="site-shell overflow-hidden">
      <section className="hero relative flex items-center">
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="hero-noise" />

        <div className="container relative z-10 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-12 lg:gap-8 items-center">
            <div>
              <div className="eyebrow">
                <Sparkles size={14} />
                Creative studio for esports & digital visuals
              </div>

              <h1 className="hero-title mt-6">
                Visuals that
                <span className="block text-gradient">move people.</span>
              </h1>

              <p className="hero-copy mt-6 max-w-xl">
                Premium GFX, esports identities, backgrounds, effects and digital packs — crafted with a studio-level finish and built to ship.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link className="btn btn-primary btn-lg group" href="/portfolio">
                  Explore work
                  <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link className="btn btn-secondary btn-lg" href="/shop">
                  Browse packs
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs uppercase tracking-[.18em] text-zinc-500">
                <span>GFX</span><span>Esports</span><span>Branding</span><span>Digital assets</span>
              </div>
            </div>

            <div className="hero-art-wrap">
              <div className="hero-art">
                <div className="art-ring art-ring-one" />
                <div className="art-ring art-ring-two" />
                <div className="art-panel art-panel-main">
                  <div className="art-kicker">01 / VISUAL SYSTEM</div>
                  <div className="art-word">MAKE<br />IT MOVE</div>
                  <div className="art-line" />
                  <div className="art-meta">CLIENT.STUDIO</div>
                </div>
                <div className="art-panel art-panel-small">
                  <span>01</span><b>GFX</b>
                </div>
                <div className="art-panel art-panel-side">
                  <span>STUDIO</span>
                  <MoveUpRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tight home-capabilities">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-label">Capabilities</span>
              <h2 className="section-title">One studio. Many visual directions.</h2>
            </div>
            <p className="section-intro">From matchday graphics to ready-to-use packs, every deliverable is designed to feel intentional and production-ready.</p>
          </div>

          <div className="service-grid mt-10">
            {services.map(([name, description], index) => (
              <div className="service-card" key={name}>
                <div className="service-number">0{index + 1}</div>
                <h3>{name}</h3>
                <p>{description}</p>
                <ArrowUpRight size={18} className="service-arrow" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-8 home-work">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-label">Selected work</span>
              <h2 className="section-title">Built to be seen.</h2>
            </div>
            <Link href="/portfolio" className="text-sm font-semibold text-zinc-300 hover:text-white inline-flex items-center gap-2">
              View all <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="portfolio-grid mt-10">
            {portfolio.map(([name, category], index) => (
              <Link href="/portfolio" className={`portfolio-card portfolio-${visualThemes[index % visualThemes.length]}`} key={name}>
                <div className="portfolio-art">
                  <div className="portfolio-glow" />
                  <div className="portfolio-shape portfolio-shape-a" />
                  <div className="portfolio-shape portfolio-shape-b" />
                  <div className="portfolio-copy">
                    <span>{category}</span>
                    <strong>{name}</strong>
                  </div>
                  <ArrowUpRight className="portfolio-icon" size={19} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-8">
        <div className="container">
          <div className="cta-panel">
            <div>
              <span className="section-label">Have a project?</span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">Let&apos;s make the visual system unforgettable.</h2>
            </div>
            <Link className="btn btn-primary btn-lg shrink-0" href="/contact">
              Start a project <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}