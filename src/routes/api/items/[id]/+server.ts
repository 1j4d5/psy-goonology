import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { items, categories, criteria, ratings } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

// GET /api/items/[id] - Get a single item with ratings
export async function GET({ params }: { params: { id: string } }) {
	const itemId = parseInt(params.id);

	const [item] = await db.select()
		.from(items)
		.where(eq(items.id, itemId));

	if (!item) {
		return json({ error: 'Item not found' }, { status: 404 });
	}

	const [category] = await db.select()
		.from(categories)
		.where(eq(categories.id, item.categoryId));

	const categoryCriteria = await db.select()
		.from(criteria)
		.where(eq(criteria.categoryId, item.categoryId))
		.orderBy(asc(criteria.sortOrder));

	// Get all ratings for this item
	const itemRatings = await db.select()
		.from(ratings)
		.where(eq(ratings.itemId, itemId));

	// Calculate criterion averages and user ratings
	const criterionStats: Record<number, { avg: number; count: number }> = {};
	const userRatings: Record<number, number> = {};

	for (const criterion of categoryCriteria) {
		const criterionRatings = itemRatings.filter(r => r.criterionId === criterion.id);
		if (criterionRatings.length > 0) {
			const avg = criterionRatings.reduce((sum, r) => sum + r.score, 0) / criterionRatings.length;
			criterionStats[criterion.id] = { avg: Math.round(avg * 100) / 100, count: criterionRatings.length };
		} else {
			criterionStats[criterion.id] = { avg: 0, count: 0 };
		}
	}

	// Calculate overall average
	let totalWeightedSum = 0;
	let totalWeight = 0;
	for (const criterion of categoryCriteria) {
		if (criterionStats[criterion.id]?.count > 0) {
			totalWeightedSum += criterionStats[criterion.id].avg * criterion.weight;
			totalWeight += criterion.weight;
		}
	}
	const overallAverage = totalWeight > 0 ? Math.round((totalWeightedSum / totalWeight) * 100) / 100 : 0;

	return json({
		item,
		category,
		criteria: categoryCriteria,
		ratings: itemRatings,
		criterionStats,
		overallAverage,
		totalVotes: itemRatings.length
	});
}

// PUT /api/items/[id] - Update an item
export async function PUT({ params, request }: { params: { id: string }; request: Request }) {
	const itemId = parseInt(params.id);
	const data = await request.json();

	const [updated] = await db.update(items)
		.set({
			title: data.title,
			description: data.description,
			imageUrl: data.imageUrl
		})
		.where(eq(items.id, itemId))
		.returning();

	return json(updated);
}

// DELETE /api/items/[id] - Delete an item
export async function DELETE({ params }: { params: { id: string } }) {
	const itemId = parseInt(params.id);

	await db.delete(items).where(eq(items.id, itemId));

	return json({ success: true });
}