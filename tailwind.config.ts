import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        poe: {
          gold: "#af6025",
          dark: "#0d0d0d",
          panel: "#1a1209",
          border: "#5a3a1a",
          text: "#a38d6d",
          highlight: "#c8a96e",
        },
      },
      fontFamily: {
        poe: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
