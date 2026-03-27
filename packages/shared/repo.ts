export interface RepoInfo {
	/** Display string (e.g., "backnotprop/plannotator" or "my-project") */
	display: string;
	/** Current git branch (if in a git repo) */
	branch?: string;
}

/**
 * Parse org/repo from a git remote URL
 *
 * Handles:
 * - SSH: git@github.com:org/repo.git
 * - HTTPS: https://github.com/org/repo.git
 * - SSH with port: ssh://git@github.com:22/org/repo.git
 */
export function parseRemoteUrl(url: string): string | null {
	if (!url) return null;

	// SSH format: git@github.com:org/repo.git
	const sshMatch = url.match(/:([^/]+\/[^/]+?)(?:\.git)?$/);
	if (sshMatch) return sshMatch[1];

	// HTTPS format: https://github.com/org/repo.git
	const httpsMatch = url.match(/\/([^/]+\/[^/]+?)(?:\.git)?$/);
	if (httpsMatch) return httpsMatch[1];

	return null;
}

/**
 * Get directory name from path
 */
export function getDirName(path: string): string | null {
	if (!path) return null;
	const trimmed = path.trim().replace(/\/+$/, "");
	const parts = trimmed.split("/");
	return parts[parts.length - 1] || null;
}
