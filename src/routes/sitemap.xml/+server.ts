import * as sitemap from 'super-sitemap';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  return await sitemap.response({
    origin: 'https://sveltesummit.com',
    excludePatterns: [
        '.*\\[slug\\].*',
        '.*\\[year\\].*',
        '.*\\[season\\].*',
        '/admin.*',
        '/email-confirmed'
    ]
  });
};