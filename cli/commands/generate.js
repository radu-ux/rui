import chalk from "chalk";
import shell from "shelljs";
import fsPromises from "fs/promises";

export async function generate() {
  // Step 1: install dependecies (tailwindcss, tailwind-animte, tailwind-variants, post-css)
  chalk.blue("[step 1]: installing dependecies....");
  shell.exec(
    "npm install npm install -D tailwindcss postcss autoprefixer tailwindcss-animate tailwind-variants"
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
  const colors = require("tailwindcss/colors");
  module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: { extends: { colors: {  } } },
    plugins: [],
  }
  `;
  await fsPromises.writeFile(tailwindConfigPath, tailwindConfigTemplate);
}
