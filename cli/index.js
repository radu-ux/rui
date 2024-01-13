#!/usr/bin/env node
import { Command } from "commander";

import { generate } from "./commands/generate.js";

const program = new Command();
program
  .option("generate")
  .description("generate: create tailwindcss.config, insall @rui-theme")
  .action(generate);

program.parse();
