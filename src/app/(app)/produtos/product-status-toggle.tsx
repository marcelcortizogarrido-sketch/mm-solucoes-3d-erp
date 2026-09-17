"use client";

import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { setProductStatus } from "./actions";

export function ProductStatusToggle({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = current === "ativo" ? "inativo" : "ativo";
    setCurrent(next);
    startTransition(async () => {
      const result = await setProductStatus(id, next);
      if (result.error) {
        setCurrent(current);
      }
    });
  }

  return (
    <button type="button" onClick={toggle} disabled={isPending} className="cursor-pointer">
      <Badge variant={current === "ativo" ? "default" : "secondary"}>
        {current === "ativo" ? "Ativo" : "Inativo"}
      </Badge>
    </button>
  );
}
