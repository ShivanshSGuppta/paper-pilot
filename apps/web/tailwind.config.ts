import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/shared/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f5f4f0",
        ink: "#111827",
        accent: {
          DEFAULT: "#f97316",
          soft: "#fff4e8"
        }
      },
      boxShadow: {
        soft: "0 12px 40px rgba(15, 23, 42, 0.08)",
        card: "0 8px 24px rgba(15, 23, 42, 0.06)"
      },
      borderRadius: {
        "3xl": "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
