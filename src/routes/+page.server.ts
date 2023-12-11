import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Octokit } from 'octokit';
import { OCTOKIT_AUTH, REPO, REPO_OWNER } from '$env/static/private';
export const load: PageServerLoad = async () => {
	const octokit = new Octokit({
		auth: OCTOKIT_AUTH
	});

	const indexText = atob(
		(
			await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
				owner: REPO_OWNER,
				repo: REPO,
				path: 'index.txt',
				ref: 'gh-pages',
				headers: {
					'X-GitHub-Api-Version': '2022-11-28'
				}
			})
		).data.content
	);
	const resultsJsonText = atob(
		(
			await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
				owner: REPO_OWNER,
				repo: REPO,
				path: 'result.json',
				ref: 'gh-pages',
				headers: {
					'X-GitHub-Api-Version': '2022-11-28'
				}
			})
		).data.content
	);

	return {
		indexText,
		resultsJsonText
	};
};
export const config = {
	isr: {
		// Expiration time (in seconds) before the cached asset will be re-generated by invoking the Serverless Function.
		// Setting the value to `false` means it will never expire.
		expiration: 60
	}
};