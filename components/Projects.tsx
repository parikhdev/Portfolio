"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Project {
    id: string;
    title: string;
    slug: string;
    short_desc: string;
    long_desc: string;
    tech_stack: string[];
    github_url: string;
    live_url: string;
    category: string;
    status: string;
    featured: boolean;
    order_index: number;
}

const CATEGORY_LABELS: Record<string, string> = {
    AI: "Artificial Intelligence",
    Web: "Web Engineering",
    ML: "Machine Learning",
};

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase
            .from("projects")
            .select("*")
            .eq("published", true)
            .order("order_index", { ascending: true })
            .then(({ data }) => {
                setProjects(data ?? []);
                setLoading(false);
            });
    }, []);

    if (loading) return <ProjectsSkeleton />;

    const [featured, ...secondary] = projects;

    return (
        <section id="projects" className="broadsheet">
            {/* Section flag */}
            <div className="flex items-center gap-3 py-2 border-t-4 border-b border-ink">
                <span className="section-label-inv">Projects</span>
                <span className="section-label">Engineering · Shipped to Production</span>
                <span className="dateline ml-auto">{projects.length} dispatches filed</span>
            </div>

            {/* Featured project — full width lead */}
            {featured && (
                <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-ink">
                    {/* Story body */}
                    <div className="lg:col-span-8 py-7 lg:pr-10 lg:border-r border-ink">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
                            <span className="accent-flag">
                                {CATEGORY_LABELS[featured.category] ?? featured.category}
                            </span>
                            <span className="dateline">·</span>
                            <span className="dateline uppercase">{featured.status}</span>
                        </div>

                        <h2
                            className="font-playfair font-black text-ink leading-tight mb-3"
                            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                        >
                            {featured.title}
                        </h2>

                        <p
                            className="font-playfair italic text-ink-mid leading-snug mb-5 pb-5 border-b border-ink"
                            style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)" }}
                        >
                            {featured.short_desc}
                        </p>

                        <div className="columns-1 md:columns-2 columns-newspaper gap-8">
                            <p className="column-text drop-cap mb-4">
                                {featured.long_desc}
                            </p>
                            <p className="column-text">
                                The system is fully deployed and live — a demonstration that
                                production-grade AI applications can be built by a single
                                developer, from scratch, while still in college.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-ink">
                            {featured.tech_stack?.map((tech) => (
                                <span key={tech} className="tech-tag">{tech}</span>
                            ))}
                            <div className="flex gap-2 ml-auto">
                                {featured.github_url && (
                                    <a href={featured.github_url} target="_blank" rel="noopener noreferrer" className="tech-tag">
                                        GitHub ↗
                                    </a>
                                )}
                                {featured.live_url && (
                                    <a href={featured.live_url} target="_blank" rel="noopener noreferrer" className="tech-tag">
                                        Live ↗
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Featured sidebar — filing notes */}
                    <aside className="lg:col-span-4 py-7 lg:pl-7 flex flex-col gap-6 border-t lg:border-t-0 border-ink">
                        <div className="border-t-4 border-b border-ink pt-4 pb-4">
                            <p
                                className="font-playfair font-black italic text-ink leading-tight"
                                style={{ fontSize: "clamp(1rem, 1.6vw, 1.25rem)" }}
                            >
                                &ldquo;RAG pipeline, pgvector similarity search, and real-time difficulty
                                adaptation power India&apos;s most ambitious student-built prep platform.&rdquo;
                            </p>
                            <p className="dateline mt-2 uppercase">— Field Notes</p>
                        </div>

                        <div>
                            <p className="section-label border-b border-ink pb-1.5 mb-3">Technical Dispatch</p>
                            {[
                                ["Stack", featured.tech_stack?.slice(0, 3).join(", ")],
                                ["Category", featured.category],
                                ["Status", featured.status],
                                ["Deployed", "Vercel + Railway"],
                                ["Database", "PostgreSQL + pgvector"],
                            ].map(([k, v]) => (
                                <div key={k} className="flex justify-between items-start py-1.5 border-b border-paper-dark last:border-0">
                                    <span className="font-mono-ed text-[0.6rem] uppercase tracking-wider text-ink-faint">{k}</span>
                                    <span className="font-mono-ed text-[0.6rem] text-ink text-right ml-3 leading-tight">{v}</span>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            )}

            {/* Secondary projects — 2-column row */}
            {secondary.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 border-b border-ink">
                    {secondary.map((project, i) => (
                        <div
                            key={project.id}
                            className={`py-7 ${i === 0 ? "md:pr-8 md:border-r border-ink" : "md:pl-8"} border-t md:border-t-0 border-ink`}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <span className="section-label-inv text-[0.58rem]">
                                    {CATEGORY_LABELS[project.category] ?? project.category}
                                </span>
                                <span className="dateline">· {project.status}</span>
                            </div>

                            <h3
                                className="font-playfair font-black text-ink leading-tight mb-2"
                                style={{ fontSize: "clamp(1.3rem, 2.2vw, 1.8rem)" }}
                            >
                                {project.title}
                            </h3>

                            <p className="font-playfair italic text-ink-mid text-sm leading-snug mb-4 pb-3 border-b border-ink">
                                {project.short_desc}
                            </p>

                            <p className="column-text text-sm mb-4 line-clamp-4">
                                {project.long_desc}
                            </p>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {project.tech_stack?.slice(0, 4).map((tech) => (
                                    <span key={tech} className="tech-tag text-[0.58rem]">{tech}</span>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-3 border-t border-ink">
                                {project.github_url && (
                                    <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                                        className="font-mono-ed text-[0.62rem] uppercase tracking-widest text-ink hover:underline underline-offset-2">
                                        GitHub ↗
                                    </a>
                                )}
                                {project.live_url && (
                                    <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                                        className="font-mono-ed text-[0.62rem] uppercase tracking-widest text-ink hover:underline underline-offset-2">
                                        Live Demo ↗
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

function ProjectsSkeleton() {
    return (
        <section className="broadsheet">
            <div className="flex items-center gap-3 py-2 border-t-4 border-b border-ink">
                <span className="section-label-inv">Projects</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-ink">
                <div className="lg:col-span-8 py-7 lg:pr-10 lg:border-r border-ink space-y-4">
                    <div className="h-3 w-1/4 bg-paper-dark animate-pulse" />
                    <div className="h-10 w-full bg-paper-dark animate-pulse" />
                    <div className="h-4 w-5/6 bg-paper-dark animate-pulse mt-4" />
                    <div className="h-4 w-4/5 bg-paper-dark animate-pulse" />
                    <div className="h-4 w-full bg-paper-dark animate-pulse" />
                </div>
                <div className="lg:col-span-4 py-7 lg:pl-7 space-y-3">
                    <div className="h-20 bg-paper-dark animate-pulse" />
                </div>
            </div>
        </section>
    );
}