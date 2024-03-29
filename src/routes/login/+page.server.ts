import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { Argon2id } from 'oslo/password';
import { lucia } from '$lib/server/db';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { redirect } from 'sveltekit-flash-message/server';

const loginSchema = z.object({
	username: z.string(),
	password: z.string()
});

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}

	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// TODO: use OWASP flow here for consistent timing?
		const existingUser = await db
			.selectFrom('user')
			.selectAll()
			.where('user.username', '=', form.data.username)
			.executeTakeFirst();
		if (!existingUser) {
			return message(form, 'Incorrect username or password', { status: 400 });
		}

		const validPassword = await new Argon2id().verify(existingUser.password, form.data.password);
		if (!validPassword) {
			return message(form, 'Incorrect username or password', { status: 400 });
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		return redirect(
			302,
			'/',
			{ type: 'success', message: `Welcome, ${existingUser.username}!` },
			event
		);
	}
};
