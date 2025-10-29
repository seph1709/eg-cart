import {
  boolean,
  integer,
  jsonb,
  pgEnum, // 👈 Import pgEnum
  pgTable,
  text,
} from "drizzle-orm/pg-core";

// 1. Define the enum for the 'category' field
export const productCategoryEnum = pgEnum("product_category", [
  "Fruits & Vegetables",
  "Dairy and Eggs",
  "Meat & Fish",
  "Bakery",
  "Beverages",
]);

export const productsTable = pgTable("products", {
  // A unique identifier for the product, often a custom string.
  id: text("id").primaryKey(),

  // The name of the product.
  name: text("name").notNull(),

  // The product classification (e.g., "Convenience Good").
  // 💡 Assuming it's nullable based on the interface not explicitly showing it as required.
  classification: text("classification"),

  // The quantity of the product in stock.
  quantity: integer("quantity").notNull(),

  // A boolean indicating if the product is available.
  available: boolean("available").notNull().default(true),

  // The name of the supplier.
  supplier: text("supplier"),

  // JSON data for product coordinates on a shelf.
  coordinates: jsonb("coordinates"),

  // The selling price, stored as a numeric type for precision.
  price: integer("price").notNull(),

  // A description of the product.
  description: text("description"),

  // The date the product was added to the inventory.
  dateAdded: text("dateAdded").notNull(),

  // The discount percentage.
  discount: integer("discount").notNull(),

  // The URL for the product image.
  image: text("image"),

  // The expiration date of the product.
  expirationDate: text("expirationDate"),

  // The weight or volume of the product.
  weight: text("weight"),

  // The brand of the product.
  brand: text("brand"),

  // 2. Use the defined enum for the 'category'
  category: productCategoryEnum("category"),

  // The product's barcode.
  barcode: text("barcode").unique(),

  // 3. Removed 'unit' as it was not in the interface.

  // Minimum stock level for inventory alerts.
  minStockLevel: integer("minStockLevel"),

  // Maximum stock level for inventory management.
  maxStockLevel: integer("maxStockLevel"),

  // 4. ADDED: The current stock level (derived/calculated field based on interface).
  currentStockLevel: integer("currentStockLevel").notNull(),
});

// 5. Fixed the typo: 'InserProducts' -> 'InsertProducts'
export type InsertProducts = typeof productsTable.$inferInsert;
export type SelectProducts = typeof productsTable.$inferSelect;

// export const usersTable = pgTable("users_table", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull(),
//   age: integer("age").notNull(),
//   email: text("email").notNull().unique(),
// });

// export const postsTable = pgTable("posts_table", {
//   id: serial("id").primaryKey(),
//   title: text("title").notNull(),
//   content: text("content").notNull(),
//   userId: integer("user_id")
//     .notNull()
//     .references(() => usersTable.id, { onDelete: "cascade" }),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
//   updatedAt: timestamp("updated_at")
//     .notNull()
//     .$onUpdate(() => new Date()),
// });

// export type InsertUser = typeof usersTable.$inferInsert;
// export type SelectUser = typeof usersTable.$inferSelect;

// export type InsertPost = typeof postsTable.$inferInsert;
// export type SelectPost = typeof postsTable.$inferSelect;
