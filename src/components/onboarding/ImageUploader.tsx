import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

const IMAGE_RULES = {
  maxFiles: 10,
  maxSizeMB: 5,
  acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
};

interface ImagePreview {
  file: File;
  url: string;
}

interface Props {
  value: File[];
  onChange: (files: File[]) => void;
}

export function ImageUploader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<ImagePreview[]>(
    value.map((file) => ({ file, url: URL.createObjectURL(file) })),
  );

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const accepted: File[] = [];
    for (const file of Array.from(incoming)) {
      if (!IMAGE_RULES.acceptedFormats.includes(file.type)) {
        toast.error(`${file.name}: unsupported format (use JPG, PNG, or WEBP)`);
        continue;
      }
      if (file.size > IMAGE_RULES.maxSizeMB * 1024 * 1024) {
        toast.error(`${file.name}: exceeds ${IMAGE_RULES.maxSizeMB}MB`);
        continue;
      }
      accepted.push(file);
    }
    const merged = [...value, ...accepted].slice(0, IMAGE_RULES.maxFiles);
    const newPreviews = merged.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    // Revoke old object URLs we're replacing
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews(newPreviews);
    onChange(merged);
  };

  const remove = (idx: number) => {
    URL.revokeObjectURL(previews[idx].url);
    const next = value.filter((_, i) => i !== idx);
    setPreviews(previews.filter((_, i) => i !== idx));
    onChange(next);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/50"
      >
        <Upload className="h-8 w-8 text-slate-400" />
        <p className="mt-2 text-sm font-medium text-foreground">
          Click to upload property images
        </p>
        <p className="text-xs text-muted-foreground">
          JPG, PNG, or WEBP · up to {IMAGE_RULES.maxSizeMB}MB each ·{" "}
          {IMAGE_RULES.maxFiles} max
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_RULES.acceptedFormats.join(",")}
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {previews.length > 0 && (
        <>
          <p className="mt-3 text-xs text-muted-foreground">
            {previews.length} / {IMAGE_RULES.maxFiles} images uploaded
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {previews.map((p, idx) => (
              <div
                key={p.url}
                className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200"
              >
                <img
                  src={p.url}
                  alt={`Property ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  aria-label="Remove image"
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
