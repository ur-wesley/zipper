import { version } from "../package.json";

export interface CliArgs {
  targetPath: string;
  showHelp: boolean;
  showVersion: boolean;
}

export function parseArgs(): CliArgs {
  const args = process.argv.slice(2);

  return {
    targetPath: args[0] || ".",
    showHelp: args.includes("--help") || args.includes("-h"),
    showVersion: args.includes("--version") || args.includes("-v"),
  };
}

export function showHelp(): void {
  console.log(`
Usage: zipper [path] [options]

Arguments:
  path          Directory to zip (default: current directory)

Options:
  --help, -h    Show this help message
  --version, -v Show version

Examples:
  zipper                    # Zip current directory
  zipper ./src              # Zip src directory
  zipper /path/to/folder    # Zip specific folder

Configuration:
  Create a zipconfig.json file to customize settings:
  {
    "output": "custom-name.zip",
    "source": "."
  }

  Create a .zipignore file to exclude files (gitignore syntax):
  node_modules/
  *.log
  .env
`);
}

export function showVersion(): void {
  console.log(version);
}
