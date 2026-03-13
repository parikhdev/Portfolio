"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState<Status>("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        if (!form.message.trim() || !form.email.trim()) return;
        setStatus("sending");

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            setStatus("sent");
            setForm({ name: "", email: "", subject: "", message: "" });
        } else {
            setStatus("error");
        }
    };

    return (
        <section id="contact" className="broadsheet">
            {/* Section flag */}
            <div className="flex items-center gap-3 py-2 border-t-4 border-b border-ink">
                <span className="section-label-inv">Letters to the Editor</span>
                <span className="section-label">Correspondence · Open for Hire</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-ink">
                {/* Form — 7 cols */}
                <div className="lg:col-span-7 py-7 lg:pr-10 lg:border-r border-ink">
                    <h2
                        className="font-playfair font-black text-ink leading-tight mb-2"
                        style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
                    >
                        Write to the Correspondent
                    </h2>

                    <p
                        className="font-playfair italic text-ink-mid leading-snug mb-7 pb-5 border-b border-ink"
                        style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)" }}
                    >
                        Whether you have a proposition, a collaboration, or simply wish to
                        correspond — the editor reads every letter personally.
                    </p>

                    {status === "sent" ? (
                        <div className="border-t-4 border-b border-ink py-8 text-center">
                            <p className="font-playfair font-black text-ink text-2xl mb-2">
                                Letter Received.
                            </p>
                            <p className="font-playfair italic text-ink-mid">
                                The correspondent will reply at the earliest opportunity.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Name + Email row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="section-label block mb-1.5">Your Name</label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Full name"
                                        className="w-full bg-transparent border-b border-ink px-0 py-2 font-serif text-ink placeholder:text-ink-faint focus:outline-none focus:border-b-2 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="section-label block mb-1.5">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className="w-full bg-transparent border-b border-ink px-0 py-2 font-serif text-ink placeholder:text-ink-faint focus:outline-none focus:border-b-2 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="section-label block mb-1.5">Subject</label>
                                <input
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    placeholder="Re: Collaboration / Hire / General"
                                    className="w-full bg-transparent border-b border-ink px-0 py-2 font-serif text-ink placeholder:text-ink-faint focus:outline-none focus:border-b-2 transition-all"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="section-label block mb-1.5">Your Letter</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    rows={6}
                                    placeholder="Dear Yash, I am writing to enquire about..."
                                    className="w-full bg-transparent border border-ink px-3 py-2 font-serif text-ink placeholder:text-ink-faint focus:outline-none resize-none transition-all"
                                />
                            </div>

                            {status === "error" && (
                                <p className="font-mono-ed text-[0.62rem] text-accent uppercase tracking-widest">
                                    Dispatch failed. Please try again or email directly.
                                </p>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={status === "sending"}
                                className="font-mono-ed text-[0.62rem] uppercase tracking-[0.15em] bg-ink text-paper px-6 py-3 hover:bg-ink-light disabled:opacity-50 transition-colors duration-150"
                            >
                                {status === "sending" ? "Dispatching..." : "Send Letter →"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar — contact info */}
                <aside className="lg:col-span-5 py-7 lg:pl-7 flex flex-col gap-6 border-t lg:border-t-0 border-ink">
                    {/* Pull quote */}
                    <div className="border-t-4 border-b border-ink pt-4 pb-4">
                        <p
                            className="font-playfair font-black italic text-ink leading-tight"
                            style={{ fontSize: "clamp(1rem, 1.6vw, 1.25rem)" }}
                        >
                            &ldquo;Open to full-time roles, freelance contracts, research collaborations, and conversations worth having.&rdquo;
                        </p>
                        <p className="dateline mt-3 uppercase">— Editorial Policy</p>
                    </div>

                    {/* Direct contact */}
                    <div>
                        <p className="section-label border-b border-ink pb-1.5 mb-3">
                            Direct Correspondence
                        </p>
                        {[
                            { label: "Email", value: "itsyashparikh@gmail.com", href: "mailto:itsyashparikh@gmail.com" },
                            { label: "GitHub", value: "github.com/parikhdev", href: "https://github.com/parikhdev" },
                            { label: "LinkedIn", value: "parikhyashofficial", href: "https://linkedin.com/in/parikhyashofficial" },
                            { label: "LeetCode", value: "YashParikh", href: "https://leetcode.com/u/YashParikh/" },
                            { label: "Kaggle", value: "dominatoryash", href: "https://www.kaggle.com/dominatoryash" },
                            { label: "YouTube", value: "@YashParikhOfficial", href: "https://www.youtube.com/@YashParikhOfficial" },
                        ].map(({ label, value, href }) => (
                            <div key={label} className="flex justify-between items-start py-1.5 border-b border-paper-dark last:border-0">
                                <span className="font-mono-ed text-[0.6rem] uppercase tracking-wider text-ink-faint">{label}</span>
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono-ed text-[0.6rem] text-ink text-right ml-3 hover:underline underline-offset-2"
                                >
                                    {value} ↗
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Availability */}
                    <div className="border border-ink p-4">
                        <p className="section-label mb-2">Current Availability</p>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-green-600 inline-block" />
                            <span className="font-mono-ed text-[0.65rem] text-ink uppercase tracking-widest">
                                Open to Work
                            </span>
                        </div>
                        <p className="column-text text-sm mt-2">
                            Actively seeking full-time roles and internships in AI engineering,
                            full stack development, and product-focused engineering teams.
                            Graduating June 2026.
                        </p>
                    </div>
                </aside>
            </div>
        </section>
    );
}