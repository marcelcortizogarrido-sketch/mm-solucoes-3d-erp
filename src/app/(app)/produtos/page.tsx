import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ProductsTable } from "./products-table";

export default async function ProdutosPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Cadastro de produtos, custos e preços de venda.
          </p>
        </div>
        <Button asChild>
          <Link href="/produtos/novo">
            <Plus />
            Novo produto
          </Link>
        </Button>
      </div>

      <ProductsTable products={products ?? []} />
    </div>
  );
}
