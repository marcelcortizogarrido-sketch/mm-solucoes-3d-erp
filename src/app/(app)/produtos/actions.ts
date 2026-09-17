"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { parseDecimal } from "@/lib/format";

export type ProductFormState = {
  error?: string;
};

function readProductFields(formData: FormData) {
  const categoryId = String(formData.get("category_id") ?? "");

  return {
    sku: String(formData.get("sku") ?? "").trim(),
    internal_code: String(formData.get("internal_code") ?? "").trim() || null,
    barcode: String(formData.get("barcode") ?? "").trim() || null,
    name: String(formData.get("name") ?? "").trim(),
    category_id: categoryId || null,
    description: String(formData.get("description") ?? "").trim() || null,
    photo_url: String(formData.get("photo_url") ?? "").trim() || null,
    cost: parseDecimal(formData.get("cost")),
    sale_price: parseDecimal(formData.get("sale_price")),
    min_stock: parseDecimal(formData.get("min_stock")),
    unit: String(formData.get("unit") ?? "un").trim() || "un",
    status: String(formData.get("status") ?? "ativo"),
  };
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const fields = readProductFields(formData);

  if (!fields.sku || !fields.name) {
    return { error: "Informe ao menos o SKU e o nome do produto." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert(fields)
    .select("id")
    .single();

  if (error) {
    return {
      error: error.code === "23505" ? "Já existe um produto com esse SKU." : error.message,
    };
  }

  revalidatePath("/produtos");
  redirect(`/produtos/${data.id}/editar`);
}

export async function updateProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const id = String(formData.get("id") ?? "");
  const fields = readProductFields(formData);

  if (!id || !fields.sku || !fields.name) {
    return { error: "Informe ao menos o SKU e o nome do produto." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update(fields)
    .eq("id", id);

  if (error) {
    return {
      error: error.code === "23505" ? "Já existe um produto com esse SKU." : error.message,
    };
  }

  revalidatePath("/produtos");
  revalidatePath(`/produtos/${id}/editar`);
  return {};
}

export async function setProductStatus(id: string, status: "ativo" | "inativo") {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ status })
    .eq("id", id);

  revalidatePath("/produtos");
  return { error: error?.message };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("stock_movements")
    .select("id", { count: "exact", head: true })
    .eq("product_id", id);

  if (count && count > 0) {
    return {
      error: "Não é possível excluir: existem movimentações de estoque para este produto. Desative-o em vez de excluir.",
    };
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  revalidatePath("/produtos");
  return { error: error?.message };
}
