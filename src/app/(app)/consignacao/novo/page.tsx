import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ShipmentForm } from "../shipment-form";

export default async function NovoEnvioConsignacaoPage() {
  const supabase = await createClient();

  const [{ data: partners }, { data: products }, { data: locations }] = await Promise.all([
    supabase
      .from("consignment_partners")
      .select("id, name")
      .eq("active", true)
      .order("name"),
    supabase
      .from("products")
      .select("id, sku, name")
      .eq("status", "ativo")
      .order("name"),
    supabase.from("stock_locations").select("id, name, type").order("name"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Novo envio de consignação</h1>
        <p className="text-muted-foreground">
          Registre os produtos enviados e os documentos da entrega.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do envio</CardTitle>
        </CardHeader>
        <CardContent>
          <ShipmentForm
            partners={partners ?? []}
            products={products ?? []}
            locations={locations ?? []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
