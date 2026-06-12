import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { categories, criteria, items, ratings } from '$lib/server/db/schema';
import { eq, desc, sql, asc } from 'drizzle-orm';

// GET /api/categories - List all active categories
export async function GET() {
	const allCategories = await db.select()
		.from(categories)
		.where(eq(categories.isActive, true))
		.orderBy(asc(categories.name));

	return json(allCategories);
}

// POST /api/categories - Create a new category
export async function POST({ request }: { request: Request }) {
	const data = await request.json();

	const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

	const [newCategory] = await db.insert(categories).values({
		name: data.name,
		slug,
		description: data.description || null,
		icon: data.icon || null,
		isActive: data.isActive ?? true
	}).returning();

	return json(newCategory, { status: 201 });
}