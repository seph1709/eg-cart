import { Product } from "@/app/dashboard/types";
import { supabase } from "./supabase";

export async function getProducts() {
  const { data: products, error } = await supabase.from("products").select("*");
  if (error) {
    console.error("Error fetching products:", error);
  }
  return products ?? [];
}

export async function insertProducts(product: Product) {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select();

  return { data, error };
}

export async function updateProduct(productId: string, productData: Product) {
  const { data, error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", productId)
    .select();

  return { data, error };
}

export async function deleteProduct(productId: string) {
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .select();

  return { data, error };
}
