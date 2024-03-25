import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';
import { db } from '$lib/server/db';
import { userTable } from '../../schema';
import { lucia } from '$lib/server/auth';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const signupSchema = z.object({
	username: z
		.string()
		.min(3)
		.max(32)
		.trim()
		.refine((val) => /^[a-z0-9_-]+$/.test(val)),
	password: z.string().min(6).max(256)
});

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}

	const form = await superValidate(zod(signupSchema));
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(signupSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const hashedPassword = await new Argon2id().hash(form.data.password);
		const userId = generateId(15);

		try {
			await db.insert(userTable).values({
				id: userId,
				username: form.data.username,
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

			return message(form, 'Error occured', { status: 500 });
		}

		return redirect(302, '/');
	}
};
