"use client";

import { useEffect } from "react";

export function ScrollFX() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("anyx-scroll-ready");
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-scrollfx]"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

    targets.forEach((target) => observer.observe(target));
    return () => { observer.disconnect(); root.classList.remove("anyx-scroll-ready"); };
  }, []);

  return null;
}
