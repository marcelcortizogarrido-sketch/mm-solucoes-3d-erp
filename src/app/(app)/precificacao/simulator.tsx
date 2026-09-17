"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/format";
import {
  calculateRecommendedPrice,
  calculateTotalCost,
  resultingMargin,
  resultingMarkup,
  type PricingStrategy,
} from "@/lib/pricing";
import type { Tables } from "@/lib/supabase/database.types";
import { applySimulation, createSimulation, type SimulationFormState } from "./actions";

const initialState: SimulationFormState = {};

type Product = Pick<Tables<"products">, "id" | "sku" | "name" | "cost" | "sale_price">;

export function Simulator({ products }: { products: Product[] }) {
  const [productId, setProductId] = useState("");
  const [materialCost, setMaterialCost] = useState("0");
  const [packagingCost, setPackagingCost] = useState("0");
  const [laborCost, setLaborCost] = useState("0");
  const [energyCost, setEnergyCost] = useState("0");
  const [otherCosts, setOtherCosts] = useState("0");
  const [strategy, setStrategy] = useState<PricingStrategy>("margin");
  const [strategyValue, setStrategyValue] = useState("30");

  const [state, formAction, pending] = useActionState(createSimulation, initialState);
  const [applying, startApplying] = useTransition();
  const [applyError, setApplyError] = useState<string>();
  const [applied, setApplied] = useState(false);

  const totalCost = useMemo(
    () =>
      calculateTotalCost({
        materialCost: Number(materialCost) || 0,
        packagingCost: Number(packagingCost) || 0,
        laborCost: Number(laborCost) || 0,
        energyCost: Number(energyCost) || 0,
        otherCosts: Number(otherCosts) || 0,
      }),
    [materialCost, packagingCost, laborCost, energyCost, otherCosts]
  );

  const previewPrice = useMemo(
    () => calculateRecommendedPrice(totalCost, strategy, Number(strategyValue) || 0),
    [totalCost, strategy, strategyValue]
  );

  const selectedProduct = products.find((p) => p.id === productId);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Simular precificação</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={formAction}
            className="flex flex-col gap-6"
            onSubmit={() => {
              setApplied(false);
              setApplyError(undefined);
            }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="product_id">Produto</Label>
              <Select name="product_id" value={productId} onValueChange={setProductId} required>
                <SelectTrigger id="product_id" className="w-full">
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.sku} — {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProduct && (
                <p className="text-xs text-muted-foreground">
                  Custo atual: {formatCurrency(selectedProduct.cost)} · Preço atual:{" "}
                  {formatCurrency(selectedProduct.sale_price)}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="material_cost">Custo de material (R$)</Label>
                <Input
                  id="material_cost"
                  name="material_cost"
                  inputMode="decimal"
                  value={materialCost}
                  onChange={(e) => setMaterialCost(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="packaging_cost">Embalagem (R$)</Label>
                <Input
                  id="packaging_cost"
                  name="packaging_cost"
                  inputMode="decimal"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="labor_cost">Mão de obra (R$)</Label>
                <Input
                  id="labor_cost"
                  name="labor_cost"
                  inputMode="decimal"
                  value={laborCost}
                  onChange={(e) => setLaborCost(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="energy_cost">Energia (R$)</Label>
                <Input
                  id="energy_cost"
                  name="energy_cost"
                  inputMode="decimal"
                  value={energyCost}
                  onChange={(e) => setEnergyCost(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="other_costs">Outros custos (R$)</Label>
                <Input
                  id="other_costs"
                  name="other_costs"
                  inputMode="decimal"
                  value={otherCosts}
                  onChange={(e) => setOtherCosts(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Estratégia de preço</Label>
              <Tabs value={strategy} onValueChange={(v) => setStrategy(v as PricingStrategy)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="margin">Margem desejada</TabsTrigger>
                  <TabsTrigger value="markup">Markup desejado</TabsTrigger>
                  <TabsTrigger value="price">Preço pretendido</TabsTrigger>
                </TabsList>
                <TabsContent value="margin" className="pt-2">
                  <Label htmlFor="strategy_value_margin">Margem sobre o preço (%)</Label>
                  <Input
                    id="strategy_value_margin"
                    inputMode="decimal"
                    value={strategy === "margin" ? strategyValue : ""}
                    onChange={(e) => setStrategyValue(e.target.value)}
                    className="mt-2"
                  />
                </TabsContent>
                <TabsContent value="markup" className="pt-2">
                  <Label htmlFor="strategy_value_markup">Markup sobre o custo (%)</Label>
                  <Input
                    id="strategy_value_markup"
                    inputMode="decimal"
                    value={strategy === "markup" ? strategyValue : ""}
                    onChange={(e) => setStrategyValue(e.target.value)}
                    className="mt-2"
                  />
                </TabsContent>
                <TabsContent value="price" className="pt-2">
                  <Label htmlFor="strategy_value_price">Preço pretendido (R$)</Label>
                  <Input
                    id="strategy_value_price"
                    inputMode="decimal"
                    value={strategy === "price" ? strategyValue : ""}
                    onChange={(e) => setStrategyValue(e.target.value)}
                    className="mt-2"
                  />
                </TabsContent>
              </Tabs>
              <input type="hidden" name="strategy" value={strategy} />
              <input type="hidden" name="strategy_value" value={strategyValue} />
            </div>

            {state?.error && (
              <p className="text-sm text-destructive" role="alert">
                {state.error}
              </p>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={pending || !productId}>
                {pending && <Loader2 className="animate-spin" />}
                Salvar simulação
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Resultado</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Custo total</span>
            <span className="text-xl font-semibold">{formatCurrency(totalCost)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Preço sugerido</span>
            <span className="text-2xl font-bold">{formatCurrency(previewPrice)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <span>Margem resultante: {resultingMargin(totalCost, previewPrice).toFixed(1)}%</span>
            <span>Markup resultante: {resultingMarkup(totalCost, previewPrice).toFixed(1)}%</span>
          </div>

          {state.result && (
            <div className="flex flex-col gap-2 border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Simulação salva. Deseja aplicar esse preço ao produto?
              </p>
              {applyError && <p className="text-sm text-destructive">{applyError}</p>}
              {applied ? (
                <p className="text-sm font-medium text-primary">Preço aplicado ao produto!</p>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={applying}
                  onClick={() => {
                    startApplying(async () => {
                      const result = await applySimulation(
                        state.result!.productId,
                        state.result!.totalCost,
                        state.result!.recommendedPrice
                      );
                      if (result.error) {
                        setApplyError(result.error);
                      } else {
                        setApplied(true);
                      }
                    });
                  }}
                >
                  {applying && <Loader2 className="animate-spin" />}
                  Aplicar ao produto
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
