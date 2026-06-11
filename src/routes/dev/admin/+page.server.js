import { redirect, fail } from '@sveltejs/kit';
import { createUser } from '$lib/server/auth.js';
import { getCategories, updateCategoryFields, getSetting, setSetting } from '$lib/server/ratings.js';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	if (locals.user.role !== 'admin') {
		throw redirect(303, '/dashboard');
	}

	const categories = await getCategories();
	const maintenanceMode = await getSetting('maintenance_mode');

	return {
		user: locals.user,
		categories,
		maintenanceMode: maintenanceMode === 'true'
	};
};

export const actions = {
	createUser: async ({ request }) => {
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
	},

	updateFields: async ({ request }) => {
		const formData = await request.formData();
		const categoryId = parseInt(formData.get('categoryId'));
		const fieldsStr = formData.get('fields')?.toString().trim() || '[]';

		if (!categoryId) {
			return fail(400, { error: 'Category required' });
		}

		let fields;
		try {
			fields = JSON.parse(fieldsStr);
			if (!Array.isArray(fields)) throw new Error('Not an array');
		} catch {
			return fail(400, { error: 'Invalid JSON array format' });
		}

		try {
			await updateCategoryFields(categoryId, fields);
			return { success: true, message: 'Fields updated!' };
		} catch (err) {
			return fail(500, { error: 'Failed to update fields' });
		}
	},

	toggleMaintenance: async ({ request }) => {
		const formData = await request.formData();
		const enabled = formData.get('enabled') === 'true';

		try {
			await setSetting('maintenance_mode', enabled.toString());
			return { success: true, message: enabled ? 'Maintenance mode ON' : 'Maintenance mode OFF' };
		} catch (err) {
			return fail(500, { error: 'Failed to update settings' });
		}
	}
};