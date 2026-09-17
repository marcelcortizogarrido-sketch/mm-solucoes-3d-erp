import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Em breve</CardTitle>
          <CardDescription>
            Esta área será construída na Fase 1 do projeto.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
