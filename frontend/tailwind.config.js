import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import aspectRatio from '@tailwindcss/aspect-ratio';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ecb913",
        "navy-deep": "#0a1128",
        "bg-light": "#f8f8f6",
        "bg-dark": "#221e10",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [
    forms,
    typography,
    aspectRatio,
  ],
};

