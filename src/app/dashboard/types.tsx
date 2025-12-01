"use client";
import { Dispatch, SetStateAction } from "react";

export type SortKey = "name" | "price" | "dateAdded" | "expirationDate";
export type SortOrder = "asc" | "desc";
export type SearchKey = "name" | "id";

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
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  categories: string[];
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
  classification: string;
  quantity: number;
  available: boolean;
  supplier: string;
  coordinates: Coordinates;
  price: number;
  description: string;
  dateAdded: string;
  discount: number;
  image: string;
  expirationDate: string;
  weight: string;
  brand: string;
  category: ProductClassification;
  barcode: string;
  minStockLevel: number;
  maxStockLevel: number;
  currentStockLevel: number;
  rackLevel: number;
}
