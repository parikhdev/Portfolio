import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        serif: ["var(--font-source-serif)", "Georgia", "serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      colors: {
        ink: {
          DEFAULT: "#0D0D0D",
          light: "#1a1a1a",
          mid: "#3a3a3a",
          faint: "#6b6b6b",
        },
        paper: {
          DEFAULT: "#E8E0CC",
          dark: "#D9CFB8",
          darker: "#C8BC9F",
        },
        accent: "#B5000C",
        rule: "#0D0D0D",
      },
      maxWidth: {
        broadsheet: "1280px",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;