import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { criteria } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/criteria/[id] - Get a single criterion
export async function GET({ params }: { params: { id: string } }) {
	const criterionId = parseInt(params.id);

	const [criterion] = await db.select()
		.from(criteria)
		.where(eq(criteria.id, criterionId));

	if (!criterion) {
		return json({ error: 'Criterion not found' }, { status: 404 });
	}

	return json(criterion);
}

// PUT /api/criteria/[id] - Update a criterion
export async function PUT({ params, request }: { params: { id: string }; request: Request }) {
	const criterionId = parseInt(params.id);
	const data = await request.json();

	const [updated] = await db.update(criteria)
		.set({
			name: data.name,
			description: data.description,
			weight: data.weight,
			minScore: data.minScore,
			maxScore: data.maxScore,
			sortOrder: data.sortOrder
		})
		.where(eq(criteria.id, criterionId))
		.returning();

	return json(updated);
}

// DELETE /api/criteria/[id] - Delete a criterion
export async function DELETE({ params }: { params: { id: string } }) {
	const criterionId = parseInt(params.id);

	await db.delete(criteria).where(eq(criteria.id, criterionId));

	return json({ success: true });
}