"use client";

import { useState, useTransition } from "react";

import { Switch } from "@/components/ui/switch";
import { toggleLocationActive } from "./actions";

export function LocationActiveSwitch({ id, active }: { id: string; active: boolean }) {
  const [checked, setChecked] = useState(active);
  const [isPending, startTransition] = useTransition();

  return (
    <Switch
      checked={checked}
      disabled={isPending}
      onCheckedChange={(next) => {
        setChecked(next);
        startTransition(async () => {
          const result = await toggleLocationActive(id, next);
          if (result.error) {
            setChecked(!next);
          }
        });
      }}
      aria-label={active ? "Desativar local" : "Ativar local"}
    />
  );
}
