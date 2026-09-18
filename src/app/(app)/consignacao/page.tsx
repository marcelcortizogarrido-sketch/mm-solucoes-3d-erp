import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { MovementFormDialog } from "../estoque/movement-form-dialog";

export default async function ConsignacaoPage() {
  const supabase = await createClient();

  const [{ data: summary }, { data: products }, { data: locations }] = await Promise.all([
    supabase
      .from("consignment_summary")
      .select("*")
      .order("location_name")
      .order("product_name"),
    supabase.from("products").select("*").eq("status", "ativo").order("name"),
    supabase.from("stock_locations").select("*").order("name"),
  ]);

  const byLocation = new Map<string, { name: string; rows: NonNullable<typeof summary> }>();

  for (const row of summary ?? []) {
    if (!row.location_id) continue;
    const entry = byLocation.get(row.location_id);
    if (entry) {
      entry.rows.push(row);
    } else {
      byLocation.set(row.location_id, {
        name: row.location_name ?? "—",
        rows: [row],
      });
    }
  }

  const consignmentLocations = (locations ?? []).filter((l) => l.type === "consignacao");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Consignação</h1>
          <p className="text-muted-foreground">
            Acompanhe o que foi enviado, vendido e retornado em cada parceiro.
          </p>
        </div>
        <MovementFormDialog products={products ?? []} locations={locations ?? []} />
      </div>

      {consignmentLocations.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum local de consignação cadastrado</CardTitle>
            <CardDescription>
              Vá em Estoque → Locais, crie um novo local e escolha o tipo
              &quot;Consignação&quot; para ele aparecer aqui.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {Array.from(byLocation.entries()).map(([locationId, { name, rows }]) => (
        <Card key={locationId}>
          <CardHeader>
            <CardTitle>{name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Enviado</TableHead>
                    <TableHead className="text-right">Vendido</TableHead>
                    <TableHead className="text-right">Retornado</TableHead>
                    <TableHead className="text-right">Saldo atual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.product_id}>
                      <TableCell className="font-mono text-xs">{row.sku}</TableCell>
                      <TableCell className="font-medium">{row.product_name}</TableCell>
                      <TableCell className="text-right">{row.sent_quantity}</TableCell>
                      <TableCell className="text-right">{row.sold_quantity}</TableCell>
                      <TableCell className="text-right">{row.returned_quantity}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {row.current_quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}

      {consignmentLocations.length > 0 && byLocation.size === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma movimentação de consignação ainda</CardTitle>
            <CardDescription>
              Registre um &quot;Envio para consignação&quot; para um produto e ele
              aparecerá aqui.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
