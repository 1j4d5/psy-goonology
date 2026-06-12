import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { categories, criteria } from '$lib/server/db/schema';
import { eq, desc, asc } from 'drizzle-orm';

// GET /api/categories/[id] - Get a single category with its criteria
export async function GET({ params }: { params: { id: string } }) {
	const categoryId = parseInt(params.id);

	const [category] = await db.select()
		.from(categories)
		.where(eq(categories.id, categoryId));

	if (!category) {
		return json({ error: 'Category not found' }, { status: 404 });
	}

	const categoryCriteria = await db.select()
		.from(criteria)
		.where(eq(criteria.categoryId, categoryId))
		.orderBy(asc(criteria.sortOrder));

	return json({ ...category, criteria: categoryCriteria });
}

// PUT /api/categories/[id] - Update a category
export async function PUT({ params, request }: { params: { id: string }; request: Request }) {
	const categoryId = parseInt(params.id);
	const data = await request.json();

	const [updated] = await db.update(categories)
		.set({
			name: data.name,
			description: data.description,
			icon: data.icon,
			isActive: data.isActive
		})
		.where(eq(categories.id, categoryId))
		.returning();

	return json(updated);
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE({ params }: { params: { id: string } }) {
	const categoryId = parseInt(params.id);

	await db.delete(categories).where(eq(categories.id, categoryId));

	return json({ success: true });
}