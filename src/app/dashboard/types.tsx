"use client";
import { Dispatch, SetStateAction } from "react";

export type SortKey = "name" | "price" | "dateAdded";
export type SortOrder = "asc" | "desc";
export type SearchKey = "name" | "price";

export interface TableToolBarProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  searchKey: SearchKey;
  setSearchKey: Dispatch<SetStateAction<SearchKey>>;
  sortKey: SortKey;
  setSortKey: Dispatch<SetStateAction<SortKey>>;
  sortOrder: SortOrder;
  setSortOrder: Dispatch<SetStateAction<SortOrder>>;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
}

/**
 * Defines the strategic classification of a product,
 * typically based on consumer buying behavior and marketing considerations.
 */
type ProductClassification =
  | "Convenience Good"
  | "Shopping Good"
  | "Specialty Good"
  | "Unsought Good";

/**
 * Represents geographical coordinates, useful for locating items in a store.
 */
interface Coordinates {
  x: number; // e.g., aisle number, section
  y: number; // e.g., shelf height, specific bay
}

/**
 * Represents a product, combining its classification and other inventory-related information.
 */
export interface Product {
  id: string;
  name: string;
  classification: ProductClassification;
  quantity: number; // Current stock quantity
  available: boolean; // Is the product currently available for purchase?
  supplier: string; // The supplier of the product
  coordinates: Coordinates; // Location of the product in the store (e.g., aisle/shelf)
  price: number;
  weight: string; // Optional weight or size information
  brand: string; // Brand of the product
  category: string; // Category or department (e.g., Beverages, Snacks)
  barcode: string; // Unique product identifier
  unit: string; // Unit of measurement (e.g., piece, kg, pack)
  minStockLevel: number; // Minimum stock level before reordering
  maxStockLevel: number; // Maximum stock level for inventory control
  description?: string; // Optional description
  dateAdded: string; // Date when product was added to inventory (ISO format)
  discount: number; // Discount percentage (0-100)
  image: string; // URL or path to product image
  expirationDate: string | null; // Expiration date (ISO format), null for non-perishable items
}
