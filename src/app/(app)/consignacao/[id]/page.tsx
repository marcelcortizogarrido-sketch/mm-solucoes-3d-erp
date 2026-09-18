import { FileText } from "lucide-react";
import { notFound } from "next/navigation";

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
import { formatCurrency } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { BillingForm } from "../billing-form";

function DocumentLink({ url, label }: { url: string | null; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
        >
          <FileText className="size-4" />
          Ver arquivo
        </a>
      ) : (
        <span className="text-sm">—</span>
      )}
    </div>
  );
}

export default async function EnvioConsignacaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: shipment }, { data: items }] = await Promise.all([
    supabase
      .from("consignment_shipments")
      .select("*, consignment_partners(name, cnpj, address, contact)")
      .eq("id", id)
      .single(),
    supabase
      .from("consignment_shipment_items")
      .select("id, quantity, products(sku, name)")
      .eq("shipment_id", id),
  ]);

  if (!shipment) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Envio para {shipment.consignment_partners?.name}
        </h1>
        <p className="text-muted-foreground">
          Entregue em {new Date(shipment.delivery_date).toLocaleDateString("pt-BR")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parceiro</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <span className="text-sm text-muted-foreground">CNPJ</span>
            <p className="text-sm">{shipment.consignment_partners?.cnpj || "—"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Endereço</span>
            <p className="text-sm">{shipment.consignment_partners?.address || "—"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Contato</span>
            <p className="text-sm">{shipment.consignment_partners?.contact || "—"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produtos enviados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.products?.sku}</TableCell>
                    <TableCell>{item.products?.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentos da entrega</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <DocumentLink url={shipment.delivery_photo_url} label="Foto da entrega" />
          <DocumentLink url={shipment.romaneio_file_url} label="Romaneio" />
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">
              Nota fiscal de consignação {shipment.nf_number ? `(nº ${shipment.nf_number})` : ""}
            </span>
            {shipment.nf_file_url ? (
              <a
                href={shipment.nf_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
              >
                <FileText className="size-4" />
                Ver arquivo
              </a>
            ) : (
              <span className="text-sm">—</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cobrança</CardTitle>
          <CardDescription>
            Preencha depois que as vendas do parceiro forem apuradas.
            {shipment.billing_amount != null && (
              <> Valor atual: {formatCurrency(shipment.billing_amount)}.</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BillingForm shipment={shipment} />
        </CardContent>
      </Card>
    </div>
  );
}
