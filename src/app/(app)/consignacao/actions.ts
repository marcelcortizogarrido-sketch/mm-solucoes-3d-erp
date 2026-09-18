"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseDecimal } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export type FormState = {
  error?: string;
};

export async function createPartner(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const cnpj = String(formData.get("cnpj") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;
  const contact = String(formData.get("contact") ?? "").trim() || null;

  if (!name) {
    return { error: "Informe o nome do parceiro." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_consignment_partner", {
    p_name: name,
    p_cnpj: cnpj ?? undefined,
    p_address: address ?? undefined,
    p_contact: contact ?? undefined,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/consignacao");
  return {};
}

export async function updatePartner(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const cnpj = String(formData.get("cnpj") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;
  const contact = String(formData.get("contact") ?? "").trim() || null;

  if (!id || !name) {
    return { error: "Informe o nome do parceiro." };
  }

  const supabase = await createClient();

  const { data: partner } = await supabase
    .from("consignment_partners")
    .select("location_id")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("consignment_partners")
    .update({ name, cnpj, address, contact })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  if (partner?.location_id) {
    await supabase
      .from("stock_locations")
      .update({ name })
      .eq("id", partner.location_id);
  }

  revalidatePath("/consignacao");
  return {};
}

export async function togglePartnerActive(id: string, active: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("consignment_partners")
    .update({ active })
    .eq("id", id);

  revalidatePath("/consignacao");
  return { error: error?.message };
}

export type ShipmentItemInput = {
  product_id: string;
  quantity: number;
};

export async function createShipment(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const partnerId = String(formData.get("partner_id") ?? "");
  const originLocationId = String(formData.get("origin_location_id") ?? "");
  const deliveryDate = String(formData.get("delivery_date") ?? "");
  const deliveryPhotoUrl = String(formData.get("delivery_photo_url") ?? "").trim() || null;
  const romaneioFileUrl = String(formData.get("romaneio_file_url") ?? "").trim() || null;
  const nfNumber = String(formData.get("nf_number") ?? "").trim() || null;
  const nfFileUrl = String(formData.get("nf_file_url") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const itemsRaw = String(formData.get("items") ?? "[]");

  if (!partnerId || !originLocationId || !deliveryDate) {
    return { error: "Selecione o parceiro, o local de origem e a data de entrega." };
  }

  let items: ShipmentItemInput[];
  try {
    items = JSON.parse(itemsRaw);
  } catch {
    return { error: "Itens do envio inválidos." };
  }

  items = items.filter((item) => item.product_id && item.quantity > 0);

  if (items.length === 0) {
    return { error: "Adicione ao menos um produto ao envio." };
  }

  const supabase = await createClient();
  const { data: shipmentId, error } = await supabase.rpc("create_consignment_shipment", {
    p_partner_id: partnerId,
    p_origin_location_id: originLocationId,
    p_delivery_date: deliveryDate,
    p_items: items,
    p_delivery_photo_url: deliveryPhotoUrl ?? undefined,
    p_romaneio_file_url: romaneioFileUrl ?? undefined,
    p_nf_number: nfNumber ?? undefined,
    p_nf_file_url: nfFileUrl ?? undefined,
    p_notes: notes ?? undefined,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/consignacao");
  redirect(`/consignacao/${shipmentId}`);
}

export async function updateShipmentBilling(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const id = String(formData.get("id") ?? "");
  const billingAmount = formData.get("billing_amount")
    ? parseDecimal(formData.get("billing_amount"))
    : null;
  const billingNfNumber = String(formData.get("billing_nf_number") ?? "").trim() || null;
  const billingNfFileUrl = String(formData.get("billing_nf_file_url") ?? "").trim() || null;

  if (!id) {
    return { error: "Envio não encontrado." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("consignment_shipments")
    .update({
      billing_amount: billingAmount,
      billing_nf_number: billingNfNumber,
      billing_nf_file_url: billingNfFileUrl,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/consignacao");
  revalidatePath(`/consignacao/${id}`);
  return {};
}
