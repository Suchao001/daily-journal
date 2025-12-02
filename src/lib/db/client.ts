import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { tinyWin } from './schema';
import { DATABASE_URL } from '$env/static/private';

const connectionString = DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const client = postgres(connectionString, {
  ssl: 'require',
  max: 1
});

export const db = drizzle(client, {
  schema: {
    tinyWin
  }
});
