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
        fondo: "#f8f2e7",
        primario: "#154C52",
        acento: "#F0CD1B",
        secundario: "#5E1F1F"
      }
    }
  },
  plugins: []
};

export default config;
