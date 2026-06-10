import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

export const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

// Initialize database tables
export async function initDb() {
	const client = await pool.connect();
	try {
		await client.query(`
			CREATE TABLE IF NOT EXISTS users (
				id SERIAL PRIMARY KEY,
				username VARCHAR(255) UNIQUE NOT NULL,
				password_hash VARCHAR(255) NOT NULL,
				role VARCHAR(50) NOT NULL DEFAULT 'member',
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`);
		console.log('Database initialized');
	} finally {
		client.release();
	}
}