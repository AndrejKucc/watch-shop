"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const revealSelectors = [
  "main > section",
  "main section",
  "main article",
  "main [data-reveal]",
  "main [class*='grid'] > a",
  "main [class*='grid'] > article",
];

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

    document.documentElement.classList.remove("has-scroll-reveal");

    if (isAdmin) {
      document.querySelectorAll(".scroll-reveal").forEach((element) => {
        element.classList.remove("scroll-reveal", "is-visible");
      });
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    document.documentElement.classList.add("has-scroll-reveal");

    let observer: IntersectionObserver | null = null;

    const observeElements = () => {
      if (!observer) return;

      const elements = document.querySelectorAll(revealSelectors.join(","));

      elements.forEach((element) => {
        if (
          element.closest("header") ||
          element.closest("footer") ||
          element.closest("[data-no-reveal]") ||
          element.classList.contains("scroll-reveal")
        ) {
          return;
        }

        element.classList.add("scroll-reveal");
        observer?.observe(element);
      });
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -45px 0px",
      },
    );

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer?.disconnect();
      mutationObserver.disconnect();
      document.documentElement.classList.remove("has-scroll-reveal");
    };
  }, [pathname]);

  return <>{children}</>;
}