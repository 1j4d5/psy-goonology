import { getUserById } from '$lib/server/auth.js';

export async function handle({ event, resolve }) {
	const session = event.cookies.get('session');

	if (session) {
		const userId = parseInt(session, 10);
		if (!isNaN(userId)) {
			const user = await getUserById(userId);
			if (user) {
				event.locals.user = user;
			}
		}
	}

	return resolve(event);
}