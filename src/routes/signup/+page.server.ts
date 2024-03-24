import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { Argon2id } from 'oslo/password';
import { Lucia, generateId } from 'lucia';
import { db } from '$lib/server/db';
import { userTable } from '../../schema';
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
		const username = formData.get('username');
		const password = formData.get('password');

		if (
			typeof username !== 'string' ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			return fail(400, {
				message: 'Invalid username'
			});
		}

		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		const hashedPassword = await new Argon2id().hash(password);
		const userId = generateId(15);

		try {
			await db.insert(userTable).values({
				id: userId,
				username,
				password: hashedPassword
			});

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (e) {
			// TODO: is there actually a good way to handle the conflict here?
			console.error(e);

			return fail(500, {
				message: 'Error occured'
			});
		}

		return redirect(302, '/');
	}
};
