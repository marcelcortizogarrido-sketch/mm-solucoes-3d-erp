export type PricingStrategy = "margin" | "markup" | "price";

export function calculateTotalCost(inputs: {
  materialCost: number;
  packagingCost: number;
  laborCost: number;
  energyCost: number;
  otherCosts: number;
}) {
  return (
    inputs.materialCost +
    inputs.packagingCost +
    inputs.laborCost +
    inputs.energyCost +
    inputs.otherCosts
  );
}

/** margem desejada = (preço - custo) / preço */
export function priceFromMargin(totalCost: number, marginPercent: number) {
  if (marginPercent >= 100) return totalCost;
  return totalCost / (1 - marginPercent / 100);
}

/** markup desejado = (preço - custo) / custo */
export function priceFromMarkup(totalCost: number, markupPercent: number) {
  return totalCost * (1 + markupPercent / 100);
}

export function resultingMargin(totalCost: number, price: number) {
  if (price <= 0) return 0;
  return ((price - totalCost) / price) * 100;
}

export function resultingMarkup(totalCost: number, price: number) {
  if (totalCost <= 0) return 0;
  return ((price - totalCost) / totalCost) * 100;
}

export function calculateRecommendedPrice(
  totalCost: number,
  strategy: PricingStrategy,
  value: number
) {
  if (strategy === "margin") return priceFromMargin(totalCost, value);
  if (strategy === "markup") return priceFromMarkup(totalCost, value);
  return value;
}
