"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const SUGGESTED_QUESTIONS = [
    "What projects has Yash built?",
    "What is his tech stack?",
    "Is he open to work?",
    "Tell me about his AI experience",
];

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionId] = useState(() => Math.random().toString(36).slice(2));
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handler = () => setOpen(true);
        window.addEventListener("open-chatbot", handler);
        return () => window.removeEventListener("open-chatbot", handler);
    }, []);

    useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([{
                role: "assistant",
                content: "Good day. I am the Gazette Bot — editorial correspondent for Yash Parikh's portfolio. Ask me anything about his work, skills, or availability.",
            }]);
        }
        if (open) setTimeout(() => inputRef.current?.focus(), 100);
    }, [open, messages.length]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = useCallback(async (text?: string) => {
        const userMessage = (text ?? input).trim();
        if (!userMessage || loading) return;

        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-session-id": sessionId,
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.slice(-6),
                }),
            });

            const data = await res.json() as { answer?: string; error?: string };
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.answer ?? data.error ?? "Dispatch failed." },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "The press room is temporarily closed. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    }, [input, loading, messages, sessionId]);

    return (
        <>
            <button
                onClick={() => setOpen((o) => !o)}
                className="fixed bottom-6 right-6 z-50 bg-ink text-paper font-mono-ed text-[0.62rem] uppercase tracking-[0.15em] px-4 py-3 hover:bg-ink-light transition-colors duration-150 shadow-lg no-print"
                aria-label="Open chat"
            >
                {open ? "Close ✕" : "Interview the Journalist →"}
            </button>

            {open && (
                <div
                    id="chatbot"
                    className="fixed bottom-20 right-6 z-50 w-[92vw] max-w-md bg-paper border-2 border-ink shadow-2xl flex flex-col no-print"
                    style={{ height: "520px" }}
                >
                    <div className="border-b-4 border-ink px-4 py-3 bg-ink">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-playfair font-black text-paper text-base leading-none">
                                    The Gazette Bot
                                </p>
                                <p className="font-mono-ed text-[0.58rem] uppercase tracking-widest text-paper/60 mt-0.5">
                                    Editorial AI Correspondent
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="font-mono-ed text-[0.58rem] text-paper/60 uppercase tracking-widest">
                                    Live
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[85%] ${msg.role === "user"
                                            ? "bg-ink text-paper px-3 py-2"
                                            : "bg-paper-dark border border-ink px-3 py-2"
                                        }`}
                                >
                                    {msg.role === "assistant" && (
                                        <p className="font-mono-ed text-[0.55rem] uppercase tracking-widest text-ink-faint mb-1">
                                            Gazette Bot
                                        </p>
                                    )}
                                    <p className={`font-serif text-sm leading-relaxed ${msg.role === "user" ? "text-paper" : "text-ink-mid"}`}>
                                        {msg.content}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-paper-dark border border-ink px-3 py-2 max-w-[85%]">
                                    <p className="font-mono-ed text-[0.55rem] uppercase tracking-widest text-ink-faint mb-1">
                                        Gazette Bot
                                    </p>
                                    <div className="flex gap-1 items-center py-1">
                                        {[0, 1, 2].map((i) => (
                                            <span
                                                key={i}
                                                className="w-1.5 h-1.5 bg-ink-faint rounded-full animate-bounce"
                                                style={{ animationDelay: `${i * 0.15}s` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {messages.length === 1 && (
                        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                            {SUGGESTED_QUESTIONS.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => sendMessage(q)}
                                    className="font-mono-ed text-[0.58rem] uppercase tracking-wider border border-ink-faint text-ink-faint px-2 py-1 hover:border-ink hover:text-ink transition-colors duration-150"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-ink px-3 py-3 flex gap-2">
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Ask the correspondent..."
                            disabled={loading}
                            className="flex-1 bg-transparent font-serif text-sm text-ink placeholder:text-ink-faint border-b border-ink-faint focus:border-ink focus:outline-none pb-1 transition-colors disabled:opacity-50"
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={loading || !input.trim()}
                            className="font-mono-ed text-[0.62rem] uppercase tracking-widest bg-ink text-paper px-3 py-1 hover:bg-ink-light disabled:opacity-40 transition-colors duration-150"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}