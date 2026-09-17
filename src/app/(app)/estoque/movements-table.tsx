import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMovementLabel } from "@/lib/stock";

type MovementRow = {
  id: number;
  type: string;
  quantity: number;
  reason: string | null;
  created_at: string;
  products: { sku: string; name: string } | null;
  origin: { name: string } | null;
  destination: { name: string } | null;
};

export function MovementsTable({ movements }: { movements: MovementRow[] }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Origem</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead className="text-right">Qtd.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.length ? (
            movements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(movement.created_at).toLocaleString("pt-BR")}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{movement.products?.name}</span>{" "}
                  <span className="font-mono text-xs text-muted-foreground">
                    {movement.products?.sku}
                  </span>
                </TableCell>
                <TableCell>{getMovementLabel(movement.type)}</TableCell>
                <TableCell>{movement.origin?.name ?? "—"}</TableCell>
                <TableCell>{movement.destination?.name ?? "—"}</TableCell>
                <TableCell className="text-right">{movement.quantity}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                Nenhuma movimentação registrada ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
