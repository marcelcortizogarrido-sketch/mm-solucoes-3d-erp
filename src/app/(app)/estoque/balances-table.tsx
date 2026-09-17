import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type BalanceRow = {
  quantity: number;
  products: { sku: string; name: string; min_stock: number } | null;
  stock_locations: { name: string } | null;
};

export function BalancesTable({ balances }: { balances: BalanceRow[] }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Local</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {balances.length ? (
            balances.map((balance, i) => {
              const belowMin =
                balance.products && balance.quantity < balance.products.min_stock;

              return (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs">
                    {balance.products?.sku}
                  </TableCell>
                  <TableCell className="font-medium">{balance.products?.name}</TableCell>
                  <TableCell>{balance.stock_locations?.name}</TableCell>
                  <TableCell
                    className={`text-right ${belowMin ? "font-semibold text-destructive" : ""}`}
                  >
                    {balance.quantity}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                Nenhum saldo de estoque registrado ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
