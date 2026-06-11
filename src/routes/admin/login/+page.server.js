import { redirect, fail } from '@sveltejs/kit';
import { verifyUser } from '$lib/server/auth.js';

export const load = ({ locals, cookies }) => {
	// If already logged in as admin, go to admin panel
	if (locals.user?.role === 'admin') {
		throw redirect(303, '/dev/admin');
	}
	return {};
};

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
			return fail(401, { error: 'Invalid credentials' });
		}

		if (user.role !== 'admin') {
			return fail(403, { error: 'Admin access only' });
		}

		// Set session cookie
		cookies.set('session', user.id.toString(), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		throw redirect(303, '/dev/admin');
	}
};