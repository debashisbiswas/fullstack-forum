import { Lucia } from 'lucia';
import { dev } from '$app/environment';

import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from './db';
import { sessionTable, userTable } from '../../schema';

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		// TODO: tie this to the schema
		DatabaseUserAttributes: {
			username: string;
		};
	}
}
