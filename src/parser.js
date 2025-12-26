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

  // Process carousel code blocks first
  let processedContent = await processCarouselBlocks(content, vaultPath, imageMap);

  // Then process image embeds
  processedContent = processedContent.replace(/!\[\[([^\]]+)\]\]/g, (match, imageName) => {
    const imageFileName = imageMap[imageName];
    if (imageFileName) {
      const encodedFileName = encodeURIComponent(imageFileName);
      return `![${imageName}](/images/${encodedFileName})`;
    }
    return match;
  });

  return processedContent;
}

async function processCarouselBlocks(content, vaultPath, imageMap) {
  const carouselRegex = /```carousel\s*\n([\s\S]*?)```/g;
  let match;
  let processedContent = content;
  let carouselId = 0;

  while ((match = carouselRegex.exec(content)) !== null) {
    const configText = match[1];
    const config = parseCarouselConfig(configText);
    const images = await resolveCarouselImages(config, vaultPath, imageMap);
    const carouselHtml = generateCarouselHtml(images, config, carouselId++);
    processedContent = processedContent.replace(match[0], carouselHtml);
  }

  return processedContent;
}

function parseCarouselConfig(configText) {
  const config = {
    folder: null,
    images: [],
    height: '25rem',
    loop: false,
    direction: 'ltr',
    slidessize: '100%',
    slidesToScroll: 'auto',
    dragfree: false,
    align: 'center',
    axis: 'x',
    autoplay: false,
    autoscroll: false,
    fade: false,
    arrowbutton: true
  };

  const lines = configText.split('\n').filter(line => line.trim());
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim().toLowerCase();
      let value = line.slice(colonIndex + 1).trim();

      // Remove quotes if present
      value = value.replace(/^["']|["']$/g, '');

      // Parse boolean values
      if (value === 'true') value = true;
      else if (value === 'false') value = false;

      // Handle special cases
      if (key === 'images') {
        config.images = value.split(',').map(img => img.trim());
      } else if (key in config) {
        config[key] = value;
      }
    }
  }

  return config;
}

async function resolveCarouselImages(config, vaultPath, imageMap) {
  const images = [];

  // If specific images are listed, use those
  if (config.images && config.images.length > 0) {
    for (const imageName of config.images) {
      const imageFileName = imageMap[imageName];
      if (imageFileName) {
        const encodedFileName = encodeURIComponent(imageFileName);
        images.push(`/images/${encodedFileName}`);
      }
    }
  }

  // If folder is specified, get all images from that folder
  if (config.folder) {
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.jfif'];
    const folderPath = path.join(vaultPath, config.folder);

    if (await fs.pathExists(folderPath)) {
      const files = await fs.readdir(folderPath);
      for (const file of files) {
        if (imageExtensions.includes(path.extname(file).toLowerCase())) {
          const encodedFileName = encodeURIComponent(file);
          images.push(`/images/${encodedFileName}`);
        }
      }
    }
  }

  return images;
}

function generateCarouselHtml(images, config, carouselId) {
  if (images.length === 0) {
    return '<div class="carousel-error">No images found for carousel</div>';
  }

  const carouselClass = `carousel-${carouselId}`;
  const slideElements = images.map(imgSrc =>
    `<div class="carousel-slide" style="flex: 0 0 ${config.slidessize}"><img src="${imgSrc}" alt="Carousel image"></div>`
  ).join('\n    ');

  const arrowButtons = config.arrowbutton ? `
    <button class="carousel-prev" aria-label="Previous slide">&lt;</button>
    <button class="carousel-next" aria-label="Next slide">&gt;</button>` : '';

  return `<div class="carousel-container ${carouselClass}"
    data-loop="${config.loop}"
    data-direction="${config.direction}"
    data-slides-to-scroll="${config.slidesToScroll}"
    data-dragfree="${config.dragfree}"
    data-align="${config.align}"
    data-axis="${config.axis}"
    data-autoplay="${config.autoplay}"
    data-autoscroll="${config.autoscroll}"
    data-fade="${config.fade}"
    style="height: ${config.height}">
  <div class="carousel-viewport">
    <div class="carousel-track">
      ${slideElements}
    </div>
  </div>${arrowButtons}
</div>`;
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

export async function copyFiles(inputDir, outputDir) {
  const fileExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.jfif', '.pdf'];
  const allFiles = await glob('**/*', {
    cwd: inputDir,
    nodir: true
  });

  const filesToCopy = allFiles.filter(file =>
    fileExtensions.includes(path.extname(file).toLowerCase())
  );

  const imagesDir = path.join(outputDir, 'images');
  await fs.ensureDir(imagesDir);

  for (const file of filesToCopy) {
    const sourcePath = path.join(inputDir, file);
    const destPath = path.join(imagesDir, path.basename(file));
    await fs.copy(sourcePath, destPath);
  }

  return filesToCopy.map(file => path.basename(file));
}