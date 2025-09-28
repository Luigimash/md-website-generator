This website generator will generate a complete, fully fledged website, whose content is populated by some Markdown files, say from an Obsidian vault. We will henceforth refer to the original collection of nested markdown files as the vault. 

There will be minimal styling, if any at all. The website will be built using bare HTML and CSS, but resemble that of some early 1990s websites, and will mostly be raw HTML elements styling with direct translations from Markdown to HTML. For example, headers can be `<h1>` `<h2>` `<h3>` exactly correlating to using #, ##, or ### in Markdown. 

Javascript can be used for basic website website modernization, for things such as ensuring the website is pleasantly viewable on mobile in addition to desktop. 

For all intents and purposes, this project is like a compiler that converts a Markdown vault into an HTML/CSS/JS website. 

There will be a header present on every webpage that will be static and identical across webpages, which will have quick access links to the homepage (index.html), as well as to other important pages.

The webpages will be nested and accessed in the same identical structure as the vault they originated from. In the header, there will be a link to every *folder* and *webpage* nested in the root of the vault. Clicking a webpage link obviously brings you to that page, and clicking a folder will bring you to a basic webpage that lists the contents of the folder as links; clicking folders tacks you to a new webpage showing you the contents of that folder, so on and so forth. 

At the top of every webpage, but underneath the static header, write the "filepath" of the file's location, with links to access any of the previous folders listed in its filepath. 