"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";

export function MobileNav({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="w-11 h-11 border-[1.5px] border-graphite rounded-[4px] bg-transparent flex items-center justify-center"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 3l12 12M15 3L3 15" stroke="#16181A" strokeWidth="1.8" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 5h14M2 9h14M2 13h14" stroke="#16181A" strokeWidth="1.8" />
          </svg>
        )}
      </button>
      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 top-[60px] bottom-0 z-50 bg-paper border-t-[1.5px] border-graphite overflow-y-auto"
        >
          <nav className="flex flex-col p-5 gap-1" aria-label="Primary">
            {nav.primary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active === item.href ? "page" : undefined}
                className={`no-underline text-graphite font-semibold text-[18px] py-3.5 border-b border-rule flex justify-between ${
                  active === item.href ? "text-enamel" : ""
                }`}
              >
                {item.label}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
            <Link href="/reviews" onClick={() => setOpen(false)} className="no-underline text-graphite text-[16px] py-3.5">
              All reviews
            </Link>
            <Link href="/about" onClick={() => setOpen(false)} className="no-underline text-graphite text-[16px] py-3.5">
              About · how we check
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
