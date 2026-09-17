"use client";

import { useState, useTransition } from "react";

import { Switch } from "@/components/ui/switch";
import { toggleCategoryActive } from "./actions";

export function CategoryActiveSwitch({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const [checked, setChecked] = useState(active);
  const [isPending, startTransition] = useTransition();

  return (
    <Switch
      checked={checked}
      disabled={isPending}
      onCheckedChange={(next) => {
        setChecked(next);
        startTransition(async () => {
          const result = await toggleCategoryActive(id, next);
          if (result.error) {
            setChecked(!next);
          }
        });
      }}
      aria-label={active ? "Desativar categoria" : "Ativar categoria"}
    />
  );
}
