import { Product } from "@/app/dashboard/types";

export const emptyProduct = {
  id: "",
  name: "",
  classification: "Convenience Good",
  quantity: 0,
  available: true,
  supplier: "",
  coordinates: { x: 0, y: 0 }, // Aisle 5, bottom shelf
  price: 0, // PHP
  description: "",
  dateAdded: "",
  discount: 0,
  image: "",
  expirationDate: "", // Rice: ~2 years shelf life
  weight: "",
  brand: "",
  category: "",
  barcode: "",
  unit: "",
  minStockLevel: 0,
  maxStockLevel: 0,
} as unknown as Product;

// Options
export const classificationOptions = [
  "Convenience Good",
  "Shopping Good",
  "Specialty Good",
];

export const categoryOptions = [
  "Fruits & Vegetables",
  "Dairy and Eggs",
  "Meat & Fish",
  "Bakery",
  "Beverages",
];

export const unitOptions = [
  "bag",
  "pack",
  "bottle",
  "jar",
  "kg",
  "can",
  "pouch",
  "bar",
  "tube",
  "box",
  "loaf",
  "tray",
  "dozen",
  "pieces",
  "ml",
  "L",
  "g",
];
