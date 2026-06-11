import { pgTable, serial, varchar, timestamp, text, integer, real } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	username: varchar('username', { length: 255 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	role: varchar('role', { length: 50 }).notNull().default('member'),
	displayName: varchar('display_name', { length: 255 }),
	bio: text('bio'),
	avatarUrl: varchar('avatar_url', { length: 500 }),
	website: varchar('website', { length: 255 }),
	location: varchar('location', { length: 255 }),
	createdAt: timestamp('created_at').defaultNow()
});

export const ratingCategories = pgTable('rating_categories', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description'),
	slug: varchar('slug', { length: 255 }).notNull().unique(),
	ratingFields: text('rating_fields'), // JSON array of field names
	createdBy: integer('created_by').references(() => users.id),
	createdAt: timestamp('created_at').defaultNow()
});

export const ratingItems = pgTable('rating_items', {
	id: serial('id').primaryKey(),
	categoryId: integer('category_id').references(() => ratingCategories.id).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description'),
	imageUrl: varchar('image_url', { length: 500 }),
	extraData: text('extra_data'), // JSON string for custom fields
	createdBy: integer('created_by').references(() => users.id),
	createdAt: timestamp('created_at').defaultNow()
});

export const ratings = pgTable('ratings', {
	id: serial('id').primaryKey(),
	itemId: integer('item_id').references(() => ratingItems.id).notNull(),
	userId: integer('user_id').references(() => users.id).notNull(),
	score: real('score').notNull(),
	comment: text('comment'),
	createdAt: timestamp('created_at').defaultNow()
});

export const settings = pgTable('settings', {
	key: varchar('key', { length: 100 }).primaryKey(),
	value: text('value')
});