import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        muted: "#64748b",
        line: "#dbe3ef",
        surface: "#f6f8fb",
        brand: "#3154d4",
        success: "#0f8a5f",
        warning: "#b7791f",
        danger: "#c2410c"
      },
      borderRadius: {
        card: "8px"
      }
    }
  },
  plugins: []
};

export default config;
