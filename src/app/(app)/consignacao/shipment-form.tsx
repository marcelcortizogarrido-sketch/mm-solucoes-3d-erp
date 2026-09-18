"use client";

import { useActionState, useMemo, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

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
import { createShipment, type FormState, type ShipmentItemInput } from "./actions";
import { DocumentUpload } from "./document-upload";

const initialState: FormState = {};

type Product = Pick<Tables<"products">, "id" | "sku" | "name">;
type Location = Pick<Tables<"stock_locations">, "id" | "name" | "type">;
type Partner = Pick<Tables<"consignment_partners">, "id" | "name">;

export function ShipmentForm({
  partners,
  products,
  locations,
}: {
  partners: Partner[];
  products: Product[];
  locations: Location[];
}) {
  const [state, formAction, pending] = useActionState(createShipment, initialState);
  const [items, setItems] = useState<ShipmentItemInput[]>([{ product_id: "", quantity: 0 }]);

  const originLocations = useMemo(
    () => locations.filter((l) => l.type !== "consignacao"),
    [locations]
  );

  function updateItem(index: number, patch: Partial<ShipmentItemInput>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function addItem() {
    setItems((prev) => [...prev, { product_id: "", quantity: 0 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="partner_id">Parceiro</Label>
          <Select name="partner_id" required>
            <SelectTrigger id="partner_id" className="w-full">
              <SelectValue placeholder="Selecione um parceiro" />
            </SelectTrigger>
            <SelectContent>
              {partners.map((partner) => (
                <SelectItem key={partner.id} value={partner.id}>
                  {partner.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {partners.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Cadastre um parceiro na aba &quot;Parceiros&quot; antes de registrar um envio.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="origin_location_id">Saindo de</Label>
          <Select name="origin_location_id" required>
            <SelectTrigger id="origin_location_id" className="w-full">
              <SelectValue placeholder="Selecione o local de origem" />
            </SelectTrigger>
            <SelectContent>
              {originLocations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="delivery_date">Data de entrega</Label>
          <Input id="delivery_date" name="delivery_date" type="date" required />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Produtos enviados</Label>
        {items.map((item, index) => (
          <div key={index} className="flex items-end gap-2">
            <div className="flex-1">
              <Select
                value={item.product_id}
                onValueChange={(value) => updateItem(index, { product_id: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.sku} — {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-28">
              <Input
                type="number"
                min="0"
                inputMode="decimal"
                placeholder="Qtd."
                value={item.quantity || ""}
                onChange={(e) => updateItem(index, { quantity: Number(e.target.value) || 0 })}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              disabled={items.length === 1}
              aria-label="Remover item"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="self-start">
          <Plus />
          Adicionar produto
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DocumentUpload name="delivery_photo_url" label="Foto da entrega" accept="image/*" />
        <DocumentUpload name="romaneio_file_url" label="Romaneio (anexo)" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="nf_number">Nota fiscal de consignação — número</Label>
          <Input id="nf_number" name="nf_number" />
        </div>
        <DocumentUpload name="nf_file_url" label="Nota fiscal de consignação — documento" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" name="notes" rows={2} />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          Registrar envio
        </Button>
      </div>
    </form>
  );
}
