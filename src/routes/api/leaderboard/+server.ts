import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { categories, criteria, items, ratings } from '$lib/server/db/schema';
import { eq, desc, asc } from 'drizzle-orm';

// GET /api/leaderboard?categorySlug=X - Get leaderboard for a category
export async function GET({ url }: { url: URL }) {
	const categorySlug = url.searchParams.get('categorySlug');

	if (!categorySlug) {
		return json({ error: 'categorySlug required' }, { status: 400 });
	}

	// Get category
	const [category] = await db.select()
		.from(categories)
		.where(eq(categories.slug, categorySlug));

	if (!category) {
		return json({ error: 'Category not found' }, { status: 404 });
	}

	// Get criteria
	const categoryCriteria = await db.select()
		.from(criteria)
		.where(eq(criteria.categoryId, category.id))
		.orderBy(asc(criteria.sortOrder));

	// Get all items
	const categoryItems = await db.select()
		.from(items)
		.where(eq(items.categoryId, category.id))
		.orderBy(desc(items.createdAt));

	// Calculate stats and rankings for each item
	const leaderboard = await Promise.all(categoryItems.map(async (item) => {
		const itemRatings = await db.select()
			.from(ratings)
			.where(eq(ratings.itemId, item.id));

		// Calculate criterion averages
		const criterionAverages: Record<number, { avg: number; count: number }> = {};
		let totalWeightedSum = 0;
		let totalWeight = 0;

		for (const criterion of categoryCriteria) {
			const criterionRatings = itemRatings.filter(r => r.criterionId === criterion.id);
			if (criterionRatings.length > 0) {
				const avg = criterionRatings.reduce((sum, r) => sum + r.score, 0) / criterionRatings.length;
				criterionAverages[criterion.id] = { avg: Math.round(avg * 100) / 100, count: criterionRatings.length };
				totalWeightedSum += avg * criterion.weight;
				totalWeight += criterion.weight;
			} else {
				criterionAverages[criterion.id] = { avg: 0, count: 0 };
			}
		}

		const overallAverage = totalWeight > 0 ? Math.round((totalWeightedSum / totalWeight) * 100) / 100 : 0;

		return {
			...item,
			overallAverage,
			totalVotes: itemRatings.length,
			criterionAverages
		};
	}));

	// Sort by overall average descending
	leaderboard.sort((a, b) => b.overallAverage - a.overallAverage);

	// Add ranking position
	leaderboard.forEach((item, index) => {
		item.rank = index + 1;
	});

	return json({
		category,
		criteria: categoryCriteria,
		leaderboard
	});
}