import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { ratings, items } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/ratings?itemId=X - Get ratings for an item
export async function GET({ url }: { url: URL }) {
	const itemId = url.searchParams.get('itemId');

	if (!itemId) {
		return json({ error: 'itemId required' }, { status: 400 });
	}

	const itemRatings = await db.select()
		.from(ratings)
		.where(eq(ratings.itemId, parseInt(itemId)));

	return json(itemRatings);
}

// POST /api/ratings - Submit or update a rating
export async function POST({ request }: { request: Request }) {
	const data = await request.json();

	// Check if rating already exists for this user/item/criterion
	const existing = await db.select()
		.from(ratings)
		.where(
			and(
				eq(ratings.userId, data.userId),
				eq(ratings.itemId, data.itemId),
				eq(ratings.criterionId, data.criterionId)
			)
		);

	if (existing.length > 0) {
		// Update existing rating
		const [updated] = await db.update(ratings)
			.set({ score: data.score })
			.where(eq(ratings.id, existing[0].id))
			.returning();

		return json(updated);
	} else {
		// Create new rating
		const [newRating] = await db.insert(ratings).values({
			userId: data.userId,
			itemId: data.itemId,
			criterionId: data.criterionId,
			score: data.score
		}).returning();

		return json(newRating, { status: 201 });
	}
}