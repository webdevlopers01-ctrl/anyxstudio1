import Link from "next/link";

export function SiteFooter(){
  return (
    <footer className="border-t border-white/[.07] mt-20">
      <div className="container py-14 grid md:grid-cols-[1.4fr_.6fr_.8fr] gap-10">
        <div>
          <div className="font-black tracking-[-.05em] text-lg"><span className="text-violet-400">ANYX</span> STUDIO</div>
          <p className="muted mt-4 max-w-sm text-sm leading-7">A gaming creative studio for teams, creators and competitive communities. Posters, GFX, VFX, motion and digital assets—built to play loud.</p>
        </div>
        <div>
          <div className="font-bold text-sm mb-4">Explore</div>
          <div className="grid gap-3 text-sm text-zinc-500">
            <Link className="hover:text-white transition" href="/portfolio">Work</Link>
            <Link className="hover:text-white transition" href="/shop">Asset Shop</Link>
            <Link className="hover:text-white transition" href="/services">Services</Link>
          </div>
        </div>
        <div>
          <div className="font-bold text-sm mb-4">Connect</div>
          <p className="text-sm leading-6 text-zinc-500">Instagram · Discord · YouTube<br/>Custom work and digital packs are handled directly by the studio.</p>
        </div>
      </div>
      <div className="container border-t border-white/[.06] py-5 text-xs text-zinc-600 flex flex-col sm:flex-row gap-2 justify-between">
        <span>© {new Date().getFullYear()} ANYX Studio.</span>
        <span>Designed for the next match.</span>
      </div>
    </footer>
  );
}
