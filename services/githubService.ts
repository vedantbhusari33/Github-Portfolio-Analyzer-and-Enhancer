
import { GitHubUser, GitHubRepo } from '../types';

const BASE_URL = 'https://api.github.com';

export async function fetchGitHubData(username: string): Promise<{ user: GitHubUser; repos: GitHubRepo[] }> {
  // Fetch user profile
  const userRes = await fetch(`${BASE_URL}/users/${username}`);
  if (!userRes.ok) {
    if (userRes.status === 404) throw new Error('User not found');
    if (userRes.status === 403) throw new Error('GitHub API Rate Limit exceeded. Please try again later.');
    throw new Error('Failed to fetch profile');
  }
  const user: GitHubUser = await userRes.json();

  // Fetch repositories
  const reposRes = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&per_page=10`);
  if (!reposRes.ok) throw new Error('Failed to fetch repositories');
  let repos: GitHubRepo[] = await reposRes.json();

  // Fetch README for the top 4 repositories for better analysis
  const topRepos = repos.slice(0, 4);
  const reposWithReadme = await Promise.all(
    topRepos.map(async (repo) => {
      try {
        const readmeRes = await fetch(`${BASE_URL}/repos/${username}/${repo.name}/readme`, {
          headers: { Accept: 'application/vnd.github.v3.raw' }
        });
        const readme = readmeRes.ok ? await readmeRes.text() : '';
        return { ...repo, readme: readme.substring(0, 5000) }; // Cap to avoid huge prompts
      } catch (e) {
        return { ...repo, readme: '' };
      }
    })
  );

  // Combine back
  const finalRepos = [
    ...reposWithReadme,
    ...repos.slice(4)
  ];

  return { user, repos: finalRepos };
}

export function extractUsername(url: string): string {
  const trimmed = url.trim();
  if (!trimmed.includes('github.com')) return trimmed; // Assume it's already a username
  const parts = trimmed.split('github.com/');
  if (parts.length < 2) return '';
  const username = parts[1].split('/')[0];
  return username;
}
