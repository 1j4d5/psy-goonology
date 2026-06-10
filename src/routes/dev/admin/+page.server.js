import { createUser } from '$lib/server/auth.js';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const role = formData.get('role');

		if (!username || !password || !role) {
			return fail(400, { error: 'All fields required' });
		}

		if (!['admin', 'mod', 'member'].includes(role)) {
			return fail(400, { error: 'Invalid role' });
		}

		try {
			const user = await createUser(username, password, role);
			return { success: true, user: { username: user.username, role: user.role } };
		} catch (err) {
			if (err.code === '23505') {
				return fail(400, { error: 'Username already exists' });
			}
			return fail(500, { error: 'Failed to create user' });
		}
	}
};