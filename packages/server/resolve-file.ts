/**
 * Smart markdown file resolution.
 *
 * Resolves a user-provided path to an absolute file path using three strategies:
 * 1. Exact path (absolute or relative to cwd)
 * 2. Case-insensitive relative path search within project root
 * 3. Case-insensitive bare filename search within project root
 *
 * Used by both the CLI (`plannotator annotate`) and the `/api/doc` endpoint.
 */

import { resolve } from "path";

const IGNORED_DIRS = [
  "node_modules/",
  ".git/",
  "dist/",
  "build/",
  ".next/",
  "__pycache__/",
  ".obsidian/",
  ".trash/",
];

export type ResolveResult =
  | { kind: "found"; path: string }
  | { kind: "not_found"; input: string }
  | { kind: "ambiguous"; input: string; matches: string[] };

/**
 * Resolve a markdown file path within a project root.
 *
 * @param input - User-provided path (absolute, relative, or bare filename)
 * @param projectRoot - Project root directory to search within
 */
export async function resolveMarkdownFile(
  input: string,
  projectRoot: string,
): Promise<ResolveResult> {
  // Restrict to markdown files
  if (!/\.mdx?$/i.test(input)) {
    return { kind: "not_found", input };
  }

  // 1. Absolute path — use as-is (no project root restriction;
  //    the user explicitly typed the full path)
  if (input.startsWith("/")) {
    const normalized = resolve(input);
    if (await Bun.file(normalized).exists()) {
      return { kind: "found", path: normalized };
    }
    return { kind: "not_found", input };
  }

  // 2. Exact relative path from project root
  const fromRoot = resolve(projectRoot, input);
  if (
    fromRoot.startsWith(projectRoot + "/") &&
    (await Bun.file(fromRoot).exists())
  ) {
    return { kind: "found", path: fromRoot };
  }

  // 3. Case-insensitive search
  const inputLower = input.toLowerCase();
  const isBareFilename = !input.includes("/");

  const pattern = isBareFilename ? `**/${input}` : `${input}`;
  const glob = new Bun.Glob(pattern);
  const matches: string[] = [];

  for await (const match of glob.scan({ cwd: projectRoot, onlyFiles: true })) {
    if (IGNORED_DIRS.some((dir) => match.includes(dir))) continue;

    const matchLower = isBareFilename
      ? match.split("/").pop()!.toLowerCase()
      : match.toLowerCase();
    const targetLower = isBareFilename
      ? inputLower.split("/").pop()!
      : inputLower;

    if (matchLower === targetLower) {
      const full = resolve(projectRoot, match);
      if (full.startsWith(projectRoot + "/")) {
        matches.push(full);
      }
    }
  }

  if (matches.length === 1) {
    return { kind: "found", path: matches[0] };
  }
  if (matches.length > 1) {
    const relative = matches.map((m) => m.replace(projectRoot + "/", ""));
    return { kind: "ambiguous", input, matches: relative };
  }

  return { kind: "not_found", input };
}
