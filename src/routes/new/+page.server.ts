import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';

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

		await db
			.insertInto('post')
			.values({
				user_id: session.userId,
				title,
				content
			})
			.execute();

		redirect(303, '/');
	}
};
