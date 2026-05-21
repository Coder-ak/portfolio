import type { APIRoute } from 'astro';
import { seo } from '../data/seo';

export const GET: APIRoute = () => {
	const lines = ['User-agent: *', 'Allow: /'];

	if (seo.siteUrl) {
		lines.push(`Sitemap: ${new URL('/sitemap-index.xml', seo.siteUrl).toString()}`);
	}

	return new Response(`${lines.join('\n')}\n`, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
};
