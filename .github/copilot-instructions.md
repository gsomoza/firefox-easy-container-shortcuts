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

### Running the Extension Locally

You should never do this. Running the extension locally requires Firefox to be installed, so it will not work in CI environments.

### Testing

**No automated tests exist.** All testing is manual.

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

**`manifest.json`** - Extension configuration
- Defines all keyboard shortcuts (commands section)
- Declares required permissions: `tabs`, `contextualIdentities`, `cookies`
- Contains extension metadata (name, version, description, icons)
- Uses manifest_version 2
- All shortcuts follow pattern: `ecs-{action}-{target}` with optional `-{number}` suffix

**`background.js`** - Core extension logic
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
- Single dev dependency: `web-ext`
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
- Console logging for errors and debug messages should be removed before production
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
- No production dependencies.
- Only one dev dependency: `web-ext`
- Except for when specifically adding/updating packages, **always use `npm ci` in CI/CD** to avoid package-lock.json changes

### File Artifacts
- `web-ext-artifacts/` directory is created by `npx web-ext build` - doesn't need to be used.
- `node_modules/` contains npm packages
- Both are gitignored

### Platform Differences
- New tab shortcuts: Windows/Linux use `Ctrl+Shift+#`, macOS uses `Alt+Shift+#`
- Reopen current tab shortcuts: All platforms use `Ctrl+Alt+#`
- New window shortcuts: Windows/Linux use `Alt+Shift+#`, macOS uses `MacCtrl+Shift+#`
- Current container shortcuts: `Ctrl+Alt+T` (all platforms) for tabs, `Alt+Shift+T` (Windows/Linux) or `MacCtrl+Shift+T` (Mac) for windows
- Manifest supports platform-specific key bindings via "mac" property

## Validation Checklist

Before submitting changes:
1. ✓ Run `npm ci` (use `npm install` only if adding/updating dependencies)
2. ✓ Run `npx web-ext lint` - must show 0 errors/warnings
3. ✓ Run `npm audit --audit-level=moderate` - must show 0 vulnerabilities
4. ✓ Ensure package-lock.json changes (if any) are intentional
5. ✓ Update README.md if adding new shortcuts or features
6. ✓ Update manifest.json version if releasing
7. ✓ Follow "conventional commits" format: `[feat|fix|docs|style|refactor|perf|test|chore|build]: description`

## Quick Reference

**Most common tasks:**
- Install: `npm ci`
- Lint: `npm run lint` or `npx web-ext lint`
- Security audit: `npm audit`

**Remember:**
- This is a WebExtension, not a Node.js application
- No transpilation or bundling needed (plain JavaScript)
- No test framework (manual testing only)
- CI runs on Node 20.x
- Do NOT try to test in Firefox - the user will have to test manually
