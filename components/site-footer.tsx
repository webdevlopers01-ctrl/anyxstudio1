import Link from "next/link";

export function SiteFooter(){
  return (
    <footer className="border-t border-white/[.07] mt-20">
      <div className="container py-14 grid md:grid-cols-[1.4fr_.6fr_.8fr] gap-10">
        <div>
          <div className="font-black tracking-[-.05em] text-lg">CLIENT<span className="text-violet-400">.</span>STUDIO</div>
          <p className="muted mt-4 max-w-sm text-sm leading-7">A creative studio for esports graphics, digital assets and visual identity — built for teams, creators and modern brands.</p>
        </div>
        <div>
          <div className="font-bold text-sm mb-4">Explore</div>
          <div className="grid gap-3 text-sm text-zinc-500">
            <Link className="hover:text-white transition" href="/portfolio">Portfolio</Link>
            <Link className="hover:text-white transition" href="/shop">Asset Shop</Link>
            <Link className="hover:text-white transition" href="/services">Services</Link>
          </div>
        </div>
        <div>
          <div className="font-bold text-sm mb-4">Studio</div>
          <p className="text-sm leading-6 text-zinc-500">Custom work and digital packs are handled directly by the studio.</p>
        </div>
      </div>
      <div className="container border-t border-white/[.06] py-5 text-xs text-zinc-600 flex flex-col sm:flex-row gap-2 justify-between">
        <span>© {new Date().getFullYear()} Client Studio.</span>
        <span>Designed for screens of every size.</span>
      </div>
    </footer>
  );
}