"use client";

import { useEffect, useRef } from "react";

const EDGE = 14;
const MOVE_COOLDOWN_MS = 520;
const IDLE_MOVE_MS = 6200;

export function RoamingRocket() {
  const rocketRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const rocket = rocketRef.current;
    if (!rocket) return;

    let currentX = window.innerWidth - 58;
    let currentY = Math.max(EDGE, window.innerHeight * 0.2);
    let lastMove = 0;
    let frame = 0;
    let idleTimer: ReturnType<typeof window.setInterval> | undefined;

    const move = () => {
      const width = Math.max(42, window.innerWidth - 42 - EDGE * 2);
      const height = Math.max(42, window.innerHeight - 42 - EDGE * 2 - 84);
      let nextX = currentX;
      let nextY = currentY;

      for (let attempts = 0; attempts < 8; attempts += 1) {
        nextX = EDGE + Math.random() * width;
        nextY = EDGE + Math.random() * height;
        if (Math.abs(nextX - currentX) + Math.abs(nextY - currentY) > 120) break;
      }

      const rotation = Math.atan2(nextY - currentY, nextX - currentX) * (180 / Math.PI) + 45;
      rocket.style.left = `${nextX}px`;
      rocket.style.top = `${nextY}px`;
      rocket.style.transform = `rotate(${rotation}deg)`;
      currentX = nextX;
      currentY = nextY;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const now = performance.now();
        if (now - lastMove < MOVE_COOLDOWN_MS) return;
        lastMove = now;
        move();
      });
    };

    move();
    idleTimer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        lastMove = performance.now();
        move();
      }
    }, IDLE_MOVE_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      if (idleTimer) window.clearInterval(idleTimer);
    };
  }, []);

  return <span ref={rocketRef} className="anyx-roaming-rocket" aria-hidden="true">🚀</span>;
}
