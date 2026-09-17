"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/lib/nav-items";
import { cn } from "@/lib/utils";
import type { CurrentUser } from "@/lib/supabase/current-user";
import { UserMenu } from "@/components/user-menu";
import { usePathname } from "next/navigation";

export function MobileHeader({ user }: { user: CurrentUser }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center justify-between border-b px-3 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Abrir menu">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>MM Soluções 3D</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-3">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <span className="font-semibold">MM Soluções 3D</span>

      <UserMenu user={user} />
    </header>
  );
}
