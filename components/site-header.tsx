"use client";
import Link from "next/link";
import { Menu, X, LogIn, Search, ShoppingBag, Heart } from "lucide-react";
import { useState } from "react";

const links = [
  ["/services","Services"],["/portfolio","Work"],["/shop","Shop"],["/about","About"],["/contact","Contact"]
];

export function SiteHeader(){
  const [open,setOpen]=useState(false);
  return (
    <header className="anyx-header sticky top-0 z-50">
      <div className="container anyx-header-row">
        <button aria-label={open ? "Close menu" : "Open menu"} className="anyx-menu" onClick={()=>setOpen(v=>!v)}>{open ? <X size={20}/> : <Menu size={20}/>}</button>
        <Link aria-label="Search ANYX Studio" className="anyx-header-icon" href="/shop"><Search size={19}/></Link>
        <Link href="/" className="anyx-logo"><span>ANY</span><i>X</i><b>STUDIO</b></Link>
        <div className="anyx-header-actions"><Link aria-label="Wishlist" href="/customer"><Heart size={18}/></Link><Link aria-label="Cart" href="/shop"><ShoppingBag size={18}/></Link><Link aria-label="Login" className="hidden sm:block" href="/login"><LogIn size={18}/></Link></div>
      </div>

      {open && (
        <div className="anyx-menu-drawer">
          <nav className="container py-4 grid gap-1">
            {links.map(([href,label])=>(
              <Link onClick={()=>setOpen(false)} key={href} href={href} className="anyx-menu-link">{label}</Link>
            ))}
            <Link onClick={()=>setOpen(false)} href="/contact" className="anyx-menu-cta">Start a project</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
