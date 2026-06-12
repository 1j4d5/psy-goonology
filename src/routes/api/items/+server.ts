import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { items, categories, criteria, ratings } from '$lib/server/db/schema';
import { eq, desc, asc, sql } from 'drizzle-orm';

// GET /api/items?categorySlug=X - Get items for a category with stats
export async function GET({ url }: { url: URL }) {
	const categorySlug = url.searchParams.get('categorySlug');
	const categoryId = url.searchParams.get('categoryId');

	let category = null;
	let categoryIdNum: number;

	// Get category by slug or id
	if (categorySlug) {
		[category] = await db.select().from(categories).where(eq(categories.slug, categorySlug));
		if (!category) {
			return json({ error: 'Category not found' }, { status: 404 });
		}
		categoryIdNum = category.id;
	} else if (categoryId) {
		categoryIdNum = parseInt(categoryId);
		[category] = await db.select().from(categories).where(eq(categories.id, categoryIdNum));
	} else {
		return json({ error: 'categorySlug or categoryId required' }, { status: 400 });
	}

	// Get all items for this category with their stats
	const categoryItems = await db.select()
		.from(items)
		.where(eq(items.categoryId, categoryIdNum))
		.orderBy(desc(items.createdAt));

	// Get criteria for this category
	const categoryCriteria = await db.select()
		.from(criteria)
		.where(eq(criteria.categoryId, categoryIdNum))
		.orderBy(asc(criteria.sortOrder));

	// Calculate stats for each item
	const itemsWithStats = await Promise.all(categoryItems.map(async (item) => {
		// Get all ratings for this item
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
		const totalVotes = itemRatings.length;

		return {
			...item,
			overallAverage,
			totalVotes,
			criterionAverages
		};
	}));

	// Sort by overall average descending
	itemsWithStats.sort((a, b) => b.overallAverage - a.overallAverage);

	// Add ranking position
	itemsWithStats.forEach((item, index) => {
		item.rank = index + 1;
	});

	return json({
		category: category || { id: categoryIdNum },
		criteria: categoryCriteria,
		items: itemsWithStats
	});
}

// POST /api/items - Submit a new item
export async function POST({ request }: { request: Request }) {
	const data = await request.json();

	const [newItem] = await db.insert(items).values({
		categoryId: data.categoryId,
		title: data.title,
		description: data.description || null,
		imageUrl: data.imageUrl || null,
		submittedBy: data.submittedBy || null
	}).returning();

	return json(newItem, { status: 201 });
}