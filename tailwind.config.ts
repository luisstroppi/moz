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
        fondo: "#fff4f9",
        primario: "#ff006e",
        acento: "#ffd4e7",
        secundario: "#c40056"
      }
    }
  },
  plugins: []
};

export default config;
