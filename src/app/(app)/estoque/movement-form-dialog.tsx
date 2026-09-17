"use client";

import { useActionState, useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { getMovementDirection, MOVEMENT_TYPES } from "@/lib/stock";
import { registerMovement, type FormState } from "./actions";

const initialState: FormState = {};

export function MovementFormDialog({
  products,
  locations,
}: {
  products: Tables<"products">[];
  locations: Tables<"stock_locations">[];
}) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string>("");
  const [state, formAction, pending] = useActionState(registerMovement, initialState);

  useEffect(() => {
    if (open && !pending && !state.error && state !== initialState) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fecha o dialog quando a Server Action retorna sucesso
      setOpen(false);
      setType("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const direction = getMovementDirection(type);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Nova movimentação
      </Button>

      <DialogContent className="sm:max-w-xl">
        <form action={formAction} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Nova movimentação de estoque</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="product_id">Produto</Label>
              <Select name="product_id" required>
                <SelectTrigger id="product_id" className="w-full">
                  <SelectValue placeholder="Selecione um produto" />
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

            <div className="flex flex-col gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select name="type" value={type} onValueChange={setType} required>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {MOVEMENT_TYPES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input id="quantity" name="quantity" inputMode="decimal" required />
            </div>

            {(direction === "out" || direction === "transfer") && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="origin_location_id">Local de origem</Label>
                <Select name="origin_location_id" required>
                  <SelectTrigger id="origin_location_id" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(direction === "in" || direction === "transfer") && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="destination_location_id">Local de destino</Label>
                <Select name="destination_location_id" required>
                  <SelectTrigger id="destination_location_id" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="reason">Motivo</Label>
              <Input id="reason" name="reason" placeholder="Opcional" />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea id="notes" name="notes" rows={2} />
            </div>
          </div>

          {state?.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending || !type}>
              {pending && <Loader2 className="animate-spin" />}
              Registrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
