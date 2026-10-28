import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { getPool } from './db.js';

async function migrate(): Promise<void> {
  const directory = dirname(__filename);
  const schema = await readFile(join(directory, '..', 'sql', '001_initial_schema.sql'), 'utf8');
  await getPool().query(schema);
  await getPool().end();
  console.log('Cloud SQL schema applied.');
}

void migrate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
