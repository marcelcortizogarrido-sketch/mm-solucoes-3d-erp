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
import type { Tables } from "@/lib/supabase/database.types";
import { createCategory, updateCategory, type CategoryFormState } from "./actions";

const initialState: CategoryFormState = {};

export function CategoryFormDialog({
  category,
}: {
  category?: Tables<"categories">;
}) {
  const [open, setOpen] = useState(false);
  const action = category ? updateCategory : createCategory;
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (open && !pending && !state.error && state !== initialState) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fecha o dialog quando a Server Action retorna sucesso
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
      }}
    >
      {category ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          aria-label="Editar categoria"
        >
          <Pencil className="size-4" />
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus />
          Nova categoria
        </Button>
      )}

      <DialogContent>
        <form action={formAction} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>
              {category ? "Editar categoria" : "Nova categoria"}
            </DialogTitle>
          </DialogHeader>

          {category && <input type="hidden" name="id" value={category.id} />}

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              defaultValue={category?.name}
              required
              autoFocus
            />
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
