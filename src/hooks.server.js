import { getUserById } from '$lib/server/auth.js';
import { getSetting } from '$lib/server/ratings.js';

const publicPaths = ['/', '/login', '/admin/login', '/favicon.ico'];

export async function handle({ event, resolve }) {
	const path = event.url.pathname;

	// Check maintenance mode
	const maintenance = await getSetting('maintenance_mode');
	const isMaintenance = maintenance === 'true';

	// Always allow admin login and public paths
	const isPublicPath = publicPaths.some(p => path === p || path.startsWith(p + '/'));
	const isAdminPath = path.startsWith('/dev/admin') || path.startsWith('/admin/login');

	// Try to get user from session
	let user = null;
	const session = event.cookies.get('session');
	if (session) {
		const userId = parseInt(session, 10);
		if (!isNaN(userId)) {
			user = await getUserById(userId);
		}
	}

	// If maintenance mode and user is not admin, show 404
	if (isMaintenance && user?.role !== 'admin' && !isPublicPath && !isAdminPath) {
		return new Response(null, { status: 404 });
	}

	event.locals.user = user;
	return resolve(event);
}