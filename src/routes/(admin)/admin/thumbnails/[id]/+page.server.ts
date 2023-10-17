import PocketBase from 'pocketbase';
import { PUBLIC_API_URL } from '$env/static/public';
import { POCKETBASE_PASSWORD, POCKETBASE_USERNAME } from '$env/static/private';
import type { TalkRecord } from '$lib/pocketbase-types.js';

export const load = async ({ fetch, params }) => {
    const pb = new PocketBase(PUBLIC_API_URL);
    await pb.admins.authWithPassword(POCKETBASE_USERNAME, POCKETBASE_PASSWORD)
    const conf = await pb.collection('Conference').getOne(params.id, {
        expand: 'talks,talks.speakers',
        fields: 'title,expand.talks,expand.talks.speakers,primary_color,secondary_color,text_color'
    });

    const { talks } = conf?.expand

    let mappedTalks = talks.map((talk: TalkRecord) => {
        const speakers = talk.expand.speakers.map((speaker) => {
            let url = pb.getFileUrl(speaker, speaker.picture)
            return {
                name: speaker.name,
                picture: `//wsrv.nl/?url=${url}&h=200&w=200&output=png`
            }
        })
        return {
            title: talk.title,
            speakers
        }
    })
    
    const meta = {
        title: 'Admin Page - Thumbnail Generator',
        description: 'Svelte Summit Fall 2023 Admin Page'
    }
    
    return {
        talks: mappedTalks,
        meta,
        primary_color: conf.primary_color,
        secondary_color: conf.secondary_color
    }
};