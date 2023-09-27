import { PUBLIC_API_URL } from '$env/static/public';

export const load = (async ({ fetch, params }) => {
    const res = await fetch(`${PUBLIC_API_URL}/collections/talks/records?filter=(slug='${params.slug}')&expand=speakers`)
    const { items } = await res.json()
    const {description, expand, yt_id, title, meta_description, transcript} = items[0]
    const talk = {
        description,
        speakers: expand.speakers,
        yt_id,
        title,
        transcript
    }

    const meta = {
        title: 'Svelte Summit Fall 2023 - ' + title,
        description: meta_description
    }

    return {
        talk, meta
    };
})