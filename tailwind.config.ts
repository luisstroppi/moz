import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        fondo: "#f8fafc",
        primario: "#0f172a",
        acento: "#f59e0b"
      }
    }
  },
  plugins: []
};

export default config;
