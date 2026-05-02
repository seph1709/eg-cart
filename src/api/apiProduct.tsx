import { Product } from "@/app/dashboard/types";
import { supabase } from "./supabase";
import { ScheduledTask } from "@/app/schedule-task/types";

export async function getProducts() {
  const { data: products, error } = await supabase.from("products").select("*");
  if (error) {
    console.error("Error fetching products:", error);
  }
  return products ?? [];
}

export async function getScheduledTasks() {
  const { data: tasks, error } = await supabase
    .from("scheduled_tasks")
    .select("*");

  if (error) {
    console.error("Error fetching scheduleTask:", error);
  }

  return tasks ?? [];
}

export async function getIndoorGeoJson() {
  const { data, error } = await supabase.from("geojson").select("*");

  if (error) {
    console.error("Error fetching scheduleTask:", error);
  }

  console.log(data);

  return data;
}

export async function updateIndoorGeoJson(id: string, content: string) {
  console.log(id);

  const { data, error } = await supabase
    .from("geojson")
    .update([{ content }])
    .eq("id", id)
    .select();

  return { data, error };
}

export async function insertScheduledTask(task: ScheduledTask) {
  const { data, error } = await supabase
    .from("scheduled_tasks")
    .insert([task])
    .select();

  return { data, error };
}

export async function deleteScheduledTask(taskId: string) {
  const { data, error } = await supabase
    .from("scheduled_tasks")
    .delete()
    .eq("id", taskId)
    .select();

  return { data, error };
}

export async function updateScheduledTask(
  taskId: string,
  taskData: ScheduledTask
) {
  const { data, error } = await supabase
    .from("scheduled_tasks")
    .update(taskData)
    .eq("id", taskId)
    .select();

  return { data, error };
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

export async function getPrivacyPolicy() {
  const { data, error } = await supabase
    .from("document_policy")
    .select("*")
    .eq("id", "01");
  if (error) {
    console.error("Error fetching products:", error);
  }

  console.log(data);
  if (data === null) return "";
  return data[0]["content"];
}
