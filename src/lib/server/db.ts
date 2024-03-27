import { Lucia } from 'lucia';
import { dev } from '$app/environment';

import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite';
import SQLite from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import type { DB, user } from './dbgenerated/types';

const database = new SQLite('data.db');

const adapter = new BetterSqlite3Adapter(database, {
	user: 'user',
	session: 'session'
});

export const db = new Kysely<DB>({
	dialect: new SqliteDialect({
		database
	})
});

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
		DatabaseUserAttributes: user;
	}
}
