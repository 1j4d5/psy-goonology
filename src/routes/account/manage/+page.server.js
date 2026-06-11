import { redirect, fail } from '@sveltejs/kit';
import { updateUserProfile } from '$lib/server/auth.js';

export const load = ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	return {
		user: locals.user
	};
};

export const actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const displayName = formData.get('displayName')?.toString().trim() || '';
		const bio = formData.get('bio')?.toString().trim() || '';
		const avatarUrl = formData.get('avatarUrl')?.toString().trim() || '';
		const website = formData.get('website')?.toString().trim() || '';
		const location = formData.get('location')?.toString().trim() || '';

		try {
			const updated = await updateUserProfile(locals.user.id, {
				displayName,
				bio,
				avatarUrl,
				website,
				location
			});

			locals.user = updated[0];

			return { success: true };
		} catch (error) {
			console.error('Profile update error:', error);
			return fail(500, { message: 'Failed to update profile' });
		}
	}
};