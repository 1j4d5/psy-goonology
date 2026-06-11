-- Migration: Add profile fields to users
ALTER TABLE "users" ADD COLUMN "display_name" varchar(255);
ALTER TABLE "users" ADD COLUMN "bio" text;
ALTER TABLE "users" ADD COLUMN "avatar_url" varchar(500);
ALTER TABLE "users" ADD COLUMN "website" varchar(255);
ALTER TABLE "users" ADD COLUMN "location" varchar(255);