import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";
import { PartnerActiveSwitch } from "./partner-active-switch";
import { PartnerFormDialog } from "./partner-form-dialog";
import { ShipmentsTable } from "./shipments-table";

export default async function ConsignacaoPage() {
  const supabase = await createClient();

  const [{ data: summary }, { data: shipments }, { data: partners }] = await Promise.all([
    supabase
      .from("consignment_summary")
      .select("*")
      .order("location_name")
      .order("product_name"),
    supabase
      .from("consignment_shipments")
      .select("id, delivery_date, nf_number, billing_amount, consignment_partners(name)")
      .order("delivery_date", { ascending: false }),
    supabase.from("consignment_partners").select("*").order("name"),
  ]);

  const byLocation = new Map<string, { name: string; rows: NonNullable<typeof summary> }>();

  for (const row of summary ?? []) {
    if (!row.location_id) continue;
    const entry = byLocation.get(row.location_id);
    if (entry) {
      entry.rows.push(row);
    } else {
      byLocation.set(row.location_id, { name: row.location_name ?? "—", rows: [row] });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Consignação</h1>
          <p className="text-muted-foreground">
            Parceiros, envios e o que está em consignação hoje.
          </p>
        </div>
        <Button asChild>
          <Link href="/consignacao/novo">
            <Plus />
            Novo envio
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="resumo">
        <TabsList>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="envios">Envios</TabsTrigger>
          <TabsTrigger value="parceiros">Parceiros</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="flex flex-col gap-4">
          {byLocation.size === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Nenhuma movimentação de consignação ainda</CardTitle>
                <CardDescription>
                  Clique em &quot;Novo envio&quot; para registrar o primeiro.
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
        </TabsContent>

        <TabsContent value="envios">
          <ShipmentsTable shipments={shipments ?? []} />
        </TabsContent>

        <TabsContent value="parceiros" className="flex flex-col gap-4">
          <div className="flex justify-end">
            <PartnerFormDialog />
          </div>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Local</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead className="w-16 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners?.length ? (
                  partners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">{partner.name}</TableCell>
                      <TableCell>{partner.cnpj || "—"}</TableCell>
                      <TableCell>{partner.address || "—"}</TableCell>
                      <TableCell>{partner.contact || "—"}</TableCell>
                      <TableCell>
                        <PartnerActiveSwitch id={partner.id} active={partner.active} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <PartnerFormDialog partner={partner} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Nenhum parceiro cadastrado ainda.
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
