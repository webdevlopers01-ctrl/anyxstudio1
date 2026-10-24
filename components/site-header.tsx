"use client";
import Link from "next/link";
import { BriefcaseBusiness, Home, Images, MessageCircle, ShoppingBag, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { whatsapp } from "@/lib/utils";

const navigation = [
  ["/", "Home", Home],
  ["/services", "Services", Sparkles],
  ["/portfolio", "Work", Images],
  ["/shop", "Shop", ShoppingBag],
  ["/about", "About", BriefcaseBusiness],
] as const;

export function SiteHeader(){
  const pathname = usePathname();
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const supportHref = number ? whatsapp("Hello ANYX Studio, I need support.") : "/contact";
  return <nav className="anyx-bottom-dock" aria-label="ANYX primary navigation">
    <div className="anyx-dock-links">{navigation.map(([href,label,Icon]) => <Link key={href} href={href} aria-label={label} title={label} className={pathname === href ? "is-active" : ""}><Icon size={19}/><span>{label}</span></Link>)}</div>
    <Link className="anyx-dock-support" href={supportHref} target={number ? "_blank" : undefined} rel={number ? "noreferrer" : undefined}><MessageCircle size={18}/><span>WhatsApp support</span></Link>
  </nav>;
}
