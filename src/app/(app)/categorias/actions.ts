"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type CategoryFormState = {
  error?: string;
};

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return { error: "Informe o nome da categoria." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({ name });

  if (error) {
    return {
      error: error.code === "23505" ? "Já existe uma categoria com esse nome." : error.message,
    };
  }

  revalidatePath("/categorias");
  return {};
}

export async function updateCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!id || !name) {
    return { error: "Informe o nome da categoria." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id);

  if (error) {
    return {
      error: error.code === "23505" ? "Já existe uma categoria com esse nome." : error.message,
    };
  }

  revalidatePath("/categorias");
  return {};
}

export async function toggleCategoryActive(id: string, active: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ active })
    .eq("id", id);

  revalidatePath("/categorias");
  return { error: error?.message };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    return {
      error: `Não é possível excluir: existem ${count} produto(s) nessa categoria.`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  revalidatePath("/categorias");
  return { error: error?.message };
}
