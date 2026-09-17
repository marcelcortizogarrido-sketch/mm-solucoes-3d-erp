import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";
import { BalancesTable } from "./balances-table";
import { DeleteLocationButton } from "./delete-location-button";
import { LocationActiveSwitch } from "./location-active-switch";
import { LocationFormDialog } from "./location-form-dialog";
import { MovementFormDialog } from "./movement-form-dialog";
import { MovementsTable } from "./movements-table";

export default async function EstoquePage() {
  const supabase = await createClient();

  const [
    { data: balances },
    { data: movements },
    { data: locations },
    { data: products },
  ] = await Promise.all([
    supabase
      .from("stock_balances")
      .select("quantity, products(sku, name, min_stock), stock_locations(name)")
      .order("product_id"),
    supabase
      .from("stock_movements")
      .select(
        "id, type, quantity, reason, created_at, products(sku, name), origin:stock_locations!stock_movements_origin_location_id_fkey(name), destination:stock_locations!stock_movements_destination_location_id_fkey(name)"
      )
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.from("stock_locations").select("*").order("name"),
    supabase
      .from("products")
      .select("*")
      .eq("status", "ativo")
      .order("name"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Estoque</h1>
        <p className="text-muted-foreground">
          Saldos, movimentações e locais de estoque.
        </p>
      </div>

      <Tabs defaultValue="saldos">
        <TabsList>
          <TabsTrigger value="saldos">Saldos</TabsTrigger>
          <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
          <TabsTrigger value="locais">Locais</TabsTrigger>
        </TabsList>

        <TabsContent value="saldos" className="flex flex-col gap-4">
          <BalancesTable balances={balances ?? []} />
        </TabsContent>

        <TabsContent value="movimentacoes" className="flex flex-col gap-4">
          <div className="flex justify-end">
            <MovementFormDialog products={products ?? []} locations={locations ?? []} />
          </div>
          <MovementsTable movements={movements ?? []} />
        </TabsContent>

        <TabsContent value="locais" className="flex flex-col gap-4">
          <div className="flex justify-end">
            <LocationFormDialog />
          </div>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations?.length ? (
                  locations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>{location.type}</TableCell>
                      <TableCell>
                        <LocationActiveSwitch id={location.id} active={location.active} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <LocationFormDialog location={location} />
                          <DeleteLocationButton id={location.id} name={location.name} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      Nenhum local cadastrado ainda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
