import type { Enums } from "@/lib/supabase/database.types";

export type StockMovementType = Enums<"stock_movement_type">;

type Direction = "in" | "out" | "transfer";

export const MOVEMENT_TYPES: {
  value: StockMovementType;
  label: string;
  direction: Direction;
}[] = [
  { value: "entrada", label: "Entrada", direction: "in" },
  { value: "producao", label: "Produção", direction: "in" },
  { value: "compra", label: "Compra", direction: "in" },
  { value: "reposicao", label: "Reposição", direction: "in" },
  { value: "devolucao", label: "Devolução de cliente", direction: "in" },
  { value: "ajuste_positivo", label: "Ajuste positivo", direction: "in" },
  { value: "venda", label: "Venda", direction: "out" },
  { value: "perda", label: "Perda", direction: "out" },
  { value: "avaria", label: "Avaria", direction: "out" },
  { value: "ajuste_negativo", label: "Ajuste negativo", direction: "out" },
  { value: "transferencia", label: "Transferência entre locais", direction: "transfer" },
  { value: "envio_consignacao", label: "Envio para consignação", direction: "transfer" },
  { value: "retorno_consignacao", label: "Retorno de consignação", direction: "transfer" },
];

export function getMovementDirection(type: string): Direction {
  return MOVEMENT_TYPES.find((m) => m.value === type)?.direction ?? "in";
}

export function getMovementLabel(type: string) {
  return MOVEMENT_TYPES.find((m) => m.value === type)?.label ?? type;
}
