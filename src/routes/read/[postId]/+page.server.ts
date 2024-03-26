import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { postTable, userTable } from '../../../schema';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const postId = +params.postId;

	if (Number.isNaN(postId)) {
		error(400);
	}

	const queryResult = await db
		.select({
			title: postTable.title,
			author: userTable.username,
			content: postTable.content
		})
		.from(postTable)
		.where(eq(postTable.id, postId))
		.innerJoin(userTable, eq(postTable.owner, userTable.id))
		.limit(1);

	const post = queryResult[0];

	if (!post) {
		error(404);
	}

	return { post };
};
