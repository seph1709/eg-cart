CREATE TYPE "public"."product_category" AS ENUM('Fruits & Vegetables', 'Dairy and Eggs', 'Meat & Fish', 'Bakery', 'Beverages');--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category" SET DATA TYPE "public"."product_category" USING "category"::"public"."product_category";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "currentStockLevel" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "unit";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "costPrice";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "profitMargin";