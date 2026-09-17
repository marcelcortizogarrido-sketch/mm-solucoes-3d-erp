"use server";

import { revalidatePath } from "next/cache";

import { parseDecimal } from "@/lib/format";
import {
  calculateRecommendedPrice,
  calculateTotalCost,
  type PricingStrategy,
} from "@/lib/pricing";
import { createClient } from "@/lib/supabase/server";

export type SimulationResult = {
  totalCost: number;
  recommendedPrice: number;
  productId: string;
};

export type SimulationFormState = {
  error?: string;
  result?: SimulationResult;
};

export async function createSimulation(
  _prevState: SimulationFormState,
  formData: FormData
): Promise<SimulationFormState> {
  const productId = String(formData.get("product_id") ?? "");
  const strategy = String(formData.get("strategy") ?? "") as PricingStrategy;

  if (!productId) {
    return { error: "Selecione um produto." };
  }

  if (!["margin", "markup", "price"].includes(strategy)) {
    return { error: "Selecione uma estratégia de precificação." };
  }

  const materialCost = parseDecimal(formData.get("material_cost"));
  const packagingCost = parseDecimal(formData.get("packaging_cost"));
  const laborCost = parseDecimal(formData.get("labor_cost"));
  const energyCost = parseDecimal(formData.get("energy_cost"));
  const otherCosts = parseDecimal(formData.get("other_costs"));
  const strategyValue = parseDecimal(formData.get("strategy_value"));

  const totalCost = calculateTotalCost({
    materialCost,
    packagingCost,
    laborCost,
    energyCost,
    otherCosts,
  });
  const recommendedPrice = calculateRecommendedPrice(totalCost, strategy, strategyValue);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("price_simulations").insert({
    product_id: productId,
    material_cost: materialCost,
    packaging_cost: packagingCost,
    labor_cost: laborCost,
    energy_cost: energyCost,
    other_costs: otherCosts,
    desired_margin: strategy === "margin" ? strategyValue : null,
    desired_markup: strategy === "markup" ? strategyValue : null,
    intended_price: strategy === "price" ? strategyValue : null,
    total_cost: totalCost,
    recommended_price: recommendedPrice,
    created_by: user?.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/precificacao");

  return {
    result: { totalCost, recommendedPrice, productId },
  };
}

export async function applySimulation(
  productId: string,
  newCost: number,
  newPrice: number
) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("apply_price_simulation", {
    p_product_id: productId,
    p_new_cost: newCost,
    p_new_price: newPrice,
  });

  if (!error) {
    revalidatePath("/produtos");
    revalidatePath("/precificacao");
  }

  return { error: error?.message };
}
