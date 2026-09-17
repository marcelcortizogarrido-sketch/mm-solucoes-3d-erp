"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from "@/lib/supabase/database.types";
import { createProduct, updateProduct, type ProductFormState } from "./actions";
import { PhotoUpload } from "./photo-upload";

const initialState: ProductFormState = {};

export function ProductForm({
  product,
  categories,
}: {
  product?: Tables<"products">;
  categories: Tables<"categories">[];
}) {
  const action = product ? updateProduct : createProduct;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input id="sku" name="sku" defaultValue={product?.sku} required />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nome *</Label>
          <Input id="name" name="name" defaultValue={product?.name} required />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="internal_code">Código interno</Label>
          <Input
            id="internal_code"
            name="internal_code"
            defaultValue={product?.internal_code ?? ""}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="barcode">Código de barras</Label>
          <Input id="barcode" name="barcode" defaultValue={product?.barcode ?? ""} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="category_id">Categoria</Label>
          <Select name="category_id" defaultValue={product?.category_id ?? undefined}>
            <SelectTrigger id="category_id" className="w-full">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="unit">Unidade</Label>
          <Input id="unit" name="unit" defaultValue={product?.unit ?? "un"} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="cost">Custo (R$)</Label>
          <Input
            id="cost"
            name="cost"
            inputMode="decimal"
            defaultValue={product?.cost ?? 0}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="sale_price">Preço de venda (R$)</Label>
          <Input
            id="sale_price"
            name="sale_price"
            inputMode="decimal"
            defaultValue={product?.sale_price ?? 0}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="min_stock">Estoque mínimo</Label>
          <Input
            id="min_stock"
            name="min_stock"
            inputMode="decimal"
            defaultValue={product?.min_stock ?? 0}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={product?.status ?? "ativo"}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description ?? ""}
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Foto</Label>
        <PhotoUpload name="photo_url" defaultValue={product?.photo_url} />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          Salvar produto
        </Button>
      </div>
    </form>
  );
}
