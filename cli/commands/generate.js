import chalk from "chalk";
import shell from "shelljs";
import fsPromises from "fs/promises";

export async function generate() {
  // Step 1: install dependecies (tailwindcss, tailwind-animte, tailwind-variants, post-css)
  chalk.blue("[step 1]: installing dependecies....");
  shell.exec(
    "npm install npm install -D tailwindcss postcss autoprefixer tailwindcss-animate tailwind-variants tailwind-merge react-aria"
  );

  chalk.blue("[step 2]: installing @rui/theme....");
  // Step 2: clonet @rui/theme component ---- TO DO

  // Step 3: init tailwindcss.config
  chalk.blue("[step 3]: initializing taiwlind config....");
  shell.exec("npx tailwindcss init -p");

  // Step 4: create @rui default  theme for tailwindcss
  chalk.blue("[step 4]: generating default theme....");
  const workingDir = shell.pwd();
  const tailwindConfigPath = `${workingDir}/tailwind.config.js`;
  const tailwindConfigTemplate = `
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
  `;
  await fsPromises.writeFile(tailwindConfigPath, tailwindConfigTemplate);
}
