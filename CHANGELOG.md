# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-10

### Added

- Initial release of the zipper CLI tool
- Cross-platform file archiving with ZIP compression
- Support for `.zipignore` files with gitignore-style patterns
- Configuration via `zipconfig.json` for custom output names and source directories
- Default exclusions for common development files (.git, node_modules, etc.)
- Comprehensive CLI with `--help` and `--version` flags
- Modular TypeScript architecture with 5 focused modules
- Full test suite using Bun's testing framework
- Global npm installation support via `npm install -g @ur-wesley/zipper`

### Features

- **CLI Interface**: Simple command-line interface with intuitive arguments
- **Ignore Patterns**: Gitignore-style pattern matching for file exclusions
- **Configuration**: JSON-based configuration for custom workflows
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Fast**: Built with modern tools for optimal performance
- **TypeScript**: Fully typed codebase with comprehensive error handling

### Technical

- Node.js fs methods for cross-runtime compatibility
- ESM module format with bundled dependencies
- Comprehensive test coverage across multiple scenarios
- Automated CI/CD with GitHub Actions
- Modern development tooling with Biome for linting
