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
import { createPartner, updatePartner, type FormState } from "./actions";

const initialState: FormState = {};

export function PartnerFormDialog({
  partner,
}: {
  partner?: Tables<"consignment_partners">;
}) {
  const [open, setOpen] = useState(false);
  const action = partner ? updatePartner : createPartner;
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
      {partner ? (
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Editar parceiro">
          <Pencil className="size-4" />
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus />
          Novo parceiro
        </Button>
      )}

      <DialogContent>
        <form action={formAction} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{partner ? "Editar parceiro" : "Novo parceiro de consignação"}</DialogTitle>
          </DialogHeader>

          {partner && <input type="hidden" name="id" value={partner.id} />}

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Local (nome do parceiro)</Label>
            <Input id="name" name="name" defaultValue={partner?.name} required autoFocus />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" name="cnpj" defaultValue={partner?.cnpj ?? ""} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" name="address" defaultValue={partner?.address ?? ""} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact">Contato</Label>
            <Input
              id="contact"
              name="contact"
              defaultValue={partner?.contact ?? ""}
              placeholder="Nome, telefone..."
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
