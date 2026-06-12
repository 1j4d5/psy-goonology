import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { categories, criteria, items, ratings } from '$lib/server/db/schema';
import { eq, desc, asc, sql, and } from 'drizzle-orm';

// GET /api/categories/slug/[slug] - Get a category by slug
export async function GET({ params }: { params: { slug: string } }) {
	const [category] = await db.select()
		.from(categories)
		.where(eq(categories.slug, params.slug));

	if (!category) {
		return json({ error: 'Category not found' }, { status: 404 });
	}

	const categoryCriteria = await db.select()
		.from(criteria)
		.where(eq(criteria.categoryId, category.id))
		.orderBy(asc(criteria.sortOrder));

	return json({ ...category, criteria: categoryCriteria });
}