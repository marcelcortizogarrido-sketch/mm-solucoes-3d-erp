"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tables } from "@/lib/supabase/database.types";
import { updateShipmentBilling, type FormState } from "./actions";
import { DocumentUpload } from "./document-upload";

const initialState: FormState = {};

export function BillingForm({ shipment }: { shipment: Tables<"consignment_shipments"> }) {
  const [state, formAction, pending] = useActionState(updateShipmentBilling, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={shipment.id} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="billing_amount">Valor de cobrança após vendas (R$)</Label>
          <Input
            id="billing_amount"
            name="billing_amount"
            inputMode="decimal"
            defaultValue={shipment.billing_amount ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="billing_nf_number">Nota fiscal de cobrança — número</Label>
          <Input
            id="billing_nf_number"
            name="billing_nf_number"
            defaultValue={shipment.billing_nf_number ?? ""}
          />
        </div>
      </div>

      <DocumentUpload
        name="billing_nf_file_url"
        label="Nota fiscal de cobrança — documento"
        defaultValue={shipment.billing_nf_file_url}
      />

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          Salvar cobrança
        </Button>
      </div>
    </form>
  );
}
