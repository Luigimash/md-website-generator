const GOOGLE_FONTS_IMPORTS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">`
  ; //currently importing Newsreader and Pixelify Sans
  

export function generatePageTemplate({ title, content, breadcrumbs, navigation, siteName }) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>${title} - ${siteName}</title>
  <link rel="stylesheet" href="/styles.css">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">${GOOGLE_FONTS_IMPORTS}
</head>
<body>

  <div class="breadcrumb">
    ${breadcrumbs}
  </div>
  
  <main>
    ${content}
  </main>
</body>
</html>`;
}
// Note that we're ingesting google fonts in the <head>!
export function generateFolderIndexTemplate({ title, folderName, items, breadcrumbs, navigation, siteName }) {
  const itemsList = Object.entries(items)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, item]) => {
      if (item.type === 'folder') {
        return `<li><a href="/${item.path}/">${name}/</a></li>`;
      } else {
        return `<li><a href="/${item.path}.html">${item.name}</a></li>`;
      }
    })
    .join('\n      ');

  return `<!DOCTYPE html>
<html>
<head>
  <title>${title} - ${siteName}</title>
  <link rel="stylesheet" href="/styles.css">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">${GOOGLE_FONTS_IMPORTS}
</head>
<body>
  <div class="breadcrumb">
    ${breadcrumbs}
  </div>
  
  <main>
    <h1>${folderName}</h1>
    <ul>
      ${itemsList}
    </ul>
  </main>
</body>
</html>`;
}



/*
Storage for code if you want to spawn a header on a page
<body>
  <header>
    <nav>
      <span class="nav-item"><a href="/">Home</a></span>${navigation}
    </nav>
  </header>
  
*/