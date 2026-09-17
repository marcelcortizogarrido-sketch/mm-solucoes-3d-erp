"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImageOff, Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function PhotoUpload({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string | null;
}) {
  const [photoUrl, setPhotoUrl] = useState(defaultValue ?? "");
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
      .from("product-photos")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setError("Falha ao enviar a foto.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("product-photos").getPublicUrl(path);
    setPhotoUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={photoUrl} />

      <div className="flex items-center gap-4">
        <div className="flex size-20 items-center justify-center overflow-hidden rounded-md border bg-muted">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt="Foto do produto"
              width={80}
              height={80}
              className="size-20 object-cover"
              unoptimized
            />
          ) : (
            <ImageOff className="size-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
            {photoUrl ? "Trocar foto" : "Enviar foto"}
          </Button>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
