import { eq, desc, sql, and } from 'drizzle-orm';
import { db } from './db.js';
import { ratingCategories, ratingItems, ratings, users, settings } from './schema.js';

function slugify(text) {
	return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Categories
export async function createCategory(name, description, userId, ratingFields = null) {
	const slug = slugify(name) + '-' + Date.now();
	const result = await db.insert(ratingCategories).values({
		name,
		description,
		slug,
		ratingFields: ratingFields ? JSON.stringify(ratingFields) : null,
		createdBy: userId
	}).returning();
	return result[0];
}

export async function getCategories() {
	const cats = await db.select({
		id: ratingCategories.id,
		name: ratingCategories.name,
		description: ratingCategories.description,
		slug: ratingCategories.slug,
		ratingFields: ratingCategories.ratingFields,
		createdBy: ratingCategories.createdBy,
		createdAt: ratingCategories.createdAt
	}).from(ratingCategories).orderBy(desc(ratingCategories.createdAt));

	// Parse ratingFields
	return cats.map(c => ({
		...c,
		ratingFields: c.ratingFields ? JSON.parse(c.ratingFields) : null
	}));
}

export async function getCategoryById(id) {
	const result = await db.select().from(ratingCategories).where(eq(ratingCategories.id, id));
	if (!result[0]) return null;
	const cat = result[0];
	return {
		...cat,
		ratingFields: cat.ratingFields ? JSON.parse(cat.ratingFields) : null
	};
}

export async function getCategoryBySlug(slug) {
	const result = await db.select().from(ratingCategories).where(eq(ratingCategories.slug, slug));
	if (!result[0]) return null;
	const cat = result[0];
	return {
		...cat,
		ratingFields: cat.ratingFields ? JSON.parse(cat.ratingFields) : null
	};
}

export async function updateCategoryFields(categoryId, ratingFields) {
	return await db.update(ratingCategories)
		.set({ ratingFields: JSON.stringify(ratingFields) })
		.where(eq(ratingCategories.id, categoryId))
		.returning();
}

// Items
export async function createItem(categoryId, name, description, imageUrl, extraData, userId) {
	const result = await db.insert(ratingItems).values({
		categoryId,
		name,
		description,
		imageUrl,
		extraData: extraData ? JSON.stringify(extraData) : null,
		createdBy: userId
	}).returning();
	return result[0];
}

export async function getItemsByCategory(categoryId) {
	const items = await db.select({
		id: ratingItems.id,
		categoryId: ratingItems.categoryId,
		name: ratingItems.name,
		description: ratingItems.description,
		imageUrl: ratingItems.imageUrl,
		extraData: ratingItems.extraData,
		createdBy: ratingItems.createdBy,
		createdAt: ratingItems.createdAt
	}).from(ratingItems).where(eq(ratingItems.categoryId, categoryId)).orderBy(desc(ratingItems.createdAt));

	// Get average ratings for each item
	for (const item of items) {
		const avgResult = await db.select({
			avg: sql`avg(${ratings.score})`,
			count: sql`count(*)`
		}).from(ratings).where(eq(ratings.itemId, item.id));
		item.avgScore = avgResult[0]?.avg ? parseFloat(avgResult[0].avg).toFixed(1) : null;
		item.ratingCount = avgResult[0]?.count || 0;
	}

	return items;
}

export async function getItemById(id) {
	const result = await db.select().from(ratingItems).where(eq(ratingItems.id, id));
	return result[0] || null;
}

// Ratings - store as JSON for multiple fields
export async function addRating(itemId, userId, scores, comment) {
	// scores is object like { overall: 8, gameplay: 9, graphics: 7 }
	const scoresJson = JSON.stringify(scores);

	// Check if user already rated this item
	const existing = await db.select().from(ratings)
		.where(and(eq(ratings.itemId, itemId), eq(ratings.userId, userId)));

	if (existing.length > 0) {
		const result = await db.update(ratings)
			.set({ score: scoresJson, comment })
			.where(and(eq(ratings.itemId, itemId), eq(ratings.userId, userId)))
			.returning();
		return result[0];
	}

	const result = await db.insert(ratings).values({
		itemId,
		userId,
		score: scoresJson,
		comment
	}).returning();
	return result[0];
}

export async function getRatingsForItem(itemId) {
	const result = await db.select({
		id: ratings.id,
		score: ratings.score,
		comment: ratings.comment,
		createdAt: ratings.createdAt,
		username: users.username,
		userId: users.id
	}).from(ratings)
		.innerJoin(users, eq(ratings.userId, users.id))
		.where(eq(ratings.itemId, itemId))
		.orderBy(desc(ratings.createdAt));

	// Parse scores JSON
	return result.map(r => ({
		...r,
		scores: typeof r.score === 'string' ? JSON.parse(r.score) : r.score
	}));
}

export async function getUserRatingForItem(itemId, userId) {
	const result = await db.select().from(ratings)
		.where(and(eq(ratings.itemId, itemId), eq(ratings.userId, userId)));
	if (!result[0]) return null;
	const r = result[0];
	return {
		...r,
		scores: typeof r.score === 'string' ? JSON.parse(r.score) : r.score
	};
}

// Settings
export async function getSetting(key) {
	const result = await db.select().from(settings).where(eq(settings.key, key));
	return result[0]?.value || null;
}

export async function setSetting(key, value) {
	return await db.insert(settings).values({ key, value })
		.onConflictDoUpdate({ target: settings.key, set: { value } })
		.returning();
}