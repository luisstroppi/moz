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
        primario: "#8c3f2a",
        acento: "#d2a04c"
      }
    }
  },
  plugins: []
};

export default config;
