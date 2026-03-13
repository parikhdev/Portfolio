export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="broadsheet py-8 border-t-4 border-ink mt-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <p className="font-playfair font-black text-ink text-lg leading-none">
                        Yash Parikh
                    </p>
                    <p className="dateline mt-1">
                        The Developer&apos;s Gazette · Est. 2022 · Moradabad, India
                    </p>
                </div>

                <div className="text-center">
                    <p className="font-mono-ed text-[0.6rem] uppercase tracking-widest text-ink-faint">
                        Built with Next.js 14 · Supabase · Groq · Vercel
                    </p>
                    <p className="dateline mt-1">
                        All dispatches © {year} Yash Parikh
                    </p>
                </div>

                <div className="flex gap-4">
                    {[
                        { label: "GitHub", href: "https://github.com/parikhdev" },
                        { label: "LinkedIn", href: "https://linkedin.com/in/parikhyashofficial" },
                        { label: "YouTube", href: "https://www.youtube.com/@YashParikhOfficial" },
                        { label: "LeetCode", href: "https://leetcode.com/u/YashParikh/" },
                        { label: "Kaggle", href: "https://www.kaggle.com/dominatoryash" },
                    ].map(({ label, href }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono-ed text-[0.6rem] uppercase tracking-widest text-ink-faint hover:text-ink transition-colors"
                        >
                            {label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
  }