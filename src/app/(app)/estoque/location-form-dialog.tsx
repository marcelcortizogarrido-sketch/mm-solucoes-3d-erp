"use client";

import { useActionState, useEffect, useState } from "react";
import { Loader2, Pencil, Plus } from "lucide-react";

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
import { LOCATION_TYPES } from "@/lib/stock";
import type { Tables } from "@/lib/supabase/database.types";
import { createLocation, updateLocation, type FormState } from "./actions";

const initialState: FormState = {};

export function LocationFormDialog({
  location,
}: {
  location?: Tables<"stock_locations">;
}) {
  const [open, setOpen] = useState(false);
  const action = location ? updateLocation : createLocation;
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (open && !pending && !state.error && state !== initialState) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fecha o dialog quando a Server Action retorna sucesso
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {location ? (
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Editar local">
          <Pencil className="size-4" />
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus />
          Novo local
        </Button>
      )}

      <DialogContent>
        <form action={formAction} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{location ? "Editar local" : "Novo local de estoque"}</DialogTitle>
          </DialogHeader>

          {location && <input type="hidden" name="id" value={location.id} />}

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" defaultValue={location?.name} required autoFocus />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Tipo</Label>
            <Select name="type" defaultValue={location?.type ?? "principal"}>
              <SelectTrigger id="type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCATION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {state?.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
