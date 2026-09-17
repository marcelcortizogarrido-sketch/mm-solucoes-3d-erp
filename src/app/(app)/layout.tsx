import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { getCurrentUser } from "@/lib/supabase/current-user";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // O proxy já protege as rotas, isso é apenas uma segunda barreira defensiva.
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-svh">
      <AppSidebar user={user} />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader user={user} />

        <main className="flex-1 overflow-x-hidden p-4 pb-20 lg:p-6 lg:pb-6">
          {children}
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
}
