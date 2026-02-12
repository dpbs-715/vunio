# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern Vue 3.5 component library template built with Turborepo monorepo architecture. The project provides a complete development environment for building enterprise-level component libraries with TypeScript 5+, comprehensive linting configurations, and automated workflows.

**Key Technologies**: Turborepo, Vue 3.5+, TypeScript 5+, Vite 6, Rollup, Pnpm, VitePress

## Essential Commands

### Development

```bash
# Start all packages in development mode
pnpm dev

# Start documentation site (VitePress)
pnpm dev:docs

# Start playground for testing components
pnpm dev:play
```

### Building

```bash
# Build all packages (via Turbo)
pnpm build

# Build documentation site
pnpm build:docs

# Unified build via Gulp (alternative approach)
pnpm build:gulp
```

### Testing & Quality

```bash
# Run tests in a specific package
cd packages/utils
pnpm test                    # Run all tests
pnpm test curry              # Run specific test file
pnpm test:watch              # Run tests in watch mode
pnpm test:coverage           # Run tests with coverage

# Run all linters
pnpm lint:all

# Run individual linters
pnpm lint:eslint    # Fix ESLint issues
pnpm lint:format    # Format with Prettier
pnpm lint:style     # Fix Stylelint issues
```

### Package Management

```bash
# Clean all build artifacts and dependencies
pnpm clean

# Update all dependencies to latest
pnpm deps:update

# Check for outdated dependencies
pnpm deps:check
```

### Publishing

```bash
# Create changeset (记录变更)
pnpm changeset

# Manual version bump (手动更新版本)
pnpm changeset:version

# Manual publish (手动发包)
pnpm publish
```

**自动发包流程（推荐）：**

1. 运行 `pnpm changeset` 创建变更记录
2. 提交并推送到 `master` 分支
3. GitHub Actions 自动创建 "Version Packages" PR
4. 合并 PR 后自动发布到 npm 并创建 GitHub Release

详细说明请查看 [自动发包指南](docs/AUTO_RELEASE.md)

### Utility

```bash
# Rename package scope (e.g., @DLib to @myorg)
pnpm rename-pkg:mac
```

## Project Architecture

### Monorepo Structure

The project uses **pnpm workspaces** with **Turborepo** for task orchestration:

- **`packages/ui`**: Main UI component library (dlib-ui)
  - Built with Vite
  - Components prefixed with `Common*` (e.g., CommonButton, CommonTable)
  - Includes custom unplugin-vue-components resolver for auto-import
  - Outputs: ESM (`dist/esm/`), CJS (`dist/cjs/`), Types (`dist/types/`)

- **`packages/hooks`**: Vue 3 composables library (dlib-hooks)
  - Built with Rollup
  - Exports reusable Vue composition functions

- **`packages/directives`**: Vue 3 directives library (dlib-directives)
  - Built with Rollup
  - Custom Vue directives (e.g., v-focus)

- **`packages/utils`**: Utility functions library (dlib-utils)
  - Built with Rollup
  - Framework-agnostic utilities organized by category:
    - `string/`: String manipulation (capitalize, camelToKebab)
    - `array/`: Array utilities (diff, sort, chunk, unique)
    - `object/`: Object utilities (pick, omit, getByPath, setByPath)
    - `function/`: Functional programming (curry with placeholder support)
    - `is/`: Type checking utilities (isString, isArray, isObject, etc.)
    - `async/`: Async wrappers (asyncCache with cache support)
    - `cache/`: Caching utilities (localStorage, sessionStorage, memory)
    - `clone/`: Deep cloning utilities
    - `parse/`: Data transformation utilities
    - `ep/`: ElementPlus-specific utilities (span methods)

- **`packages/lint-configs/*`**: Shared configuration packages
  - `commitlint-config`: Commit message conventions
  - `eslint-config`: ESLint rules for Vue 3 + TypeScript
  - `prettier-config`: Code formatting rules
  - `stylelint-config`: CSS/SCSS linting rules
  - `typescript-config`: TypeScript compiler configurations

- **`apps/docs`**: VitePress documentation site (@DLib/docs)
  - Internationalized (Chinese root, English /en)
  - Uses vitepress-demo-plugin for interactive component demos

- **`playground`**: Development playground (@DLib/playground)
  - Vite-based app for testing components during development

- **`build`**: Unified build scripts (Gulp + Rollup)
  - Alternative packaging approach to individual package builds
  - Orchestrates building all packages with shared configuration

### Build System Details

The project supports **two build approaches** - choose based on your preference:

#### 1. Individual Package Builds (Recommended - Default)

```bash
pnpm build
```

- Each package has its own build script and configuration
- UI package uses Vite with `preserveModules: true` for better tree-shaking
- Other packages use Rollup with dedicated configs
- Orchestrated by Turborepo with automatic dependency graph resolution
- Supports incremental builds and caching via Turbo
- Better for development and maintaining individual package independence

#### 2. Unified Build (Alternative)

```bash
pnpm build:gulp
```

- Centralized Gulp tasks in `build/gulpfile.js`
- Shared Rollup configurations in `build/rollup.*.config.js`
- Builds all packages with consistent configuration
- Useful for ensuring cross-package consistency
- No caching, always builds everything

**When to use which:**

- Use individual builds (default) for regular development and CI/CD
- Use unified build when you need guaranteed consistency across all packages

### Component Naming Convention

All UI components follow the `Common*` prefix pattern:

- `CommonButton`, `CommonTable`, `CommonForm`, etc.
- This enables the custom resolver to auto-import components
- See `packages/ui/src/resolver.ts` for resolver implementation

### Package Exports

All packages export both ESM and CJS formats:

```json
{
  "main": "dist/cjs/index.js", // CommonJS
  "module": "dist/esm/index.mjs", // ES Module
  "types": "dist/types/index.d.ts" // TypeScript definitions
}
```

## Development Workflow

### Adding a New Component

1. Create component directory in `packages/ui/src/components/YourComponent/`
2. Add component implementation and styles
3. Export from `packages/ui/src/components/index.ts`
4. Add to install array in `packages/ui/src/index.ts`
5. Document in `apps/docs/` (both `zh/` and `en/` directories)
6. Test in `playground/`

### Adding a New Utility Function

1. Create utility file in appropriate category directory (e.g., `packages/utils/src/function/yourUtil.ts`)
2. Export from the category's `index.ts` (e.g., `packages/utils/src/function/index.ts`)
3. Ensure the category is exported from `packages/utils/src/index.ts`
4. Add comprehensive tests in `__tests__/` directory
5. Document in `apps/docs/zh/packages/utils/[category]/index.md` (Chinese)
6. Document in `apps/docs/en/packages/utils/[category]/index.md` (English)
7. Update sidebar in `apps/docs/.vitepress/config/zh.ts` and `en.ts` if adding a new category
8. Run `pnpm test` and `pnpm build` to verify

### Version Management

This project uses **Changesets** for version management:

1. After making changes, run `pnpm changeset` to create a changeset
2. Commit the changeset file along with your changes
3. Push to `master` branch (or create PR and merge)
4. GitHub Actions will automatically:
   - Create a "Version Packages" PR
   - When PR is merged, publish to npm and create GitHub Release

**Manual workflow (if needed):**

1. Run `pnpm changeset version` to bump versions
2. Commit and push the version changes
3. Run `pnpm build && pnpm publish` to publish manually

**Configuration:**

- Changesets config excludes `@DLib/build`, `@DLib/playground`, `@DLib/docs` from versioning
- See [AUTO_RELEASE.md](docs/AUTO_RELEASE.md) for detailed automated release guide

### Git Hooks

- **pre-commit**: Runs `lint-staged` (see `.lintstagedrc.mjs`)
  - Auto-formats and lints staged files
  - Fixes ESLint/Stylelint issues automatically

- **commit-msg**: Validates commit messages with Commitlint
  - Follows conventional commits format
  - Config in `packages/lint-configs/commitlint-config/`

### Important Notes

- **Package manager**: This project enforces **pnpm** via preinstall hook
- **Node version**: Requires Node.js >= 18
- **Pnpm version**: Requires pnpm >= 9.5
- **Catalog versions**: Dependencies use pnpm catalog for centralized version management (see `pnpm-workspace.yaml`)
- **Postinstall**: Automatically runs `turbo run build` after `pnpm install` to ensure all packages are built

### Working with Dependencies

When adding dependencies to a specific package:

```bash
# Install to specific workspace
pnpm -F dlib-ui add some-package

# Install dev dependency
pnpm -F dlib-ui add -D some-package

# Install to all packages
pnpm add -w some-package
```

### Turbo Task Dependencies

Turbo automatically handles build order based on the dependency graph defined in `turbo.json`:

- `build` tasks depend on dependent packages' builds (`dependsOn: ["^build"]`)
- `dev` tasks run persistently without caching
- Build outputs are cached in `.turbo/` directory

## Documentation Site

The VitePress docs site (`apps/docs/`) features:

- **Internationalization**: Root locale (中文) and `/en` for English
- **Interactive demos**: Uses `vitepress-demo-plugin` to embed live component examples
- **Auto-import**: Components auto-imported via `unplugin-vue-components` with custom resolver

### Documentation Structure

```
apps/docs/
├── zh/                          # Chinese documentation (root locale)
│   ├── packages/
│   │   ├── ui/                  # UI component docs
│   │   ├── hooks/               # Hooks docs
│   │   ├── directives/          # Directives docs
│   │   └── utils/               # Utilities docs
│   │       ├── string/
│   │       ├── array/
│   │       ├── function/        # Function utilities (curry, etc.)
│   │       └── ...
│   ├── guide/
│   └── index.md
├── en/                          # English documentation
│   └── (same structure as zh/)
└── .vitepress/
    ├── config/
    │   ├── zh.ts               # Chinese sidebar config
    │   ├── en.ts               # English sidebar config
    │   └── shared.ts
    └── config.mts
```

### Adding Documentation

For UI components:

1. Create markdown file in `apps/docs/zh/packages/ui/YourComponent/index.md`
2. Create English version in `apps/docs/en/packages/ui/YourComponent/index.md`
3. Update sidebar configuration in `apps/docs/.vitepress/config/zh.ts` and `en.ts`

For utilities:

1. Create markdown file in `apps/docs/zh/packages/utils/[category]/index.md`
2. Create English version in `apps/docs/en/packages/utils/[category]/index.md`
3. Update sidebar in both config files if adding a new category
4. Include usage examples, API documentation, and TypeScript types

## Troubleshooting

### Shell Command Issues

If you encounter issues executing `rm -rf` or other shell commands on Windows:

- Use Git Bash terminal (comes with Git installation)
- This applies to commands like `pnpm clean`, `pnpm rename-pkg:mac`, etc.

### Build Issues

**Issue**: `pnpm run dev` fails on first run

**Solution**: Run `pnpm run build` first, then `pnpm run dev`

- The postinstall hook should handle this automatically, but if it fails, manually build first
- This ensures all packages are built before starting dev mode

### Package Installation

- Always use `pnpm` - the preinstall hook enforces this
- If you need to add a dependency to a specific package, use `pnpm -F <package-name> add <dependency>`
- For workspace-wide dependencies, use `pnpm add -w <dependency>`

### TypeScript Type Issues in Tests

When testing utilities with rest parameters or custom arity, TypeScript may not infer types correctly:

```typescript
// For rest parameter functions
const fn = (...args: number[]) => args.reduce((sum, n) => sum + n, 0);
const curriedFn = curry(fn, 3) as any; // Use 'as any' for proper type handling
```

## Quick Reference

### Common File Paths

- UI Components: `packages/ui/src/components/`
- Utilities: `packages/utils/src/[category]/`
- Hooks: `packages/hooks/src/`
- Directives: `packages/directives/src/`
- Documentation: `apps/docs/{zh,en}/packages/`
- Playground: `playground/src/`

### Important Configuration Files

- Turbo config: `turbo.json`
- Workspace config: `pnpm-workspace.yaml`
- Changesets config: `.changeset/config.json`
- VitePress config: `apps/docs/.vitepress/config.mts`
- Lint-staged: `.lintstagedrc.mjs`

### Package Naming Convention

- Scope: `@DLib/` or your custom scope (use `pnpm rename-pkg:mac` to change)
- UI Components: Use `Common*` prefix (CommonButton, CommonTable)
- Packages: `dlib-ui`, `dlib-utils`, `dlib-hooks`, `dlib-directives`
