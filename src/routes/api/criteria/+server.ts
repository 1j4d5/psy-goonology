import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { criteria } from '$lib/server/db/schema';
import { eq, desc, asc } from 'drizzle-orm';

// GET /api/criteria?categoryId=X - Get criteria for a category
export async function GET({ url }: { url: URL }) {
	const categoryId = url.searchParams.get('categoryId');

	if (!categoryId) {
		return json({ error: 'categoryId required' }, { status: 400 });
	}

	const categoryCriteria = await db.select()
		.from(criteria)
		.where(eq(criteria.categoryId, parseInt(categoryId)))
		.orderBy(asc(criteria.sortOrder));

	return json(categoryCriteria);
}

// POST /api/criteria - Create a new criterion
export async function POST({ request }: { request: Request }) {
	const data = await request.json();

	const [newCriterion] = await db.insert(criteria).values({
		categoryId: data.categoryId,
		name: data.name,
		description: data.description || null,
		weight: data.weight ?? 1,
		minScore: data.minScore ?? 1,
		maxScore: data.maxScore ?? 10,
		sortOrder: data.sortOrder ?? 0
	}).returning();

	return json(newCriterion, { status: 201 });
}