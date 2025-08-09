# Quartz Toggle Public Image Plugin

An Obsidian plugin that toggles attachment files between public and private states by adding or removing a customizable prefix (default: `public-`) to filenames.

## Features

- Toggle one or multiple attachments (non-Markdown files) between public and private.
- Context menu options dynamically show:
  - **Make Private** if 1+ public files selected.
  - **Make Public** if 1+ private files selected.
  - Both options if both types selected.
- Batch rename with automatic Obsidian link updates.
- Customizable prefix string (default: `public`), with automatic hyphen added internally.
- Skips non-attachment files silently.

This plugin is intended to be used with [Quartz's](https://quartz.jzhao.xyz/) [Explicit Publish and ignorePatterns](https://oliverfalvai.com/evergreen/my-quartz-+-obsidian-note-publishing-setup#mixing-private-and-public-notes).
## Installation

1. Clone or download this plugin into your vault's `.obsidian/plugins/quartz-toggle-public-image` folder from the [repository](https://github.com/Haroombe/obsidian-quartz-toggle-public-image-plugin.git).
2. Enable it in Obsidian’s Community Plugins.
3. Configure the prefix in plugin settings if you want to change the default.

## Usage

- Right-click one or more attachments in the file explorer.
- Based on selection, choose to make public or private.
- The plugin will rename files accordingly, adding or removing the prefix.

## Settings

- **Public prefix**: The prefix that marks a file as public.  
  - Users enter the prefix without a hyphen (e.g., `public`).  
  - The plugin adds the hyphen (`-`) internally for filenames, e.g., `public-filename.png`.

## License

MIT © Haroombe
