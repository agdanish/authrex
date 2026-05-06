import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Semantic tokens — driven by CSS custom properties (see styles/index.css).
        // Light values on :root, dark values on .dark.
        surface: {
          bg:          "rgb(var(--surface-bg) / <alpha-value>)",
          raised:      "rgb(var(--surface-raised) / <alpha-value>)",
          "raised-hi": "rgb(var(--surface-raised-hi) / <alpha-value>)",
          border:      "rgb(var(--surface-border) / <alpha-value>)",
          "border-hi": "rgb(var(--surface-border-hi) / <alpha-value>)",
          panel:       "rgb(var(--surface-panel) / <alpha-value>)",
        },
        ink: {
          primary: "rgb(var(--ink-primary) / <alpha-value>)",
          body:    "rgb(var(--ink-body) / <alpha-value>)",
          muted:   "rgb(var(--ink-muted) / <alpha-value>)",
          faint:   "rgb(var(--ink-faint) / <alpha-value>)",
          invert:  "rgb(var(--ink-invert) / <alpha-value>)",
        },
        accent: {
          brand:        "rgb(var(--accent-brand) / <alpha-value>)",
          "brand-soft": "rgb(var(--accent-brand-soft) / <alpha-value>)",
          "brand-glow": "rgb(var(--accent-brand-glow) / <alpha-value>)",
          cyan:         "rgb(var(--accent-cyan) / <alpha-value>)",
          green:        "rgb(var(--accent-green) / <alpha-value>)",
          red:          "rgb(var(--accent-red) / <alpha-value>)",
          amber:        "rgb(var(--accent-amber) / <alpha-value>)",
          blue:         "rgb(var(--accent-blue) / <alpha-value>)",
          violet:       "rgb(var(--accent-violet) / <alpha-value>)",
        },
        // Verdict tints (semantic for clinical decisions)
        verdict: {
          approve: "rgb(var(--accent-green) / <alpha-value>)",
          deny:    "rgb(var(--accent-red) / <alpha-value>)",
          refer:   "rgb(var(--accent-amber) / <alpha-value>)",
        },
        // Original brand-* kept for backward compat with components that haven't migrated yet
        brand: {
          50:  "#eef4ff",
          100: "#dbe5ff",
          200: "#bccdff",
          300: "#92acff",
          400: "#6582ff",
          500: "#4860ff",
          600: "#3142ec",
          700: "#2832c5",
          800: "#252e9c",
          900: "#1f267b",
        },
      },
      keyframes: {
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.55" },
        },
        "aurora-drift": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%":      { transform: "translate3d(40px, -30px, 0) scale(1.05)" },
        },
        "verdict-pulse": {
          "0%":   { opacity: "0.45", transform: "scale(0.96)" },
          "60%":  { opacity: "0",    transform: "scale(1.18)" },
          "100%": { opacity: "0",    transform: "scale(1.18)" },
        },
        "stagger-word": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.35s cubic-bezier(0.2, 0, 0, 1) both",
        "slide-in-up":    "slide-in-up 0.30s cubic-bezier(0.2, 0, 0, 1) both",
        "pulse-soft":     "pulse-soft 1.6s ease-in-out infinite",
        "aurora-drift":   "aurora-drift 35s ease-in-out infinite alternate",
        "verdict-pulse":  "verdict-pulse 0.6s cubic-bezier(0.2, 0, 0, 1) both",
        "stagger-word":   "stagger-word 0.45s cubic-bezier(0.2, 0, 0, 1) both",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
        serif: [
          "Crimson Pro",
          "Georgia",
          "serif",
        ],
      },
      fontFeatureSettings: {
        nums: '"tnum", "ss01"',
      },
    },
  },
  plugins: [],
} satisfies Config;
