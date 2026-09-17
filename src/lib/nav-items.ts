import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  Tags,
  Calculator,
  Boxes,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/produtos", label: "Produtos", icon: Package },
  { href: "/categorias", label: "Categorias", icon: Tags },
  { href: "/precificacao", label: "Precificação", icon: Calculator },
  { href: "/estoque", label: "Estoque", icon: Boxes },
];

export const MOBILE_NAV_ITEMS = NAV_ITEMS.slice(0, 4);
