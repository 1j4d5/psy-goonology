import bcrypt from 'bcryptjs';
import { pool } from './db.js';

export async function createUser(username, password, role = 'member') {
	const passwordHash = await bcrypt.hash(password, 10);
	const result = await pool.query(
		'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
		[username, passwordHash, role]
	);
	return result.rows[0];
}

export async function verifyUser(username, password) {
	const result = await pool.query(
		'SELECT id, username, password_hash, role FROM users WHERE username = $1',
		[username]
	);

	if (result.rows.length === 0) {
		return null;
	}

	const user = result.rows[0];
	const valid = await bcrypt.compare(password, user.password_hash);

	if (!valid) {
		return null;
	}

	return { id: user.id, username: user.username, role: user.role };
}

export async function getUserById(id) {
	const result = await pool.query(
		'SELECT id, username, role FROM users WHERE id = $1',
		[id]
	);
	return result.rows[0] || null;
}