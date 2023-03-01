import { API_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = true

export const GET = (async ({ url, fetch }) => {
    const res = await fetch(`${API_URL}/collections/speakers/records`)
   
  console.log('IM RUNNING!!')

    return new Response(res.body);
  }) satisfies RequestHandler;