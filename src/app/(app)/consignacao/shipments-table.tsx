import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";

type ShipmentRow = {
  id: string;
  delivery_date: string;
  nf_number: string | null;
  billing_amount: number | null;
  consignment_partners: { name: string } | null;
};

export function ShipmentsTable({ shipments }: { shipments: ShipmentRow[] }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Parceiro</TableHead>
            <TableHead>Data de entrega</TableHead>
            <TableHead>NF de consignação</TableHead>
            <TableHead className="text-right">Valor de cobrança</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.length ? (
            shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/consignacao/${shipment.id}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {shipment.consignment_partners?.name ?? "—"}
                  </Link>
                </TableCell>
                <TableCell>
                  {new Date(shipment.delivery_date).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>{shipment.nf_number || "—"}</TableCell>
                <TableCell className="text-right">
                  {shipment.billing_amount != null
                    ? formatCurrency(shipment.billing_amount)
                    : "—"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                Nenhum envio de consignação registrado ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
