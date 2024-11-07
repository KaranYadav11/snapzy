// /** @type {import('tailwindcss').Config} */

// export default {
//   darkMode: ["class"],
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}", // Ensures Tailwind scans all files in src
//   ],
//   theme: {
//     extend: {
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//       },
//       colors: {},
//     },
//   },
//   plugins: [import("tailwindcss-animate")],
// };

import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // colors: {
      //   "primary-500": "#877EFF",
      //   "primary-600": "#5D5FEF",
      //   "secondary-500": "#FFB620",
      //   "off-white": "#D0DFFF",
      //   red: "#FF5A5A",
      //   "dark-1": "#000000",
      //   "dark-2": "#09090A",
      //   "dark-3": "#101012",
      //   "dark-4": "#1F1F22",
      //   "light-1": "#FFFFFF",
      //   "light-2": "#EFEFEF",
      //   "light-3": "#7878A3",
      //   "light-4": "#5C5C7B",
      // },

      fontFamily: {
        lato: ["Lato", "sans-serif"],
        pacifico: ["Pacifico", "serif"],
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
