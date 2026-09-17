import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">MM Soluções 3D</CardTitle>
          <CardDescription>Entre com seu e-mail e senha para acessar o ERP.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm next={next ?? "/"} />
        </CardContent>
      </Card>
    </div>
  );
}
