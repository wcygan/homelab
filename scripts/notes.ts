#!/usr/bin/env -S deno run --allow-write --allow-read --allow-run --allow-env

import $ from "@david/dax";
import { parseArgs } from "@std/cli/parse-args";

// Parse command line arguments
const args = parseArgs(Deno.args, {
  string: ["editor"],
  default: {
    editor: "zed"
  },
  alias: {
    e: "editor"
  }
});

// Get the current date and time
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');

// Get timezone abbreviation
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const tzAbbr = new Date().toLocaleTimeString('en-US', { 
  timeZoneName: 'short',
  timeZone 
}).split(' ').pop() || 'UTC';

// Create the directory structure
const dirPath = `notes/${year}/${month}/${day}`;
await $.raw`mkdir -p ${dirPath}`;

// Create the file path
const fileName = `${hours}-${minutes}-${seconds}-${tzAbbr}.md`;
const filePath = `${dirPath}/${fileName}`;

// Create initial content with metadata
const content = `---
date: ${now.toISOString()}
timezone: ${timeZone}
tags: []
---

# Note - ${now.toLocaleString()}

`;

// Create the file with initial content
await Deno.writeTextFile(filePath, content);

// Open in the specified editor
const editor = args.editor.toLowerCase();
switch (editor) {
  case 'zed':
    await $.raw`zed ${filePath}`;
    break;
  case 'vscode':
  case 'code':
    await $.raw`code ${filePath}`;
    break;
  case 'cursor':
    await $.raw`cursor ${filePath}`;
    break;
  default:
    console.error(`Unknown editor: ${editor}. Supported: zed, vscode, cursor`);
    Deno.exit(1);
}

console.log(`Created: ${filePath}`);