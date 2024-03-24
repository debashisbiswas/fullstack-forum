import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { userTable } from '../../schema';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { lucia } from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}

	return {};
};

export const actions: Actions = {
	default: async (event) => {
		// TODO: superform
		const formData = await event.request.formData();
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;

		// TODO: use OWASP flow here for consistent timing?
		const existingUser = await db.query.userTable.findFirst({
			where: eq(userTable.username, username)
		});
		if (!existingUser) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}

		const validPassword = await new Argon2id().verify(existingUser.password, password);
		if (!validPassword) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		return redirect(302, '/');
	}
};
