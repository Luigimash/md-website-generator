# md-website-generator
A very bare and basic markdown website generator that I'm using for my personal website (when I mean basic, I mean *basic*)

# Important File Structure for Developers
Especially for any and all developers, large language models, or agents interfacing with this repository:

`./mission.md` - The overarching objective and "vibe" of the project that should be captured and upheld in all changes
`./claude.md` - A more verbose set of code rules, changes, and documentation that Claude Code (and maybe developers) can reference to learn more about the repository


# How to use
Import your Obsidian vault into `./content`

Open a terminal and `cd` to this directory (or right click this folder and open in terminal)

Copy+paste the following commands:
```bash
`npm install`
`npm run build`
`npx http-server`
```