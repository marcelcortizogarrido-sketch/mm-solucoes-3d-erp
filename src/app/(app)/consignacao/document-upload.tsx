"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function DocumentUpload({
  name,
  label,
  defaultValue,
  accept,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  accept?: string;
}) {
  const [fileUrl, setFileUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(undefined);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("consignment-documents")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setError("Falha ao enviar o arquivo.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("consignment-documents").getPublicUrl(path);
    setFileUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      <input type="hidden" name={name} value={fileUrl} />

      <div className="flex items-center gap-2">
        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-primary underline-offset-4 hover:underline"
          >
            <FileText className="size-4" />
            Ver arquivo enviado
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">Nenhum arquivo enviado</span>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
          {fileUrl ? "Trocar" : "Enviar"}
        </Button>

        {fileUrl && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setFileUrl("")}
            aria-label="Remover arquivo"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
