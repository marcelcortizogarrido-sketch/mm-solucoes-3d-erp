"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { parseDecimal } from "@/lib/format";
import { getMovementDirection, type StockMovementType } from "@/lib/stock";

export type FormState = {
  error?: string;
};

export async function createLocation(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "principal").trim() || "principal";

  if (!name) {
    return { error: "Informe o nome do local." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("stock_locations").insert({ name, type });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/estoque");
  return {};
}

export async function updateLocation(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "principal").trim() || "principal";

  if (!id || !name) {
    return { error: "Informe o nome do local." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("stock_locations")
    .update({ name, type })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/estoque");
  return {};
}

export async function toggleLocationActive(id: string, active: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("stock_locations")
    .update({ active })
    .eq("id", id);

  revalidatePath("/estoque");
  return { error: error?.message };
}

export async function deleteLocation(id: string) {
  const supabase = await createClient();

  const { data: balances } = await supabase
    .from("stock_balances")
    .select("quantity")
    .eq("location_id", id)
    .gt("quantity", 0)
    .limit(1);

  if (balances && balances.length > 0) {
    return { error: "Não é possível excluir: este local ainda tem estoque." };
  }

  const { error } = await supabase.from("stock_locations").delete().eq("id", id);

  if (error) {
    return {
      error: error.code === "23503"
        ? "Não é possível excluir: existem movimentações registradas para este local."
        : error.message,
    };
  }

  revalidatePath("/estoque");
  return {};
}

export async function registerMovement(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const productId = String(formData.get("product_id") ?? "");
  const type = String(formData.get("type") ?? "") as StockMovementType;
  const quantity = parseDecimal(formData.get("quantity"));
  const originId = String(formData.get("origin_location_id") ?? "") || null;
  const destinationId = String(formData.get("destination_location_id") ?? "") || null;
  const reason = String(formData.get("reason") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!productId || !type) {
    return { error: "Selecione o produto e o tipo de movimentação." };
  }

  if (quantity <= 0) {
    return { error: "Informe uma quantidade maior que zero." };
  }

  const direction = getMovementDirection(type);

  if ((direction === "out" || direction === "transfer") && !originId) {
    return { error: "Selecione o local de origem." };
  }

  if ((direction === "in" || direction === "transfer") && !destinationId) {
    return { error: "Selecione o local de destino." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("register_stock_movement", {
    p_product_id: productId,
    p_type: type,
    p_quantity: quantity,
    p_origin_location_id: (direction === "in" ? null : originId) ?? undefined,
    p_destination_location_id: (direction === "out" ? null : destinationId) ?? undefined,
    p_reason: reason ?? undefined,
    p_notes: notes ?? undefined,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/estoque");
  return {};
}
