import path from "path";

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
