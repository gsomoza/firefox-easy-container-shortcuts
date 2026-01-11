# Contributing to Easy Container Shortcuts

Thank you for your interest in contributing to Easy Container Shortcuts! This document provides guidelines and instructions for contributing to this Firefox Add-on.

## Table of Contents

- [Contributing to Easy Container Shortcuts](#contributing-to-easy-container-shortcuts)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Repository Structure](#repository-structure)
  - [Development Workflow](#development-workflow)
  - [Forking](#forking)
  - [Making Changes](#making-changes)
    - [Key Files](#key-files)
    - [Adding a New Keyboard Shortcut](#adding-a-new-keyboard-shortcut)
    - [WebExtensions APIs Used](#webextensions-apis-used)
    - [Committing](#committing)
  - [Testing](#testing)
    - [Loading the Extension Locally](#loading-the-extension-locally)
      - [Using web-ext (Recommended Method)](#using-web-ext-recommended-method)
      - [Temporary Installation (Alternative)](#temporary-installation-alternative)
    - [Manual Testing](#manual-testing)
    - [Debugging](#debugging)
  - [Submitting Changes](#submitting-changes)
    - [Pull Request Guidelines](#pull-request-guidelines)
  - [Code Style](#code-style)
  - [Questions?](#questions)

## Getting Started

### Prerequisites

- [Firefox Developer Edition](https://www.mozilla.org/firefox/developer/) or Firefox 57+ (recommended for development)
- Basic knowledge of JavaScript and the [WebExtensions API](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions)
- An IDE of your choice

### Repository Structure

```
firefox-easy-container-shortcuts/
├── assets/               # Extension icons and potentially other assets
├── background.js         # Main extension logic (background script)
├── manifest.json         # Extension manifest (WebExtension configuration)
└── README.md             # Usage information
```

## Development Workflow

1. [Fork](#forking) this repository and clone it locally
2. [Make your changes](#making-changes)
3. [Test](#testing) them on your local Firefox installation
4. Ensure the documentation is updated where needed
5. [Submit a Pull Request](#submitting-changes)

## Forking

1. **Fork the repository** on GitHub – or use [Github CLI](https://cli.github.com):
   ```bash
   gh repo fork --clone https://github.com/gsomoza/firefox-easy-container-shortcuts
   cd firefox-easy-container-shortcuts
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

## Making Changes

### Key Files

- `manifest.json`: Defines extension metadata, permissions, keyboard shortcuts, and commands.  Modify this file to add new shortcuts or change existing ones. 

- `background.js`: Contains the main extension logic.  This script handles keyboard command events and performs container-related operations using the WebExtensions API. 

### Adding a New Keyboard Shortcut

1. Add a new command entry in `manifest.json` under the `commands` section:

   ```json
   "ecs-your-new-command": {
     "suggested_key": {
       "default":  "Ctrl+Shift+X",
       "mac": "Alt+Shift+X"
     },
     "description": "Description of your new command"
   }
   ```

2. Handle the new command in `background.js` within the `onContainerCommand` function.

### WebExtensions APIs Used

This extension primarily uses:
- [`browser.commands`](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/commands) - For keyboard shortcuts
- [`browser.contextualIdentities`](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/contextualIdentities) - For container management
- [`browser.tabs`](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/tabs) - For tab operations
- [`browser.windows`](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/windows) - For window operations

### Committing

Committ messages should follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) format: 

   ```bash
   git commit -m "feat: short description of your changes"
   ```

## Testing

### Loading the Extension Locally

#### Using web-ext (Recommended Method)

Mozilla's [web-ext](https://extensionworkshop. com/documentation/develop/getting-started-with-web-ext/) tool provides a better development experience:

1. **Install web-ext**

   ```bash
   npm ci
   ```

2. **Run the extension**

   ```bash
   npx web-ext run
   ```

   This launches Firefox with the extension pre-loaded and automatically reloads it when you make changes.

3. **Lint the extension**

   ```bash
   npx web-ext lint
   ```

#### Temporary Installation (Alternative)

1. Open Firefox and navigate to `about:debugging`
2. Click on **"This Firefox"** in the left sidebar
3. Click **"Load Temporary Add-on..."**
4. Navigate to your cloned repository folder
5. Select the `manifest.json` file
6. The extension should now be loaded and active
7. Make sure Firefox Containers [are enabled](https://support.mozilla.org/en-US/kb/how-use-firefox-containers#w_enable-firefox-containers) 
   and that you have several containers defined (if possible, as many as there are shortcuts).

> **Note:** Temporary add-ons are removed when Firefox is closed.  You'll need to reload them each time you restart Firefox.

### Manual Testing

1. Load the extension temporarily (see [Loading the Extension Locally](#loading-the-extension-locally))
2. Create multiple containers in Firefox (if you haven't already):
   - Click the containers icon in the toolbar, or
   - Right-click the New Tab button → "Open in New Container Tab"
3. Test all keyboard shortcuts (see README.md)

### Debugging

1. Open `about:debugging` → **This Firefox**
2. Find "Easy Container Shortcuts" and click **Inspect**
3. This opens the developer tools for the extension's background script
4. Check the Console tab for any errors or debug messages

## Submitting Changes

1. **Push the changes to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request** against the `main` branch:
   
   ```bash
   gh pr create
   ```

### Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Ensure your code follows the existing code style
- Test your changes thoroughly before submitting

## Code Style

- Use consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing patterns in the codebase
- Keep functions focused and modular

## Questions? 

If you have questions or need help, feel free to [open an issue](https://github.com/gsomoza/firefox-easy-container-shortcuts/issues/new) on GitHub.

Thank you for contributing! 🎉
