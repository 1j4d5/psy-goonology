import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from './db.js';
import { users } from './schema.js';

export async function createUser(username, password, role = 'member') {
	const passwordHash = await bcrypt.hash(password, 10);
	const result = await db.insert(users).values({
		username,
		passwordHash,
		role
	}).returning({
		id: users.id,
		username: users.username,
		role: users.role,
		displayName: users.displayName,
		bio: users.bio,
		avatarUrl: users.avatarUrl,
		website: users.website,
		location: users.location
	});

	return result[0];
}

export async function verifyUser(username, password) {
	const result = await db.select().from(users).where(eq(users.username, username));

	if (result.length === 0) {
		return null;
	}

	const user = result[0];
	const valid = await bcrypt.compare(password, user.passwordHash);

	if (!valid) {
		return null;
	}

	return {
		id: user.id,
		username: user.username,
		role: user.role,
		displayName: user.displayName,
		bio: user.bio,
		avatarUrl: user.avatarUrl,
		website: user.website,
		location: user.location
	};
}

export async function getUserById(id) {
	const result = await db.select().from(users).where(eq(users.id, id));
	return result[0] || null;
}

export async function updateUserProfile(id, data) {
	const { displayName, bio, avatarUrl, website, location } = data;
	return await db.update(users)
		.set({
			displayName: displayName ?? null,
			bio: bio ?? null,
			avatarUrl: avatarUrl ?? null,
			website: website ?? null,
			location: location ?? null
		})
		.where(eq(users.id, id))
		.returning({
			id: users.id,
			username: users.username,
			role: users.role,
			displayName: users.displayName,
			bio: users.bio,
			avatarUrl: users.avatarUrl,
			website: users.website,
			location: users.location
		});
}