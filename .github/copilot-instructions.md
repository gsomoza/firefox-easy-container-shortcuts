# Copilot Instructions for Firefox Easy Container Shortcuts

## Repository Overview

**Firefox Easy Container Shortcuts** is a Firefox 57+ WebExtension that provides keyboard shortcuts to open new tabs and windows in different containers. This is a small, focused extension with minimal dependencies.

**Project Type:** Firefox WebExtension (Browser Extension)
**Languages:** JavaScript (ES6+)
**Runtime:** Firefox 57+ browser
**Build Tool:** web-ext (Mozilla's official extension development tool)
**Size:** ~12 source files (excluding node_modules and .git)
**License:** BSD-3-Clause

## Build and Validation Commands

### Prerequisites
- Node.js 20.x (CI uses Node 20)
- npm (comes with Node.js)
- Firefox 57+ for manual testing

### Installation and Setup

**ALWAYS run `npm ci` for CI consistency** (not `npm install`):
```bash
npm ci
```

Note: `npm install` also works for local development but may update package-lock.json. Use `npm ci` to match CI behavior.

### Linting

**ALWAYS lint before committing:**
```bash
npm run lint
# or directly:
npx web-ext lint
```

This command validates the extension manifest and JavaScript code. It should return:
```
Validation Summary:
errors          0
notices         0
warnings        0
```

### Building (Optional)

To create a distributable .zip package:
```bash
npx web-ext build
```

Output is saved to `web-ext-artifacts/` directory (gitignored).

### Running the Extension Locally

**For development with auto-reload:**
```bash
npx web-ext run
```

This launches Firefox with the extension loaded and auto-reloads on file changes. Note: This requires Firefox to be installed and may not work in CI environments.

**Alternative - Manual Load:**
1. Open Firefox → `about:debugging`
2. Click "This Firefox" → "Load Temporary Add-on..."
3. Select `manifest.json` from the repository root
4. Ensure Container Tabs are enabled in Firefox preferences (`privacy.userContext.enabled`)

### Testing

**No automated tests exist.** All testing is manual:
1. Load the extension (see "Running the Extension Locally")
2. Create multiple containers in Firefox
3. Test keyboard shortcuts (see README.md for full list):
   - `Ctrl+Shift+#` (1-9): Open new tab in container # (Mac: `Alt+Shift+#`)
   - `Ctrl+Alt+#` (0-9): Reopen current tab in container # (same on Mac)
   - `Ctrl+Alt+T`: Open new tab in current container (same on Mac)
   - `Alt+Shift+T`: Open new window in current container (Mac: `MacCtrl+Shift+T`)
   - `Alt+Shift+#` (1-9): Open new window in container # (Mac: `MacCtrl+Shift+#`)
4. Check `about:debugging` → Inspect → Console for errors

## CI/CD Pipeline

### GitHub Actions Workflow: `lint-and-security.yml`

**Trigger:** Pull requests (opened, synchronize, reopened)

**Steps (run in order):**
1. `npm ci` - Install dependencies
2. `npm ls --depth=0` - Verify package structure
3. `npm audit --audit-level=moderate` - Security audit
4. `npx web-ext lint` - Lint extension

**All steps must pass for PR approval.** If any step fails:
- Check error messages carefully
- For audit failures: Address security vulnerabilities or adjust audit-level
- For lint failures: Run `npx web-ext lint` locally and fix issues

**Expected timing:**
- Full CI run: ~30-45 seconds
- `npm ci`: ~5-10 seconds
- `npx web-ext lint`: ~5 seconds

## Project Architecture and Layout

### Root Directory Structure

```
firefox-easy-container-shortcuts/
├── .github/
│   └── workflows/
│       ├── lint-and-security.yml    # Main CI pipeline
│       └── greetings.yml            # Welcome message for contributors
├── assets/
│   └── icon.svg                     # Extension icon
├── background.js                    # Main extension logic (130 lines)
├── manifest.json                    # Extension manifest & configuration
├── package.json                     # npm dependencies & scripts
├── package-lock.json                # Dependency lock file
├── .gitignore                       # Ignores: node_modules/, web-ext-artifacts/
├── .env                             # Mozilla API credentials (not committed)
├── README.md                        # User documentation
├── CONTRIBUTING.md                  # Developer guide
└── LICENSE.md                       # BSD-3-Clause license
```

### Key Files

**`manifest.json`** - Extension configuration (226 lines)
- Defines all keyboard shortcuts (commands section)
- Declares required permissions: `tabs`, `contextualIdentities`, `cookies`
- Contains extension metadata (name, version, description, icons)
- Uses manifest_version 2
- All shortcuts follow pattern: `ecs-{action}-{target}` with optional `-{number}` suffix

**`background.js`** - Core extension logic (131 lines)
- Background script that runs continuously
- Listens to keyboard commands via `browser.commands.onCommand`
- Main function: `onContainerCommand(command)` - Routes commands to appropriate handlers
- Uses Firefox WebExtensions APIs:
  - `browser.contextualIdentities` - Container management
  - `browser.tabs` - Tab operations
  - `browser.windows` - Window operations
- Functions are async and use Promises
- Error handling via `onError()` and console logging

**`package.json`** - Project configuration
- Single dev dependency: `web-ext@^8.3.0`
- Single npm script: `lint` → runs `web-ext lint`

### WebExtensions APIs Used

- `browser.commands` - Keyboard shortcut handling
- `browser.contextualIdentities` - Firefox Container APIs
- `browser.tabs` - Tab creation and manipulation
- `browser.windows` - Window creation
- `browser.cookies` - Required permission for container isolation

## Common Patterns and Conventions

### Code Style
- 2-space indentation
- Semicolons required
- Async/await with .then() chains for backward compatibility
- Console logging for errors and debug messages
- Meaningful variable names (e.g., `contextNumber`, `currentTab`)

### Command Naming Convention
All commands follow: `ecs-{action}-{target}` with optional `-{number}` for specific containers:
- `ecs-new-tab-container-1` through `ecs-new-tab-container-9` (numbered containers)
- `ecs-current-tab-container-0` through `ecs-current-tab-container-9` (numbered containers)
- `ecs-new-window-container-1` through `ecs-new-window-container-9` (numbered containers)
- `ecs-new-tab-current-container` (current container, no number)
- `ecs-new-window-current-container` (current container, no number)

### Container Indexing
- Container numbers 1-9 map to array indices 0-8
- Container "0" represents default (no container)
- Containers are fetched via `browser.contextualIdentities.query({})`

## Important Notes and Gotchas

### Dependencies
- Only one production dependency: `web-ext` (dev dependency)
- Installing dependencies updates package-lock.json license field automatically
- **Always use `npm ci` in CI/CD** to avoid package-lock.json changes

### Permissions Required
- The extension requires `privacy.userContext.enabled` to be enabled in Firefox
- If disabled, extension only logs errors (graceful degradation)

### File Artifacts
- `web-ext-artifacts/` directory is created by `npx web-ext build`
- `node_modules/` contains npm packages
- Both are gitignored

### Platform Differences
- New tab shortcuts: Windows/Linux use `Ctrl+Shift+#`, macOS uses `Alt+Shift+#`
- Reopen current tab shortcuts: All platforms use `Ctrl+Alt+#`
- New window shortcuts: Windows/Linux use `Alt+Shift+#`, macOS uses `MacCtrl+Shift+#`
- Current container shortcuts: `Ctrl+Alt+T` (all platforms) for tabs, `Alt+Shift+T` (Windows/Linux) or `MacCtrl+Shift+T` (Mac) for windows
- Manifest supports platform-specific key bindings via "mac" property

### Extension Limitations
- Cannot reopen tabs starting with `about:` (except `about:newtab`)
- If container doesn't exist for a shortcut number, command silently does nothing
- Temporary installations removed when Firefox closes

## Validation Checklist

Before submitting changes:
1. ✓ Run `npm ci` (or `npm install` locally)
2. ✓ Run `npx web-ext lint` - must show 0 errors/warnings
3. ✓ Run `npm audit --audit-level=moderate` - must show 0 vulnerabilities
4. ✓ Test changes manually in Firefox (load extension via about:debugging)
5. ✓ Verify all affected keyboard shortcuts still work
6. ✓ Check browser console for errors (about:debugging → Inspect)
7. ✓ Ensure package-lock.json changes (if any) are intentional
8. ✓ Update README.md if adding new shortcuts or features
9. ✓ Update manifest.json version if releasing
10. ✓ Follow conventional commit format: `type: description`

## Quick Reference

**Most common tasks:**
- Install: `npm ci`
- Lint: `npm run lint` or `npx web-ext lint`
- Build package: `npx web-ext build`
- Run with auto-reload: `npx web-ext run`
- Security audit: `npm audit`

**Remember:**
- This is a WebExtension, not a Node.js application
- No transpilation or bundling needed (plain JavaScript)
- No test framework (manual testing only)
- CI runs on Node 20.x
- Always test in actual Firefox browser
