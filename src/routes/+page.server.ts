import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { lucia } from '$lib/server/db';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	const allPosts = await db
		.selectFrom('post')
		.innerJoin('user', 'post.user_id', 'user.id')
		.select(['post.id', 'post.title', 'user.username'])
		.orderBy('post.id', 'desc')
		.execute();

	return { user: locals.user, allPosts };
};

export const actions: Actions = {
	default: async ({ cookies, locals }) => {
		if (!locals.session) {
			return fail(401);
		}

		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
};
