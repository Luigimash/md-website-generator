import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkWikiLink from 'remark-wiki-link';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { glob } from 'glob';
import fs from 'fs-extra';
import path from 'path';

export async function parseMarkdownFile(filePath, vaultPath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const { frontmatter, body } = extractFrontmatter(content);
  
  const wikiLinkMap = await buildWikiLinkMap(vaultPath);
  const processedBody = await preprocessObsidianSyntax(body, vaultPath);
  
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkWikiLink, {
      pageResolver: (name) => [wikiLinkMap[name] || name],
      hrefTemplate: (permalink) => `/${permalink}.html`,
      aliasDivider: '|'
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true });
  
  const result = await processor.process(processedBody);
  
  return {
    html: String(result),
    frontmatter,
    title: frontmatter.title || extractTitleFromContent(body) || path.basename(filePath, '.md')
  };
}

export async function buildWikiLinkMap(vaultPath) {
  const markdownFiles = await glob('**/*.md', { cwd: vaultPath });
  const wikiLinkMap = {};
  
  for (const file of markdownFiles) {
    const baseName = path.basename(file, '.md');
    const relativePath = file.replace(/\.md$/, '');
    wikiLinkMap[baseName] = relativePath;
  }
  
  return wikiLinkMap;
}

function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    const frontmatterYaml = match[1];
    const body = content.slice(match[0].length);
    
    const frontmatter = {};
    frontmatterYaml.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim();
        frontmatter[key] = value.replace(/^["']|["']$/g, '');
      }
    });
    
    return { frontmatter, body };
  }
  
  return { frontmatter: {}, body: content };
}

function extractTitleFromContent(content) {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : null;
}

async function preprocessObsidianSyntax(content, vaultPath) {
  const imageMap = await buildImageMap(vaultPath);
  
  const processedContent = content.replace(/!\[\[([^\]]+)\]\]/g, (match, imageName) => {
    const imageFileName = imageMap[imageName];
    if (imageFileName) {
      const encodedFileName = encodeURIComponent(imageFileName);
      return `![${imageName}](/images/${encodedFileName})`;
    }
    return match;
  });
  
  return processedContent;
}

async function buildImageMap(vaultPath) {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.jfif'];
  const imageFiles = await glob('**/*', { 
    cwd: vaultPath,
    nodir: true 
  });
  
  const imageMap = {};
  
  imageFiles
    .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
    .forEach(file => {
      const baseName = path.basename(file);
      imageMap[baseName] = baseName;
      
      const nameWithoutExt = path.basename(file, path.extname(file));
      imageMap[nameWithoutExt] = baseName;
    });
  
  return imageMap;
}

export async function copyImages(inputDir, outputDir) {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.jfif'];
  const imageFiles = await glob('**/*', { 
    cwd: inputDir,
    nodir: true 
  });
  
  const imagesToCopy = imageFiles.filter(file => 
    imageExtensions.includes(path.extname(file).toLowerCase())
  );
  
  const imagesDir = path.join(outputDir, 'images');
  await fs.ensureDir(imagesDir);
  
  for (const imageFile of imagesToCopy) {
    const sourcePath = path.join(inputDir, imageFile);
    const destPath = path.join(imagesDir, path.basename(imageFile));
    await fs.copy(sourcePath, destPath);
  }
  
  return imagesToCopy.map(file => path.basename(file));
}