import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { LoginButton } from "@/components/login-button";

export default function Login() {
  return <main className="anyx-login-shell">
    <div className="anyx-login-grid" aria-hidden="true" />
    <section className="anyx-login-intro">
      <span>ANYX STUDIO / ACCESS</span>
      <h1>MAKE<br />THE WORK<br /><em>MATTER.</em></h1>
      <p>One secure place for customers, studio owners, admins and creative workers.</p>
      <div><b>GFX</b><b>VFX</b><b>MOTION</b></div>
    </section>
    <section className="anyx-login-panel">
      <Link href="/" className="anyx-login-brand"><span>ANYX</span><b>STUDIO</b></Link>
      <div className="anyx-login-card">
        <span className="anyx-login-kicker">PRIVATE WORKSPACE</span>
        <h2>Welcome back.</h2>
        <p>Sign in to view your orders, projects, downloads and role-based studio tools.</p>
        <LoginButton />
        <small><ShieldCheck size={14} /> Secure Google sign-in. Your workspace opens based on your role.</small>
      </div>
      <Link href="/" className="anyx-login-exit">← Back to ANYX Studio</Link>
    </section>
  </main>;
}
