/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./packages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rui: {
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
          600: "#475569",
          500: "#64748b",
          400: "#94a3b8",
          300: "#cbd5e1",
          200: "#e2e8f0",
          100: "#f1f5f9",
          50: "#f8fafc",
        },
        "rui-red": {
          900: "#7f1d1d",
          800: "#991b1b",
          700: "#b91c1c",
          600: "#dc2626",
          500: "#ef4444",
          400: "#f87171",
          300: "#fca5a5",
          200: "#fecaca",
          100: "#fee2e2",
          50: "#fef2f2",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
