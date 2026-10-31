"use client";

import { useEffect, useRef, type ReactNode } from "react";
import "./landing-motion.css";

/** Motion only: all content keeps its original document geometry. */
export function LandingMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      if (preference.matches) return;
      const targets = element.querySelectorAll<HTMLElement>(
        "h2, #features article, [data-motion-reveal], #how-it-works ol > li, #reviews [aria-roledescription], #faq h3, main > section p:not(article p):not(li p):not([role=region] p)"
      );
      const animations = new Set<Animation>();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          const heading = target.matches("h1, h2");
          // Copy opens downward; images and bento cards open from the side.
          // Avoid nested reveals inside an already animated surface.
          const side = target.matches("article, [data-reveal-direction=side]");
          const animation = target.animate([
            { opacity: 0, clipPath: side ? "inset(0 100% 0 0)" : "inset(0 0 100% 0)", transform: side ? "translateX(10px)" : "translateY(10px)" },
            { opacity: 1, clipPath: "inset(0)", transform: "translateY(0)" },
          ], { duration: heading ? 1100 : 1250, delay: target.closest("#top") ? 650 : 0, easing: "cubic-bezier(.25,.1,.25,1)", fill: "backwards" });
          target.removeAttribute("data-reveal-pending");
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
          observer.unobserve(target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
      targets.forEach((target) => {
        if (target.parentElement?.closest("[data-motion-reveal], #features article, #how-it-works li, #reviews [aria-roledescription]")) return;
        target.setAttribute("data-reveal-pending", "");
        observer.observe(target);
      });
      const hero = element.querySelector<HTMLElement>("#top");
      const dashboard = element.querySelector<HTMLElement>("[data-dashboard-motion]");
      let frame = 0;
      let current = -1;
      let lastTime = 0;
      const update = (time: number) => {
        frame = 0;
        if (!hero || !dashboard) return;
        const raw = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / 420));
        const target = 1 - Math.pow(1 - raw, 2);
        const dt = lastTime ? Math.min(64, time - lastTime) : 16;
        lastTime = time;
        if (current < 0) current = target;
        current += (target - current) * (1 - Math.exp(-dt / 160));
        if (Math.abs(target - current) < .0001) current = target;
        const mobile = window.innerWidth <= 768;
        const scale = mobile ? .96 + .04 * current : 1.04 - .04 * current;
        dashboard.style.transform = `perspective(1200px) rotateX(${16 * (1 - current)}deg) scale(${scale})`;
        if (current !== target) frame = requestAnimationFrame(update);
      };
      const schedule = () => {
        if (!frame) { lastTime = 0; frame = requestAnimationFrame(update); }
      };
      schedule();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      cleanup = () => {
        observer.disconnect();
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        animations.forEach((animation) => animation.cancel());
        targets.forEach((target) => target.removeAttribute("data-reveal-pending"));
        dashboard?.style.removeProperty("transform");
      };
    };
    setup();
    preference.addEventListener("change", setup);
    return () => { cleanup(); preference.removeEventListener("change", setup); };
  }, []);

  return <div ref={root} className="landing-motion bg-white">{children}</div>;
}
