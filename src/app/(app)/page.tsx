import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/supabase/current-user";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Olá, {user?.fullName.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo(a) ao ERP da MM Soluções 3D.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fase 1 em andamento</CardTitle>
          <CardDescription>
            Produtos, categorias, precificação e estoque serão implementados
            a seguir.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
