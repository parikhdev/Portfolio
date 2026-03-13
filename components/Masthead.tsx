"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
    { label: "Lead Story", href: "#lead" },
    { label: "Projects", href: "#projects" },
    { label: "Vlogs", href: "#vlogs" },
    { label: "Contact", href: "#contact" },
    { label: "LeetCode", href: "https://leetcode.com/u/YashParikh/", external: true },
];

export default function Masthead() {
    const [currentDate, setCurrentDate] = useState("");
    const [edition, setEdition] = useState("");

    useEffect(() => {
        const now = new Date();
        setCurrentDate(
            now.toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
            })
        );
        const daysSince = Math.floor(
            (now.getTime() - new Date("2022-08-01").getTime()) / 86400000
        );
        setEdition(`Vol. IV · No. ${daysSince}`);
    }, []);

    return (
        <header className="bg-paper">
            {/* Top rule — thick */}
            <div className="border-t-4 border-ink" />

            {/* Meta bar */}
            <div className="broadsheet flex items-center justify-between py-1.5 border-b border-ink">
                <span className="dateline">{currentDate}</span>
                <span className="dateline hidden md:block tracking-widest uppercase">
                    Est. 2022 — Moradabad, India
                </span>
                <span className="dateline">{edition} · BTech CSE (AI/ML) · 8.05 CGPA</span>
            </div>

            {/* Nameplate */}
            <div className="broadsheet text-center py-4 border-b-4 border-ink">
                {/* Publication name above */}
                <p className="font-mono-ed text-ink-faint tracking-[0.3em] uppercase text-xs mb-3">
                    The Developer&apos;s Gazette
                </p>

                {/* THE massive name */}
                <h1
                    className="font-playfair font-black text-ink leading-none tracking-tight block"
                    style={{
                        fontSize: "clamp(4rem, 14vw, 10rem)",
                        letterSpacing: "-0.03em",
                    }}
                >
                    Yash Parikh
                </h1>

                {/* Subtitle */}
                <p
                    className="font-playfair italic text-ink-mid mt-2 leading-snug"
                    style={{ fontSize: "clamp(0.95rem, 2vw, 1.4rem)" }}
                >
                    Dispatch from the frontier of AI &amp; Full‑Stack Engineering
                </p>

                {/* Divider with edition info */}
                <div className="flex items-center gap-0 mt-3 max-w-3xl mx-auto">
                    <div className="flex-1 border-t border-ink" />
                    <span className="dateline px-4 whitespace-nowrap">
                        {edition} &nbsp;·&nbsp; March 2026
                    </span>
                    <div className="flex-1 border-t border-ink" />
                </div>
            </div>

            {/* Navigation strip */}
            <div className="broadsheet flex items-center justify-between py-2 border-b border-ink">
                <nav className="flex items-center gap-6 flex-wrap">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            target={link.external ? "_blank" : undefined}
                            rel={link.external ? "noopener noreferrer" : undefined}
                            className="font-mono-ed text-[0.62rem] uppercase tracking-[0.18em] text-ink-mid hover:text-ink transition-colors duration-150"
                        >
                            {link.label}{link.external ? " ↗" : ""}
                        </a>
                    ))}
                </nav>

                <button
                    onClick={() => window.dispatchEvent(new CustomEvent("open-chatbot"))}
                    className="font-mono-ed text-[0.62rem] uppercase tracking-[0.15em] bg-ink text-paper px-3 py-1.5 hover:bg-ink-light transition-colors duration-150 whitespace-nowrap hidden sm:block"
                >
                    Interview the Journalist →
                </button>
            </div>
        </header>
    );
}