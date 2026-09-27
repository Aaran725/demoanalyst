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
        // Institutional navy — the app's one restrained accent (primary CTAs,
        // active/selected states, the logo mark, links). Deliberately distinct
        // from evidence.analysis's brighter blue below: this is a *brand*
        // color, not a claim-status color, even though the two used to share
        // a hex before the redesign.
        signal: {
          DEFAULT: "#1f2a44",
          50: "#eef0f4",
          100: "#dde2ea",
          600: "#1f2a44",
          700: "#161e33",
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
        // Chart-only colors, validated with the dataviz skill's palette
        // checker (contrast, colorblind-safe separation, chroma floor).
        // `chartUnknown` exists because evidence.unknown (#6b7180) is too
        // low-chroma to work as a categorical chart color — it reads as
        // "not a color" and sits too close to evidence.assumption for
        // normal vision. Badges still use evidence.unknown; only charts use
        // this. `competitor.*` is a separate categorical set so a chart
        // never implies a false link between competitor type and evidence
        // status by reusing the same colors for two unrelated things.
        chartUnknown: "#38539f",
        competitor: {
          direct: "#1f5eff",
          incumbent: "#b3261e",
          indirect: "#0a8f7f",
          emerging: "#6d4aa8",
        },
        // Devil's Advocate is deliberately its own high-contrast dark theme —
        // the one section that should NOT look like the rest of the app,
        // since its job is to argue against the deal on purpose.
        noir: {
          bg: "#15131a",
          text: "#f2efea",
          muted: "#9b96a3",
          accent: "#e0554a",
          track: "#2a2730",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        // Soft ambient elevation with a hairline top highlight, replacing the
        // old flat 1px-border look. `card` is the everyday card; `panel` is
        // for a hero/outer container that should feel a level above it.
        card: "inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 22px rgba(30,35,55,0.06)",
        panel: "0 20px 50px rgba(30,40,70,0.10), 0 2px 6px rgba(30,40,70,0.05)",
        button: "inset 0 1px 0 rgba(255,255,255,0.2), 0 6px 16px rgba(31,42,68,0.28)",
        buttonGhost: "inset 0 1.5px 0 rgba(255,255,255,1), inset 0 -1px 1px rgba(30,35,55,0.05), 0 5px 15px rgba(30,35,55,0.1)",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "22px",
      },
    },
  },
  plugins: [],
};

export default config;
