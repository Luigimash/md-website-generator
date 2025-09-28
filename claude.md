# Claude.md - Implementation Plan & Code Rules

## Project Overview
A Node.js CLI tool that converts Obsidian markdown vaults into static HTML websites with 1990s-style minimal aesthetic.

## Architecture

### Core Dependencies
```json
{
  "unified": "^10.x",
  "remark-parse": "^10.x", 
  "@beyondsnk/remark-wiki-link": "^1.2.3",
  "remark-gfm": "^3.x",
  "remark-rehype": "^10.x", 
  "rehype-stringify": "^9.x",
  "fs-extra": "^11.x",
  "path": "built-in",
  "glob": "^10.x"
}
```

### Project Structure
```
./
|-- src/
|-- | -- index.js          # Main CLI entry point
|-- | -- parser.js         # Markdown parsing & wikilink resolution
|-- | -- config.json       # Json config file, contains user-modifiable constants to change the function of the generator
|-- | -- generator.js      # HTML generation & file operations
|-- | -- templates.js      # HTML templates for pages
|-- | -- utils.js          # Helper functions
|-- content/              # Default input directory (vault)
|-- public/               # Output directory (gitignored)
|-- static/
|-- | -- styles.css        # Minimal 90s-style CSS
|-- package.json
```

## Implementation Details

### CLI Interface
- **Command**: `npm run build`
- **Input**: `./content/` directory (or user-specified vault path)
- **Output**: `./public/` directory
- **Build Process**: Generate to temp folder, replace on success

### Markdown Processing Pipeline
1. **Scan vault** - Use glob to find all `.md` files
2. **Parse frontmatter** - Extract metadata (title, tags, etc.)
3. **Process wikilinks** - Resolve `[[Page Name]]` to actual file paths
4. **Convert to HTML** - unified/remark � rehype pipeline
5. **Generate navigation** - Create folder indices and breadcrumbs

### File Processing Rules

#### Wikilink Resolution
- `[[Page Name]]` � Search entire vault for `Page Name.md`
- `[[Page Name|Custom Text]]` � Use custom text as link text
- `[[Page Name#heading]]` � Link to specific heading
- **Conflict handling**: User responsible for unique page names

#### Image Handling
- Copy all images to `/public/images/`
- Update markdown image paths to `/images/filename.ext`
- Preserve original filenames

#### Directory Structure
- **Input**: Maintain original vault folder structure
- **Output**: Mirror structure in HTML with index.html for folders
- **Navigation**: Show immediate children only (files + folders)

### HTML Generation

#### Page Template Structure
```html
<!DOCTYPE html>
<html>
<head>
  <title>[Page Title] - [Site Name]</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <header>
    <nav>
      <a href="/">Home</a>
      <!-- Links to all root-level folders/files -->
    </nav>
  </header>
  
  <div class="breadcrumb">
    <!-- Home > Folder1 > Subfolder > Current Page -->
  </div>
  
  <main>
    <!-- Converted markdown content -->
  </main>
</body>
</html>
```

#### Folder Index Pages
- List immediate children (files + folders) alphabetically
- Files link to their HTML pages
- Folders link to their index pages
- Same header/breadcrumb as regular pages

### CSS Styling
- **Approach**: Bare HTML elements, minimal CSS
- **Aesthetic**: Early 1990s web style
- **Elements**: Direct h1/h2/h3, basic p/ul/ol, simple table styling
- **Responsive**: Basic mobile-friendly adjustments only
- **No frameworks**: Pure CSS only

### Error Handling
- **Missing wikilinks**: Log warning, leave as plain text
- **Build failures**: Keep previous generation, show errors
- **Invalid markdown**: Process what's possible, log issues

## Development Guidelines

### Code Style
- ES6+ modules
- Async/await for file operations
- Clear function separation of concerns
- Comprehensive error handling
- No comments unless complex logic requires explanation

### File Operations
- Use fs-extra for robust file handling
- Atomic builds (temp � replace on success)
- Preserve file timestamps where possible
- Handle both relative and absolute paths

### Testing Strategy
- Test with sample vault structures
- Verify wikilink resolution accuracy
- Check image copying and path updates
- Validate HTML output structure

## Future Enhancements (Not Initial Scope)
- Code syntax highlighting
- Advanced table styling
- Live rebuild watching
- Custom CSS injection
- Plugin system for extensions