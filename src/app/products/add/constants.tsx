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
} as Product;

// Options
export const classificationOptions = [
  "Convenience Good",
  "Shopping Good",
  "Specialty Good",
];

export const categoryOptions = [
  "Grains & Rice",
  "Instant Noodles",
  "Condiments & Sauces",
  "Beverages",
  "Fresh Fruits",
  "Frozen Meat",
  "Canned Goods",
  "Snacks",
  "Household Essentials",
  "Cooking Ingredients",
  "Personal Care",
  "Baby Care",
  "Bakery",
  "Dairy & Eggs",
  "Fresh Meat",
  "Fresh Vegetables",
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
