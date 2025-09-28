#!/usr/bin/env node

import { buildSite } from './generator.js';
import { loadConfig } from './utils.js';
import path from 'path';
import fs from 'fs-extra';

async function main() {
  try {
    const config = await loadConfig();
    const inputDir = config.inputDir || './content';
    const outputDir = config.outputDir || './public';
    
    if (!await fs.pathExists(inputDir)) {
      console.error(`Input directory '${inputDir}' does not exist`);
      process.exit(1);
    }
    
    console.log(`Building site from '${inputDir}' to '${outputDir}'...`);
    
    await buildSite(inputDir, outputDir, config);
    
    console.log('Site built successfully!');
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

main();