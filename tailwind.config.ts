import type { Config } from "tailwindcss";

// Design system: institutional research-terminal aesthetic.
// Neutral ink/paper base, one restrained signal color, evidence-status colors
// used consistently across the whole app (see EvidenceTag component).
const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0a0b0d",
          900: "#111318",
          800: "#181b22",
          700: "#232733",
          600: "#2f3441",
          500: "#454c5c",
          400: "#6b7180",
          300: "#9298a6",
          200: "#c4c8d1",
          100: "#e4e6ea",
          50: "#f5f6f8",
        },
        paper: "#fbfbfa",
        signal: {
          DEFAULT: "#1f5eff",
          50: "#eef3ff",
          100: "#d9e4ff",
          600: "#1f5eff",
          700: "#1747c9",
        },
        evidence: {
          fact: "#1a7a4c",
          factBg: "#e8f5ee",
          analysis: "#1f5eff",
          analysisBg: "#eef3ff",
          assumption: "#a15c00",
          assumptionBg: "#fbf1de",
          unknown: "#6b7180",
          unknownBg: "#eef0f3",
        },
        risk: {
          low: "#1a7a4c",
          medium: "#a15c00",
          high: "#b3261e",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,17,21,0.04), 0 1px 0 rgba(15,17,21,0.03)",
        panel: "0 4px 16px rgba(15,17,21,0.08)",
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
