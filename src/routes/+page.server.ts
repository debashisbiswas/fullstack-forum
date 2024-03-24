import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';

export const load: PageServerLoad = ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	return { user: locals.user };
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

		return redirect(302, '/login');
	}
};
