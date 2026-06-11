import { redirect, fail } from '@sveltejs/kit';
import {
	createCategory,
	getCategories,
	getCategoryById,
	getCategoryBySlug,
	createItem,
	getItemsByCategory,
	getItemById,
	addRating,
	getRatingsForItem,
	getUserRatingForItem
} from '$lib/server/ratings.js';

export const load = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const categorySlug = url.searchParams.get('category');
	const itemId = url.searchParams.get('item');

	let categories = await getCategories();
	let currentCategory = null;
	let items = [];
	let currentItem = null;
	let itemRatings = [];
	let userRating = null;

	if (categorySlug) {
		currentCategory = await getCategoryBySlug(categorySlug);
		if (currentCategory) {
			items = await getItemsByCategory(currentCategory.id);
		}
	}

	if (itemId) {
		currentItem = await getItemById(parseInt(itemId));
		if (currentItem) {
			itemRatings = await getRatingsForItem(currentItem.id);
			userRating = await getUserRatingForItem(currentItem.id, locals.user.id);
		}
	}

	return {
		user: locals.user,
		categories,
		currentCategory,
		items,
		currentItem,
		itemRatings,
		userRating
	};
};

export const actions = {
	createCategory: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const description = formData.get('description')?.toString().trim() || '';

		if (!name) {
			return fail(400, { message: 'Name is required' });
		}

		try {
			const category = await createCategory(name, description, locals.user.id);
			return { success: true, category };
		} catch (error) {
			console.error('Create category error:', error);
			return fail(500, { message: 'Failed to create category' });
		}
	},

	createItem: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const categoryId = parseInt(formData.get('categoryId'));
		const name = formData.get('name')?.toString().trim();
		const description = formData.get('description')?.toString().trim() || '';
		const imageUrl = formData.get('imageUrl')?.toString().trim() || '';
		const extraFields = formData.get('extraFields')?.toString().trim() || '';

		if (!categoryId || !name) {
			return fail(400, { message: 'Category and name are required' });
		}

		let extraData = null;
		if (extraFields) {
			try {
				extraData = JSON.parse(extraFields);
			} catch {
				extraData = { custom: extraFields };
			}
		}

		try {
			const item = await createItem(categoryId, name, description, imageUrl, extraData, locals.user.id);
			return { success: true, item };
		} catch (error) {
			console.error('Create item error:', error);
			return fail(500, { message: 'Failed to create item' });
		}
	},

	rate: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const itemId = parseInt(formData.get('itemId'));
		const scoresStr = formData.get('scores');
		const comment = formData.get('comment')?.toString().trim() || '';

		let scores;
		try {
			scores = scoresStr ? JSON.parse(scoresStr) : { overall: 5 };
		} catch {
			scores = { overall: 5 };
		}

		// Validate scores
		const scoreValues = Object.values(scores);
		if (!itemId || scoreValues.length === 0 || scoreValues.some(s => isNaN(s) || s < 0 || s > 10)) {
			return fail(400, { message: 'Invalid rating' });
		}

		try {
			await addRating(itemId, locals.user.id, scores, comment);
			return { success: true };
		} catch (error) {
			console.error('Rating error:', error);
			return fail(500, { message: 'Failed to add rating' });
		}
	}
};