// scripts/index-content.mjs
// Run with: node scripts/index-content.mjs

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function embed(text) {
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

  if (!res.ok) throw new Error(`HuggingFace failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data[0];
}

async function indexContent() {
  console.log("🗞  The Gazette — Content Indexer Starting...\n");

  await supabase
    .from("portfolio_embeddings")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  console.log("✓ Cleared old embeddings");

  const documents = [];

  const { data: profile } = await supabase.from("profiles").select("*").limit(1);
  if (profile?.[0]) {
    const p = profile[0];
    documents.push({
      content: `Yash Parikh is a Full Stack AI Developer and Content Creator. ${p.bio} Based in ${p.location}. Email: ${p.email}. GitHub: ${p.github_url}. LinkedIn: ${p.linkedin_url}. YouTube: ${p.youtube_url}. LeetCode: ${p.leetcode_url}. Kaggle: ${p.kaggle_url}. He is ${p.open_to_work ? "currently open to work and actively seeking opportunities" : "not currently seeking new opportunities"}.`,
      metadata: { type: "profile", name: p.full_name },
    });
    documents.push({
      content: `Yash Parikh's education: B.Tech CSE with AI & ML specialization at JSS Academy of Technical Education, APJ Abdul Kalam University. CGPA: 8.05. Graduating 2026. Previously: Shirdi Sai Public School Moradabad (Class 12 CBSE, 82.2%) and KCM Public School Moradabad (Class 10 CBSE, 88.7%).`,
      metadata: { type: "education" },
    });
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true);
  for (const project of projects ?? []) {
    documents.push({
      content: `Project: ${project.title}. ${project.short_desc} ${project.long_desc} Tech stack: ${project.tech_stack?.join(", ")}. Status: ${project.status}. GitHub: ${project.github_url}. Live: ${project.live_url}.`,
      metadata: { type: "project", slug: project.slug, title: project.title },
    });
  }

  const { data: skills } = await supabase.from("skills").select("*");
  if (skills?.length) {
    const grouped = skills.reduce((acc, s) => {
      acc[s.category] = acc[s.category] ?? [];
      acc[s.category].push(`${s.name} (${s.proficiency}%)`);
      return acc;
    }, {});
    const skillText = Object.entries(grouped)
      .map(([cat, items]) => `${cat}: ${items.join(", ")}`)
      .join(". ");
    documents.push({
      content: `Yash Parikh's technical skills — ${skillText}.`,
      metadata: { type: "skills" },
    });
  }

  const { data: vlogs } = await supabase
    .from("vlogs")
    .select("*")
    .eq("published", true);
  for (const vlog of vlogs ?? []) {
    documents.push({
      content: `YouTube video: "${vlog.title}". ${vlog.description} Tags: ${vlog.tags?.join(", ")}. Watch at: ${vlog.youtube_url}.`,
      metadata: { type: "vlog", title: vlog.title },
    });
  }

  documents.push({
    content: `Contact Yash Parikh: Email itsyashparikh@gmail.com, GitHub github.com/parikhdev, LinkedIn linkedin.com/in/parikhyashofficial, YouTube @YashParikhOfficial, LeetCode leetcode.com/u/YashParikh, Kaggle kaggle.com/dominatoryash. Open to full-time roles, internships, freelance, and research collaborations in AI engineering and full stack development. Graduating June 2026.`,
    metadata: { type: "contact" },
  });

  documents.push({
    content: `This portfolio is built with Next.js 14, TypeScript, Tailwind CSS, Supabase pgvector, Groq LLaMA 3, and Vercel. The AI chatbot is called "Interview the Journalist" and uses RAG to answer questions about Yash Parikh.`,
    metadata: { type: "meta" },
  });

  console.log(`\n📰 Indexing ${documents.length} documents...\n`);

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    try {
      const embedding = await embed(doc.content);
      const { error } = await supabase.from("portfolio_embeddings").insert({
        content: doc.content,
        metadata: doc.metadata,
        embedding,
      });
      if (error) {
        console.error(`✗ Failed [${i + 1}]: ${error.message}`);
      } else {
        console.log(
          `✓ Indexed [${i + 1}/${documents.length}]: ${doc.metadata.type} — ${doc.metadata.title ?? doc.metadata.name ?? ""}`
        );
      }
    } catch (err) {
      console.error(`✗ Error [${i + 1}]:`, err.message);
    }
  }

  console.log("\n✅ Indexing complete. The Gazette is ready for interviews.\n");
}

indexContent().catch(console.error);
