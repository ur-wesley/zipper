# @ur-wesley/zipper

A simple and fast file archiving tool with gitignore-style exclusion patterns.

## Installation

### Global Installation (Recommended)

```bash
# Using npm
npm install -g @ur-wesley/zipper

# Using bun
bun install -g @ur-wesley/zipper
```

### Local Installation

```bash
# Using npm
npm install @ur-wesley/zipper

# Using bun
bun install @ur-wesley/zipper
```

## Usage

### Basic Usage

```bash
# Zip current directory
zipper

# Zip specific directory
zipper ./src

# Zip any path
zipper /path/to/folder
```

### Configuration

Create a `zipconfig.json` file in the target directory to customize settings:

```json
{
 "output": "my-archive.zip",
 "source": "."
}
```

### Exclusion Patterns

Create a `.zipignore` file in the target directory to exclude files (uses gitignore syntax):

```
node_modules/
*.log
.env
.DS_Store
*.tmp
```

### Command Line Options

```bash
zipper --help    # Show help
zipper --version # Show version
```

## Features

- 🚀 Fast file archiving with maximum compression
- 🎯 Gitignore-style exclusion patterns via `.zipignore`
- ⚙️ Configurable via `zipconfig.json`
- 📦 Automatically excludes common files (`.git`, `node_modules`, output file)
- 🔧 CLI tool with simple interface
- 💨 Built with Bun for speed

## Default Exclusions

The tool automatically excludes:

- `.git` directories
- `node_modules` directories
- The output zip file itself

## Development

```bash
# Clone the repository
git clone https://github.com/ur-wesley/zipper.git
cd zipper

# Install dependencies
bun install

# Run in development
bun run index.ts

# Build for distribution
bun run build
```

This project was created using Bun v1.2.15.
