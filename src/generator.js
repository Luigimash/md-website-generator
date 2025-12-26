import { glob } from 'glob';
import fs from 'fs-extra';
import path from 'path';
import { parseMarkdownFile, copyFiles } from './parser.js';
import { generatePageTemplate, generateFolderIndexTemplate } from './templates.js';
import { createBreadcrumbs, createNavigation } from './utils.js';

function filterIgnoredPaths(files, ignorePaths) {
  if (!ignorePaths || ignorePaths.length === 0) {
    return files;
  }
  
  return files.filter(file => {
    return !ignorePaths.some(ignorePath => {
      const normalizedIgnore = ignorePath.replace(/\\/g, '/');
      const normalizedFile = file.replace(/\\/g, '/');
      
      // Check if file starts with ignored path (for folders)
      return normalizedFile.startsWith(normalizedIgnore + '/') || 
             normalizedFile === normalizedIgnore ||
             normalizedFile === normalizedIgnore + '.md';
    });
  });
}

export async function buildSite(inputDir, outputDir, config) {
  const tempDir = `${outputDir}_temp`;
  
  try {
    await fs.ensureDir(tempDir);
    
    const allMarkdownFiles = await glob('**/*.md', { cwd: inputDir });
    const markdownFiles = filterIgnoredPaths(allMarkdownFiles, config.ignorePaths || []);
    const folderStructure = await buildFolderStructure(inputDir, markdownFiles);
    
    await copyFiles(inputDir, tempDir);
    await copyStaticAssets(tempDir);
    
    for (const file of markdownFiles) {
      await processMarkdownFile(file, inputDir, tempDir, folderStructure, config);
    }
    
    await generateFolderIndexes(folderStructure, tempDir, config);
    
    if (await fs.pathExists(outputDir)) {
      await fs.remove(outputDir);
    }
    await fs.move(tempDir, outputDir);
    
  } catch (error) {
    if (await fs.pathExists(tempDir)) {
      await fs.remove(tempDir);
    }
    throw error;
  }
}

async function processMarkdownFile(file, inputDir, outputDir, folderStructure, config) {
  const inputPath = path.join(inputDir, file);
  const relativePath = file.replace(/\.md$/, '');
  const outputPath = path.join(outputDir, `${relativePath}.html`);
  
  await fs.ensureDir(path.dirname(outputPath));
  
  const parsed = await parseMarkdownFile(inputPath, inputDir);
  const breadcrumbs = createBreadcrumbs(relativePath);
  const navigation = createNavigation(folderStructure.children, config);
  
  const html = generatePageTemplate({
    title: parsed.title,
    content: parsed.html,
    breadcrumbs,
    navigation,
    siteName: config.siteName || 'My Site'
  });
  
  await fs.writeFile(outputPath, html);
}

async function buildFolderStructure(inputDir, markdownFiles) {
  const structure = { children: {} };
  
  for (const file of markdownFiles) {
    const parts = file.split('/');
    let current = structure;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const folder = parts[i];
      if (!current.children[folder]) {
        current.children[folder] = { 
          type: 'folder',
          children: {},
          path: parts.slice(0, i + 1).join('/')
        };
      }
      current = current.children[folder];
    }
    
    const fileName = parts[parts.length - 1];
    const baseName = fileName.replace(/\.md$/, '');
    current.children[baseName] = {
      type: 'file',
      path: file.replace(/\.md$/, ''),
      name: baseName
    };
  }
  
  return structure;
}

async function generateFolderIndexes(structure, outputDir, config, currentPath = '') {
  for (const [name, item] of Object.entries(structure.children)) {
    if (item.type === 'folder') {
      const folderPath = path.join(outputDir, item.path);
      const indexPath = path.join(folderPath, 'index.html');
      
      await fs.ensureDir(folderPath);
      
      const breadcrumbs = createBreadcrumbs(item.path);
      const navigation = createNavigation(structure.children, config);
      
      const html = generateFolderIndexTemplate({
        title: name,
        folderName: name,
        items: item.children,
        breadcrumbs,
        navigation,
        siteName: config.siteName || 'My Site'
      });
      
      await fs.writeFile(indexPath, html);
      await generateFolderIndexes(item, outputDir, config, item.path);
    }
  }
}

async function copyStaticAssets(outputDir) {
  const staticDir = './static';
  if (await fs.pathExists(staticDir)) {
    const files = await fs.readdir(staticDir);
    for (const file of files) {
      const sourcePath = path.join(staticDir, file);
      const destPath = path.join(outputDir, file);
      await fs.copy(sourcePath, destPath);
    }
  }
}