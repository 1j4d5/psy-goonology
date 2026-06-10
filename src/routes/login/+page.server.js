import { verifyUser } from '$lib/server/auth.js';
import { redirect, fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!username || !password) {
			return fail(400, { error: 'Username and password required' });
		}

		const user = await verifyUser(username, password);

		if (!user) {
			return fail(401, { error: 'Invalid username or password' });
		}

		cookies.set('session', user.id.toString(), {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		throw redirect(303, '/dashboard');
	}
};