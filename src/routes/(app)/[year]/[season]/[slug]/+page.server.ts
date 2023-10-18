import PocketBase from 'pocketbase';
import { PUBLIC_API_URL } from '$env/static/public';
import { POCKETBASE_PASSWORD, POCKETBASE_USERNAME } from '$env/static/private';

export const prerender = true

export const load = (async ({ params, url }) => {
    const { slug } = params
    const pb = new PocketBase(PUBLIC_API_URL);
    await pb.admins.authWithPassword(POCKETBASE_USERNAME, POCKETBASE_PASSWORD)

    const res = await pb.collection('Talk').getFirstListItem(`slug='${slug}'`, {
        expand: 'speakers',
        fields: 'id,meta_description,description,expand.speakers,youtube_ID,title,transcript'
    });

    const talk = {...res, ...res.expand}
    delete talk.expand

    console.log(`${url.origin}/api/satori/${talk.id}.png`)

    return {
        talk,
        meta: {
            title: 'Svelte Summit - ' + talk.title,
            description: talk.meta_description,
            image: `https://svelte-summit-git-multi-site-setup-sveltesociety.vercel.app/api/satori/${talk.id}.png`
        }
    };
})