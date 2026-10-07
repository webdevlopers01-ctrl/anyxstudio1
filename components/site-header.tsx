"use client";
import Link from "next/link";
import { Menu, X, LogIn } from "lucide-react";
import { useState } from "react";

const links = [
  ["/about","About"],["/services","Services"],["/portfolio","Portfolio"],["/shop","Shop"],["/contact","Contact"]
];

export function SiteHeader(){
  const [open,setOpen]=useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/[.07] bg-[#050507]/80 backdrop-blur-2xl">
      <div className="container h-[4.5rem] flex items-center justify-between">
        <Link href="/" className="font-black tracking-[-.06em] text-lg">
          CLIENT<span className="text-violet-400">.</span>STUDIO
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-zinc-400">
          {links.map(([href,label])=><Link key={href} className="transition hover:text-white" href={href}>{label}</Link>)}
        </nav>

        <div className="flex items-center gap-2">
          <Link className="hidden sm:inline-flex btn btn-secondary text-xs" href="/login">
            <LogIn size={15}/> Studio Login
          </Link>
          <button aria-label={open ? "Close menu" : "Open menu"} className="md:hidden rounded-xl border border-white/10 bg-white/[.04] p-2.5 text-zinc-300" onClick={()=>setOpen(v=>!v)}>
            {open ? <X size={19}/> : <Menu size={19}/>}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/[.06] bg-[#07070a]/95 backdrop-blur-2xl">
          <nav className="container py-4 grid gap-1">
            {links.map(([href,label])=>(
              <Link onClick={()=>setOpen(false)} key={href} href={href} className="rounded-xl px-3 py-3.5 text-sm font-semibold text-zinc-300 hover:bg-white/[.05] hover:text-white">{label}</Link>
            ))}
            <Link onClick={()=>setOpen(false)} href="/login" className="mt-2 btn btn-primary">Studio Login <LogIn size={15}/></Link>
          </nav>
        </div>
      )}
    </header>
  );
}