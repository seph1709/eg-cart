ALTER TABLE "products" RENAME COLUMN "date_added" TO "dateAdded";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "expiration_date" TO "costPrice";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "min_stock_level" TO "minStockLevel";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "max_stock_level" TO "maxStockLevel";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "cost_price";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "profit_margin";