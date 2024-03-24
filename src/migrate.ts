import { migrate } from 'drizzle-orm/libsql/migrator';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const sqliteDB = createClient({ url: 'file:data.db' });
const db = drizzle(sqliteDB);

await migrate(db, { migrationsFolder: 'drizzle' });

sqliteDB.close();
