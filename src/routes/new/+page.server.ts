import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { postTable } from '../../schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}
};

export const actions: Actions = {
	default: async (event) => {
		const session = event.locals.session;

		if (!session) {
			return;
		}

		const formData = await event.request.formData();
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;

		await db.insert(postTable).values({
			owner: session.userId,
			title,
			content
		});

		return redirect(303, '/');
	}
};
