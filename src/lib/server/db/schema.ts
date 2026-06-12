import { pgTable, serial, integer, text, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

// Categories table
export const categories = pgTable('categories', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	icon: text('icon'),
	isActive: boolean('is_active').notNull().default(true),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// Criteria table - each category has its own criteria
export const criteria = pgTable('criteria', {
	id: serial('id').primaryKey(),
	categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	description: text('description'),
	weight: integer('weight').notNull().default(1),
	minScore: integer('min_score').notNull().default(1),
	maxScore: integer('max_score').notNull().default(10),
	sortOrder: integer('sort_order').notNull().default(0)
});

// Items table - things being rated within a category
export const items = pgTable('items', {
	id: serial('id').primaryKey(),
	categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description'),
	imageUrl: text('image_url'),
	submittedBy: text('submitted_by'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// Ratings table - user ratings for items on specific criteria
export const ratings = pgTable('ratings', {
	id: serial('id').primaryKey(),
	userId: text('user_id').notNull(),
	itemId: integer('item_id').notNull().references(() => items.id, { onDelete: 'cascade' }),
	criterionId: integer('criterion_id').notNull().references(() => criteria.id, { onDelete: 'cascade' }),
	score: integer('score').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// Type exports for TypeScript
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Criterion = typeof criteria.$inferSelect;
export type NewCriterion = typeof criteria.$inferInsert;
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
export type Rating = typeof ratings.$inferSelect;
export type NewRating = typeof ratings.$inferInsert;