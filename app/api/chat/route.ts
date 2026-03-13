import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ContextChunk {
    id: string;
    content: string;
    metadata: { type?: string; title?: string; slug?: string };
    similarity: number;
}

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

async function embed(text: string): Promise<number[]> {
    const res = await fetch(
        "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: [text], options: { wait_for_model: true } }),
        }
    );

    if (!res.ok) throw new Error(`HuggingFace embedding failed: ${res.status}`);
    const data = await res.json();
    return data[0];
}

const SYSTEM_PROMPT = `You are "The Gazette Bot" — the AI correspondent for Yash Parikh's newspaper-style portfolio, "The Developer's Gazette."

Your persona: A sharp, witty editorial journalist conducting a live press interview. You answer questions about Yash Parikh using the context provided. You speak in a professional but engaging editorial tone — think The Economist meets a tech interview.

Rules:
- Only answer questions about Yash Parikh, his work, skills, projects, education, and contact information
- Use the provided context to answer accurately
- If information is not in the context, say: "The correspondent hasn't filed that dispatch yet."
- Keep answers concise — 2-4 sentences max unless a detailed answer is clearly needed
- Never fabricate facts, URLs, or credentials
- Maintain the newspaper editorial persona throughout
- For contact or hiring questions, always provide the email: itsyashparikh@gmail.com`;

export async function POST(req: NextRequest) {
    try {
        const { message, history = [] } = await req.json() as {
            message: string;
            history: ChatMessage[];
        };

        if (!message?.trim()) {
            return NextResponse.json({ error: "No message provided" }, { status: 400 });
        }
        

        const queryEmbedding = await embed(message);

        const { data: context, error: matchError } = await supabase.rpc(
            "match_portfolio_content",
            {
                query_embedding: queryEmbedding,
                match_threshold: 0.1,
                match_count: 8,
            }
        );

        if (matchError) console.error("Vector search error:", matchError);

        const contextText = (context as ContextChunk[] | null)?.length
            ? (context as ContextChunk[]).map((c) => c.content).join("\n\n")
            : "No specific context found.";

        const messages = [
            {
                role: "system" as const,
                content: `${SYSTEM_PROMPT}\n\n--- CONTEXT ---\n${contextText}\n--- END CONTEXT ---`,
            },
            ...history.slice(-6).map((msg) => ({
                role: msg.role,
                content: msg.content,
            })),
            { role: "user" as const, content: message },
        ];

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages,
            max_tokens: 400,
            temperature: 0.7,
        });

        const answer =
            completion.choices[0]?.message?.content ?? "The dispatch failed to arrive.";

        await supabase.from("chat_logs").insert({
            session_id: req.headers.get("x-session-id") ?? "anonymous",
            question: message,
            answer,
            sources: (context as ContextChunk[] | null)?.map((c) => c.metadata?.type ?? "unknown") ?? [],
        });

        return NextResponse.json({ answer });
    } catch (err) {
        console.error("Chat API error:", err);
        return NextResponse.json(
            { error: "The press room is temporarily closed. Please try again." },
            { status: 500 }
        );
    }
}