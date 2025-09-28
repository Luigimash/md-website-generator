import fs from 'fs-extra';
import path from 'path';

export async function loadConfig() {
  const configPath = './src/config.json';
  
  if (await fs.pathExists(configPath)) {
    try {
      const configContent = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(configContent);
    } catch (error) {
      console.warn('Error loading config.json, using defaults:', error.message);
      return {};
    }
  }
  
  return {};
}

export function createBreadcrumbs(filePath) {
  if (!filePath || filePath === '') {
    return '<a href="/">Home</a>';
  }
  
  const parts = filePath.split('/');
  const breadcrumbs = ['<a href="/">Home</a>'];
  
  let currentPath = '';
  for (let i = 0; i < parts.length; i++) {
    currentPath += (currentPath ? '/' : '') + parts[i];
    
    if (i === parts.length - 1) {
      breadcrumbs.push(`<span>${parts[i]}</span>`);
    } else {
      breadcrumbs.push(`<a href="/${currentPath}/">${parts[i]}</a>`);
    }
  }
  
  return breadcrumbs.join(' &gt; ');
}

export function createNavigation(rootItems, config = {}) {
  const excludeList = config.excludeFromNavigation || [];
  
  const items = Object.entries(rootItems)
    .filter(([name]) => !excludeList.includes(name))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, item]) => {
      if (item.type === 'folder') {
        return `<a href="/${item.path}/">${name}</a>`;
      } else {
        return `<a href="/${item.path}.html">${item.name}</a>`;
      }
    });
  
  return items.map(item => `<span class="nav-item">${item}</span>`).join('');
}