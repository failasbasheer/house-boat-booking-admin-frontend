import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic Colors
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        "primary-light": "var(--color-primary-light)",
        accent: "var(--color-accent)",
        background: "var(--app-bg)",
        card: "var(--card-bg)",

        // Text Colors
        heading: "var(--text-headings)",
        body: "var(--text-body)",
        muted: "var(--text-muted)",

        // Status
        success: "var(--success)",
        error: "var(--error)",

        // Preview Page Colors (Premium Palette)
        ivory: {
          50: '#FDFBF7',
          100: '#F7F4EF',
          200: '#EAE5DB',
          300: '#D5CDC0',
        },
        forest: {
          900: '#14281D',
          950: '#0A160F',
        },
        bronze: {
          50: '#FBF8F6',
          200: '#E6DCCF',
          400: '#C2A47F',
          500: '#A6825D',
          600: '#8C6645',
        },
        espresso: {
          500: '#8D7B6F',
          600: '#705E53',
          800: '#4A3B32',
        }
      },
    },
  },
  plugins: [],
};
export default config;
