import { createClient } from "@/lib/supabase/server";
import { Simulator } from "./simulator";

export default async function PrecificacaoPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, sku, name, cost, sale_price")
    .eq("status", "ativo")
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Precificação</h1>
        <p className="text-muted-foreground">
          Simule custos e calcule o preço de venda recomendado.
        </p>
      </div>

      <Simulator products={products ?? []} />
    </div>
  );
}
