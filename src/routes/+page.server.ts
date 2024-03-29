import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const allPosts = await db
		.selectFrom('post')
		.innerJoin('user', 'post.user_id', 'user.id')
		.select(['post.id', 'post.title', 'user.username'])
		.orderBy('post.id', 'desc')
		.execute();

	return { allPosts };
};
