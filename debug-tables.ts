import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// Check all tables and their structures
const tables = ['categories', 'criteria', 'items', 'ratings'];

for (const table of tables) {
  console.log(`\n=== ${table} ===`);
  try {
    const result = await sql`SELECT * FROM ${sql(table)} LIMIT 1`;
    if (result.length > 0) {
      console.log('Columns:', Object.keys(result[0]));
    } else {
      // Get columns from info_schema
      const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = ${table} ORDER BY ordinal_position`;
      console.log('Columns:', cols.map(c => c.column_name));
    }
  } catch (e: any) {
    console.log('Error:', e.message);
  }
}

process.exit(0);