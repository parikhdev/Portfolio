"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface Vlog {
    id: string;
    title: string;
    description: string;
    youtube_url: string;
    youtube_id: string;
    thumbnail_url: string;
    tags: string[];
    order_index: number;
}

export default function Vlogs() {
    const [vlogs, setVlogs] = useState<Vlog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase
            .from("vlogs")
            .select("*")
            .eq("published", true)
            .order("order_index", { ascending: true })
            .then(({ data }) => {
                setVlogs(data ?? []);
                setLoading(false);
            });
    }, []);

    if (loading) return <VlogsSkeleton />;

    const [featured, ...rest] = vlogs;

    return (
        <section id="vlogs" className="broadsheet">
            <div className="flex items-center gap-3 py-2 border-t-4 border-b border-ink">
                <span className="section-label-inv">Multimedia</span>
                <span className="section-label">Vlog Dispatches · YouTube</span>
                <a
                    href="https://www.youtube.com/@YashParikhOfficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dateline ml-auto hover:underline underline-offset-2"
                >
                    @YashParikhOfficial ↗
                </a>
            </div>

            {vlogs.length === 0 && (
                <div className="py-16 text-center border-b border-ink">
                    <p className="font-playfair italic text-ink-faint text-lg">
                        The correspondent is in the field. Dispatches forthcoming.
                    </p>
                </div>
            )}

            {featured && (
                <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-ink">
                    <div className="lg:col-span-7 py-7 lg:pr-10 lg:border-r border-ink">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="accent-flag">Video Report</span>
                            <span className="dateline">· YouTube Shorts</span>
                        </div>

                        <a
                            href={featured.youtube_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative group mb-5 overflow-hidden"
                            style={{ aspectRatio: "16/9" }}
                        >
                            {featured.thumbnail_url ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={featured.thumbnail_url}
                                        alt={featured.title}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                        unoptimized
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full bg-paper-darker flex items-center justify-center">
                                    <span className="font-mono-ed text-label text-ink-faint uppercase tracking-widest">
                                        No Thumbnail
                                    </span>
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-ink/0 group-hover:bg-ink/20 transition-all duration-200">
                                <div className="w-14 h-14 bg-ink text-paper flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        </a>

                        <h2
                            className="font-playfair font-black text-ink leading-tight mb-3"
                            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
                        >
                            {featured.title}
                        </h2>

                        <p className="column-text text-sm mb-4 line-clamp-3">
                            {featured.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-ink">
                            {featured.tags?.map((tag) => (
                                <span key={tag} className="tech-tag text-[0.58rem]">#{tag}</span>
                            ))}
                            <a
                                href={featured.youtube_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-auto tech-tag text-[0.58rem]"
                            >
                                Watch ↗
                            </a>
                        </div>
                    </div>

                    <aside className="lg:col-span-5 py-7 lg:pl-7 flex flex-col gap-6 border-t lg:border-t-0 border-ink">
                        <div className="border-t-4 border-b border-ink pt-4 pb-4">
                            <p className="section-label mb-2">Editor&apos;s Note</p>
                            <p
                                className="font-playfair font-black italic text-ink leading-tight"
                                style={{ fontSize: "clamp(1rem, 1.6vw, 1.25rem)" }}
                            >
                                &ldquo;Discipline documented in real time. Not a highlight reel — a working record of what it costs to build something from nothing.&rdquo;
                            </p>
                            <p className="dateline mt-3 uppercase">— The Gazette</p>
                        </div>

                        <div>
                            <p className="section-label border-b border-ink pb-1.5 mb-3">
                                Correspondent&apos;s Beat
                            </p>
                            {[
                                ["Format", "YouTube Shorts + Vlogs"],
                                ["Focus", "Study sessions, builds, fitness"],
                                ["Frequency", "Weekly dispatches"],
                                ["Channel", "@YashParikhOfficial"],
                                ["Platform", "YouTube"],
                            ].map(([k, v]) => (
                                <div key={k} className="flex justify-between items-start py-1.5 border-b border-paper-dark last:border-0">
                                    <span className="font-mono-ed text-[0.6rem] uppercase tracking-wider text-ink-faint">{k}</span>
                                    <span className="font-mono-ed text-[0.6rem] text-ink text-right ml-3">{v}</span>
                                </div>
                            ))}
                        </div>

                        <a
                            href="https://www.youtube.com/@YashParikhOfficial"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block border border-ink p-4 hover:bg-ink hover:text-paper transition-colors duration-200 group mt-auto"
                        >
                            <p className="font-mono-ed text-[0.62rem] uppercase tracking-widest text-ink-faint group-hover:text-paper mb-1">
                                Subscribe to the dispatch
                            </p>
                            <p className="font-playfair font-black text-ink group-hover:text-paper text-lg">
                                @YashParikhOfficial →
                            </p>
                        </a>
                    </aside>
                </div>
            )}

            {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-ink">
                    {rest.map((vlog, i) => (
                        <div
                            key={vlog.id}
                            className={`py-6 ${i < rest.length - 1 ? "md:border-r border-ink" : ""} ${i > 0 ? "md:px-6" : "md:pr-6"} border-t md:border-t-0 border-ink`}
                        >
                            <a href={vlog.youtube_url} target="_blank" rel="noopener noreferrer" className="block group">
                                {vlog.thumbnail_url && (
                                    <div className="relative w-full mb-3" style={{ aspectRatio: "16/9" }}>
                                        <Image
                                            src={vlog.thumbnail_url}
                                            alt={vlog.title}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                            unoptimized
                                        />
                                    </div>
                                )}
                                <h3 className="font-playfair font-black text-ink text-base leading-tight group-hover:underline underline-offset-2">
                                    {vlog.title}
                                </h3>
                                <p className="column-text text-sm mt-1.5 line-clamp-2">{vlog.description}</p>
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

function VlogsSkeleton() {
    return (
        <section className="broadsheet">
            <div className="flex items-center gap-3 py-2 border-t-4 border-b border-ink">
                <span className="section-label-inv">Multimedia</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-ink">
                <div className="lg:col-span-7 py-7 lg:pr-10 lg:border-r border-ink space-y-4">
                    <div className="w-full bg-paper-dark animate-pulse" style={{ aspectRatio: "16/9" }} />
                    <div className="h-8 w-3/4 bg-paper-dark animate-pulse" />
                    <div className="h-4 w-full bg-paper-dark animate-pulse" />
                </div>
                <div className="lg:col-span-5 py-7 lg:pl-7 space-y-3">
                    <div className="h-24 bg-paper-dark animate-pulse" />
                </div>
            </div>
        </section>
    );
}