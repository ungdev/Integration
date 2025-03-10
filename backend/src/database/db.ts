import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { postgres_user, postgres_db, postgres_host, postgres_password, postgres_port } from '../utils/secret';

const client = new Client({
  connectionString: `postgresql://${postgres_user}:${postgres_password}@${postgres_host}:${postgres_port}/${postgres_db}`,
});


client.connect();

export const db = drizzle(client);