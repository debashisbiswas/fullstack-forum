import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';

const addReplySchema = z.object({
	replycontent: z.string().min(1)
});

export const load: PageServerLoad = async ({ locals, params }) => {
	const postId = +params.postId;

	if (Number.isNaN(postId)) {
		error(400);
	}

	const [post, replies] = await Promise.all([
		db
			.selectFrom('post')
			.innerJoin('user', 'post.user_id', 'user.id')
			.select(['post.title', 'post.content', 'user.username'])
			.where('post.id', '=', postId)
			.executeTakeFirst(),
		db
			.selectFrom('reply')
			.innerJoin('user', 'reply.user_id', 'user.id')
			.select(['user.username', 'reply.content'])
			.where('reply.parent_post', '=', postId)
			.execute()
	]);

	if (!post) {
		error(404);
	}

	const form = await superValidate(zod(addReplySchema));

	return { user: locals.user, post, replies, form };
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		if (!locals.user) {
			error(401);
		}

		const postId = +params.postId;

		if (Number.isNaN(postId)) {
			error(500);
		}

		const form = await superValidate(request, zod(addReplySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await db
				.insertInto('reply')
				.values({
					user_id: locals.user.id,
					parent_post: postId,
					content: form.data.replycontent
				})
				.execute();
		} catch (e) {
			console.error(e);
			error(500);
		}

		return message(form, 'Added reply!');
	}
};
