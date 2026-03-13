"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Profile {
    full_name: string;
    tagline: string;
    bio: string;
    location: string;
    email: string;
    github_url: string;
    linkedin_url: string;
    leetcode_url: string;
    kaggle_url: string;
    youtube_url: string;
    open_to_work: boolean;
}

export default function LeadStory() {
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        supabase.from("profiles").select("*").maybeSingle().then(({ data }) => setProfile(data));
    }, []);

    if (!profile) return <LeadStorySkeleton />;

    const sentences = profile.bio?.split(". ") ?? [];
    const opening = sentences.slice(0, 2).join(". ") + ".";
    const continuation = sentences.slice(2).join(". ");

    return (
        <section id="lead" className="broadsheet">
            {/* Section flag row */}
            <div className="flex items-center gap-3 py-2 border-t-4 border-b border-ink">
                <span className="section-label-inv">Lead Story</span>
                <span className="section-label">AI Systems · Full Stack Engineering</span>
                {profile.open_to_work && (
                    <span className="accent-flag ml-auto">◆ Open to Work</span>
                )}
            </div>

            {/* 12-column broadsheet grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-ink">

                {/* Main column — 8 cols */}
                <div className="lg:col-span-8 py-7 lg:pr-10 lg:border-r border-ink">
                    {/* Byline */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-5">
                        <span className="dateline uppercase font-bold text-ink">By {profile.full_name}</span>
                        <span className="dateline">·</span>
                        <span className="dateline">parikhdev</span>
                        <span className="dateline">·</span>
                        <span className="dateline uppercase">{profile.location}</span>
                    </div>

                    {/* Headline */}
                    <h2
                        className="font-playfair font-black text-ink leading-[1.02] mb-4"
                        style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
                    >
                        Student Builds Adaptive AI That Teaches JEE Like a Tutor
                    </h2>

                    {/* Deck / sub-headline */}
                    <p
                        className="font-playfair italic text-ink-mid leading-snug mb-5 pb-5 border-b border-ink"
                        style={{ fontSize: "clamp(1rem, 1.6vw, 1.2rem)" }}
                    >
                        {profile.tagline}
                    </p>

                    {/* Body — 2 columns on large */}
                    <div className="columns-1 md:columns-2 columns-newspaper gap-8">
                        <p className="column-text drop-cap mb-4">{opening}</p>
                        {continuation && <p className="column-text mb-4">{continuation}</p>}
                        <p className="column-text mb-4">
                            Built on FastAPI, Next.js 14, pgvector, and Groq&apos;s LLaMA 3.1, the
                            platform features LaTeX rendering, RAG-based concept explanations,
                            and Supabase auth — deployed live at Vercel.
                        </p>
                        <p className="column-text">
                            Currently pursuing a B.Tech in Computer Science with an AI &amp; ML
                            specialization at JSS Academy, Parikh maintains an 8.05 CGPA while
                            shipping production systems and documenting the journey for a growing
                            developer audience.
                        </p>
                    </div>

                    {/* Social link tags */}
                    <div className="flex flex-wrap gap-2 mt-7 pt-5 border-t border-ink">
                        {[
                            { label: "github.com/parikhdev", href: profile.github_url },
                            { label: "linkedin.com/parikhyashofficial", href: profile.linkedin_url },
                            { label: profile.email, href: `mailto:${profile.email}` },
                            { label: "leetcode", href: profile.leetcode_url },
                            { label: "kaggle", href: profile.kaggle_url },
                            { label: "youtube", href: profile.youtube_url },
                        ].map((l) => (
                            <a
                                key={l.label}
                                href={l.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tech-tag"
                            >
                                {l.label} ↗
                            </a>
                        ))}
                        {profile.open_to_work && (
                            <span className="ml-auto flex items-center gap-1.5 font-mono-ed text-[0.62rem] uppercase tracking-widest text-ink">
                                <span className="w-2 h-2 rounded-full bg-green-600 inline-block" />
                                Open to Work
                            </span>
                        )}
                    </div>
                </div>

                {/* Sidebar — 4 cols */}
                <aside className="lg:col-span-4 py-7 lg:pl-7 flex flex-col gap-7 border-t lg:border-t-0 border-ink">

                    {/* Pull quote */}
                    <div className="border-t-4 border-b border-ink pt-4 pb-4">
                        <p
                            className="font-playfair font-black italic text-ink leading-tight"
                            style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)" }}
                        >
                            &ldquo;The best time to build was yesterday. The second best time is now, in public, with version control.&rdquo;
                        </p>
                        <p className="dateline mt-3 uppercase tracking-widest">— Yash Parikh</p>
                    </div>

                    {/* Correspondent profile */}
                    <div>
                        <p className="section-label border-b border-ink pb-1.5 mb-3">Correspondent Profile</p>
                        {[
                            ["Institution", "JSS Academy of Technical Education"],
                            ["Degree", "B.Tech CSE — AI & ML"],
                            ["CGPA", "8.05 / 10.0"],
                            ["Graduating", "2026"],
                            ["Focus", "Full Stack AI Systems"],
                            ["Status", profile.open_to_work ? "Available for hire" : "Not seeking"],
                        ].map(([k, v]) => (
                            <div key={k} className="flex justify-between items-start py-1.5 border-b border-paper-dark last:border-0">
                                <span className="font-mono-ed text-[0.6rem] uppercase tracking-wider text-ink-faint">{k}</span>
                                <span className="font-mono-ed text-[0.6rem] text-ink text-right ml-3 leading-tight">{v}</span>
                            </div>
                        ))}
                    </div>

                    {/* Skills */}
                    <div>
                        <p className="section-label border-b border-ink pb-1.5 mb-3">Skills · Inventory</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {[
                                { label: "Frontend", items: "Next.js · React\nTypeScript · Tailwind" },
                                { label: "Backend", items: "Python · FastAPI\nPostgreSQL · Supabase" },
                                { label: "AI / ML", items: "RAG · LLMs\npgvector · Groq" },
                                { label: "Python Libraries", items: "NumPy · Pandas\nMatplotlib · Seaborn" },
                                { label: "Deploy", items: "Vercel · Railway\nDocker · Git" },
                            ].map(({ label, items }) => (
                                <div key={label}>
                                    <p className="font-mono-ed text-[0.58rem] uppercase tracking-widest text-ink-faint mb-1">{label}</p>
                                    {items.split("\n").map((line) => (
                                        <p key={line} className="font-mono-ed text-[0.65rem] text-ink leading-relaxed">{line}</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Latest vlog */}
                    <div>
                        <p className="section-label border-b border-ink pb-1.5 mb-3">Vlog · YouTube</p>
                        <a
                            href="https://youtube.com/shorts/iDMU24_A3zg"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                        >
                            <p
                                className="font-playfair font-black text-ink leading-tight group-hover:underline underline-offset-2"
                                style={{ fontSize: "clamp(1rem, 1.4vw, 1.15rem)" }}
                            >
                                &ldquo;11+ Hours of Study &amp; a Push Day&rdquo; Goes Live
                            </p>
                            <p className="column-text text-sm mt-1.5">
                                Documenting the daily discipline that separates builders from dreamers. @YashParikhOfficial
                            </p>
                        </a>
                    </div>
                </aside>
            </div>
        </section>
    );
}

function LeadStorySkeleton() {
    return (
        <section className="broadsheet">
            <div className="flex items-center gap-3 py-2 border-t-4 border-b border-ink">
                <span className="section-label-inv">Lead Story</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-ink">
                <div className="lg:col-span-8 py-7 lg:pr-10 lg:border-r border-ink space-y-4">
                    <div className="h-3 w-1/3 bg-paper-dark animate-pulse" />
                    <div className="h-10 w-full bg-paper-dark animate-pulse" />
                    <div className="h-10 w-3/4 bg-paper-dark animate-pulse" />
                    <div className="h-4 w-full bg-paper-dark animate-pulse mt-4" />
                    <div className="h-4 w-5/6 bg-paper-dark animate-pulse" />
                    <div className="h-4 w-4/5 bg-paper-dark animate-pulse" />
                </div>
                <div className="lg:col-span-4 py-7 lg:pl-7 space-y-4">
                    <div className="h-24 bg-paper-dark animate-pulse" />
                    <div className="h-3 w-1/2 bg-paper-dark animate-pulse" />
                </div>
            </div>
        </section>
    );
}