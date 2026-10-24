"use client";

import { useEffect, useState } from "react";

export function DeferredHeroVideo() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadVideo = () => setReady(true);
    const timer = window.setTimeout(loadVideo, 1800);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) return null;

  return <video autoPlay muted loop playsInline preload="none"><source src="/anyx-hero-video.mp4" type="video/mp4" /></video>;
}
