-- Migration: Add ratings system tables

CREATE TABLE "rating_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"slug" varchar(255) NOT NULL UNIQUE,
	"created_by" integer REFERENCES "users"("id"),
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "rating_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer REFERENCES "rating_categories"("id") NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"image_url" varchar(500),
	"extra_data" text,
	"created_by" integer REFERENCES "users"("id"),
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer REFERENCES "rating_items"("id") NOT NULL,
	"user_id" integer REFERENCES "users"("id") NOT NULL,
	"score" real NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);