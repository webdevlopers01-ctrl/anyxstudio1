import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "ANYX Studio — Gaming Creative Studio",
  description: "Gaming posters, GFX, VFX, stream assets and esports creative by ANYX Studio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><div className="global-bg" aria-hidden="true"><div className="global-bg-overlay"/><div className="global-bg-wind"/><div className="global-bg-wind-two"/></div><SiteHeader/>{children}<SiteFooter/></body></html>;
}
