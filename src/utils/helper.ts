import path from "path";
import slugify from "slugify";

export function normalizeImages(images: any[]): string[] {
    if (!Array.isArray(images)) return [];

    return images
        .map(img => {
            if (typeof img?.saved_path === "string") {
                return path.basename(img.saved_path);
            }
            return null;
        })
        .filter(Boolean) as string[];
}



export function sanitizeFilename(originalName: string) {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);

  const safeBase = slugify(base, {
    lower: false,
    strict: true,   // ❗ remove all special chars
    locale: "vi",
  });

  return `${Date.now()}-${safeBase}${ext}`;
}
