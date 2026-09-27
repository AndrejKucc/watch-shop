import { createClient } from "./supabase-server";

export async function getProducts() {
  const supabase = await createClient();

  const result = await supabase
    .from("public_products_v2")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("SUPABASE RESULT:", result);

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data ?? [];
}